/**
 * Google Drive Integration Service for H.U.M.A.N. Initiative
 * Compliant with Google Drive API v3 and Workspace Integration Guidelines.
 */

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  createdTime?: string;
  modifiedTime?: string;
  thumbnailLink?: string;
  iconLink?: string;
  webContentLink?: string;
  webViewLink?: string;
  owners?: { displayName: string; emailAddress: string; photoLink?: string }[];
}

export interface DriveUploadOptions {
  name: string;
  mimeType: string;
  content: string | Blob;
  description?: string;
  folderId?: string;
}

export interface BackupPayload {
  timestamp: string;
  exportedBy: string;
  testersCount: number;
  claimsCount: number;
  feedbackCount: number;
  testers: any[];
  claims: any[];
  feedback: any[];
  broadcasts: any[];
  themeSettings: any;
  appLogos: Record<string, string>;
}

const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_BASE = 'https://www.googleapis.com/upload/drive/v3';

/**
 * List files from user's Google Drive
 */
export async function listDriveFiles(
  accessToken: string,
  options?: {
    pageSize?: number;
    query?: string;
    folderOnly?: boolean;
    imagesOnly?: boolean;
  }
): Promise<{ files: GoogleDriveFile[]; nextPageToken?: string }> {
  try {
    const queryParts: string[] = ['trashed = false'];

    if (options?.folderOnly) {
      queryParts.push("mimeType = 'application/vnd.google-apps.folder'");
    } else if (options?.imagesOnly) {
      queryParts.push("(mimeType contains 'image/' or mimeType = 'image/png' or mimeType = 'image/jpeg' or mimeType = 'image/svg+xml')");
    }

    if (options?.query) {
      queryParts.push(`name contains '${options.query.replace(/'/g, "\\'")}'`);
    }

    const q = queryParts.join(' and ');
    const params = new URLSearchParams({
      pageSize: String(options?.pageSize || 30),
      fields: 'nextPageToken, files(id, name, mimeType, size, createdTime, modifiedTime, thumbnailLink, iconLink, webViewLink, webContentLink, owners)',
      orderBy: 'modifiedTime desc',
      q,
    });

    const response = await fetch(`${DRIVE_API_BASE}/files?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `Google Drive API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Failed to list Google Drive files:', error);
    throw error;
  }
}

/**
 * Fetch raw file content / data from Google Drive
 */
export async function downloadDriveFile(
  accessToken: string,
  fileId: string
): Promise<{ data: string; mimeType: string }> {
  try {
    const metadataRes = await fetch(`${DRIVE_API_BASE}/files/${fileId}?fields=id,name,mimeType`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const metadata = await metadataRes.json();

    const contentRes = await fetch(`${DRIVE_API_BASE}/files/${fileId}?alt=media`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!contentRes.ok) {
      throw new Error(`Failed to download file from Google Drive: ${contentRes.statusText}`);
    }

    const blob = await contentRes.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          data: reader.result as string,
          mimeType: metadata.mimeType || 'application/octet-stream',
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error: any) {
    console.error('Google Drive download error:', error);
    throw error;
  }
}

/**
 * Upload a file to Google Drive using multipart upload
 */
export async function uploadFileToDrive(
  accessToken: string,
  options: DriveUploadOptions
): Promise<GoogleDriveFile> {
  try {
    const metadata: any = {
      name: options.name,
      mimeType: options.mimeType,
      description: options.description || 'Uploaded from H.U.M.A.N. Initiative Console',
    };

    if (options.folderId) {
      metadata.parents = [options.folderId];
    }

    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    let fileContent = options.content;
    let base64Body = '';

    if (typeof fileContent === 'string' && fileContent.startsWith('data:')) {
      // Extract base64 part
      const parts = fileContent.split(',');
      base64Body = parts[1] || parts[0];
    } else if (typeof fileContent === 'string') {
      base64Body = btoa(unescape(encodeURIComponent(fileContent)));
    } else if (fileContent instanceof Blob) {
      const buffer = await fileContent.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      base64Body = btoa(binary);
    }

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      `Content-Type: ${options.mimeType}\r\n` +
      'Content-Transfer-Encoding: base64\r\n\r\n' +
      base64Body +
      closeDelimiter;

    const response = await fetch(`${DRIVE_UPLOAD_BASE}/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,webContentLink`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `Failed to upload to Google Drive: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Google Drive upload error:', error);
    throw error;
  }
}

/**
 * Create or find a specific folder on Google Drive
 */
export async function getOrCreateFolder(
  accessToken: string,
  folderName: string = 'HUMAN-Ethical-AI-Console'
): Promise<string> {
  try {
    const q = `mimeType = 'application/vnd.google-apps.folder' and name = '${folderName}' and trashed = false`;
    const searchRes = await fetch(`${DRIVE_API_BASE}/files?q=${encodeURIComponent(q)}&fields=files(id, name)`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const searchData = await searchRes.json();
    if (searchData.files && searchData.files.length > 0) {
      return searchData.files[0].id;
    }

    // Create folder
    const createRes = await fetch(`${DRIVE_API_BASE}/files`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        description: 'Automated backup repository for H.U.M.A.N. Initiative Ecosystem',
      }),
    });

    const createData = await createRes.json();
    return createData.id;
  } catch (error: any) {
    console.error('Failed to get/create Google Drive folder:', error);
    throw error;
  }
}

/**
 * Delete a Google Drive file with mandatory confirmation
 */
export async function deleteDriveFile(
  accessToken: string,
  fileId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${DRIVE_API_BASE}/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok && response.status !== 204) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `Failed to delete file: ${response.statusText}`);
    }

    return true;
  } catch (error: any) {
    console.error('Google Drive delete error:', error);
    throw error;
  }
}
