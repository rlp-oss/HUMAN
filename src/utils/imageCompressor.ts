/**
 * Utility to compress images (File or Data URL) to a compact, optimized base64 string
 * suitable for localStorage and fast web rendering without exceeding storage quotas.
 */

export async function compressImage(
  fileOrUrl: File | string,
  maxWidth = 256,
  maxHeight = 256,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Scale down proportionally
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        // Fallback to original URL
        if (typeof fileOrUrl === 'string') resolve(fileOrUrl);
        else resolve('');
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Check format preference: WebP is ultra compact, fallback to PNG if transparent, or JPEG
      try {
        const compressedWebp = canvas.toDataURL('image/webp', quality);
        if (compressedWebp.startsWith('data:image/webp')) {
          resolve(compressedWebp);
          return;
        }
      } catch (e) {
        // Continue to png fallback
      }

      try {
        const compressedPng = canvas.toDataURL('image/png');
        resolve(compressedPng);
      } catch (e) {
        resolve(canvas.toDataURL('image/jpeg', quality));
      }
    };

    img.onerror = () => {
      if (typeof fileOrUrl === 'string') {
        resolve(fileOrUrl); // return input if cannot load
      } else {
        reject(new Error('Failed to load image for compression'));
      }
    };

    if (typeof fileOrUrl === 'string') {
      img.src = fileOrUrl;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        } else {
          reject(new Error('Failed to read file data'));
        }
      };
      reader.onerror = () => reject(new Error('FileReader error'));
      reader.readAsDataURL(fileOrUrl);
    }
  });
}
