import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  Check, 
  Copy, 
  Download, 
  RotateCcw, 
  Layers, 
  Sliders, 
  Maximize2, 
  Lock, 
  Unlock, 
  Zap, 
  Eye, 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle2, 
  Smartphone, 
  Monitor, 
  HardDrive, 
  Globe, 
  Scissors, 
  FileType,
  FileArchive,
  RefreshCw,
  FolderOpen,
  Link,
  Code,
  Tag,
  AlertCircle,
  HelpCircle,
  Database,
  Trash2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { 
  EmeraldHumanNetworkLogoIcon,
  MasterHumanBrandLogoIcon,
  TomeCrafterLogoIcon, 
  RlmProStudioLogoIcon, 
  ForgeOsLogoIcon, 
  RlEasyFlowLogoIcon 
} from './HumanLogo';
import JSZip from 'jszip';
import axios from 'axios';

export interface RecommendedSizePreset {
  id: string;
  name: string;
  category: 'icon' | 'navbar' | 'badge' | 'hero';
  width: number;
  height: number;
  description: string;
  recommendedFormat: 'png' | 'webp';
}

export const RECOMMENDED_LOGO_PRESETS: RecommendedSizePreset[] = [
  {
    id: 'pwa-master-512',
    name: 'App Store & PWA Master Icon',
    category: 'icon',
    width: 512,
    height: 512,
    description: 'High-res square master asset for iOS, Android, and Web App manifest',
    recommendedFormat: 'png'
  },
  {
    id: 'desktop-taskbar-128',
    name: 'Desktop & Taskbar Icon',
    category: 'icon',
    width: 128,
    height: 128,
    description: 'Crisp square icon for desktop menus, drawers, and sidebar taskbars',
    recommendedFormat: 'png'
  },
  {
    id: 'favicon-64',
    name: 'Browser Favicon & Touch Icon',
    category: 'icon',
    width: 64,
    height: 64,
    description: 'Standard browser tab icon and mobile home screen shortcut',
    recommendedFormat: 'png'
  },
  {
    id: 'navbar-logo-240',
    name: 'Navbar Brand Header',
    category: 'navbar',
    width: 240,
    height: 60,
    description: '4:1 horizontal logo banner with emblem and app title',
    recommendedFormat: 'png'
  },
  {
    id: 'navbar-compact-180',
    name: 'Compact Navbar Logo',
    category: 'navbar',
    width: 180,
    height: 48,
    description: 'Compact horizontal navigation logo for mobile & dense dashboards',
    recommendedFormat: 'webp'
  },
  {
    id: 'c2pa-seal-256',
    name: 'C2PA Trust Badge Seal',
    category: 'badge',
    width: 256,
    height: 256,
    description: 'Certified cryptographic human-provenance seal & QR anchor',
    recommendedFormat: 'png'
  },
  {
    id: 'hero-banner-800',
    name: 'Hero Splash & Banner',
    category: 'hero',
    width: 800,
    height: 200,
    description: 'Wide banner for documentation headers, README, and portal landing',
    recommendedFormat: 'webp'
  }
];

export const CONNECTED_ECOSYSTEM_APPS = [
  { id: 'human-master', name: 'The H.U.M.A.N. Initiative Master Hub', slug: 'human-master', defaultVariant: 'human-master', badge: 'Initiative' },
  { id: 'forgeos', name: 'ForgeOS App Builder', slug: 'forgeos', defaultVariant: 'forgeos', badge: 'Code AST' },
  { id: 'tome-crafter', name: 'Tome Crafter', slug: 'tome-crafter', defaultVariant: 'tome-crafter', badge: 'Books' },
  { id: 'rlm-pro-studio', name: 'RLM Pro Studio', slug: 'rlm-pro-studio', defaultVariant: 'rlm-pro-studio', badge: 'Audio Stems' },
  { id: 'rl-easy-flow', name: 'RL Easy Flow', slug: 'rl-easy-flow', defaultVariant: 'rl-easy-flow', badge: 'Video Frames' },
];

export interface ServerLogoAsset {
  id: string;
  filename: string;
  targetAppId: string;
  appName: string;
  dataUrl: string;
  contentType: string;
  byteSize: number;
  uniqueUrl: string;
  createdAt: string;
}

export const MasterLogoStudio: React.FC<{
  onClose?: () => void;
  initialTargetApp?: string;
}> = ({ onClose, initialTargetApp }) => {
  const { customAppLogos, setAppLogo, setAllAppLogos, mode } = useTheme();

  // Source & Upload States
  const [sourceType, setSourceType] = useState<'local' | 'gdrive' | 'preset' | 'catalog'>('local');
  const [sourceDataUrl, setSourceDataUrl] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('human_logo_studio_working_image') || null;
    }
    return null;
  });
  const [sourceFileName, setSourceFileName] = useState<string>('brand-logo.png');
  const [origDimensions, setOrigDimensions] = useState<{ width: number; height: number; byteSize: number } | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);

  // Google Drive states
  const [gdriveInputUrl, setGdriveInputUrl] = useState<string>('');
  const [gdriveLoading, setGdriveLoading] = useState<boolean>(false);
  const [gdriveError, setGdriveError] = useState<string | null>(null);

  // Resizing & Optimization controls
  const [targetWidth, setTargetWidth] = useState<number>(240);
  const [targetHeight, setTargetHeight] = useState<number>(60);
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [aspectRatioValue, setAspectRatioValue] = useState<number>(4); // default 240/60 = 4

  const [outputFormat, setOutputFormat] = useState<'png' | 'webp' | 'jpeg'>('png');
  const [compressionQuality, setCompressionQuality] = useState<number>(90); // 10 to 100
  const [fitMode, setFitMode] = useState<'contain' | 'cover' | 'fill'>('contain');
  const [paddingPx, setPaddingPx] = useState<number>(4);
  const [cornerRadiusPx, setCornerRadiusPx] = useState<number>(10);

  // Background & Alpha controls
  const [bgMode, setBgMode] = useState<'transparent' | 'chroma-remove' | 'solid-matte'>('transparent');
  const [solidMatteColor, setSolidMatteColor] = useState<string>('#101B18');
  const [chromaTolerance, setChromaTolerance] = useState<number>(25);

  // Visual Enhancements
  const [brightnessVal, setBrightnessVal] = useState<number>(100);
  const [contrastVal, setContrastVal] = useState<number>(100);
  const [cyberGlowOverlay, setCyberGlowOverlay] = useState<boolean>(false);

  // Active App Deployment Selection
  const [selectedAppTargets, setSelectedAppTargets] = useState<string[]>(() => {
    if (initialTargetApp) return [initialTargetApp];
    return ['human-master', 'forgeos', 'tome-crafter', 'rlm-pro-studio', 'rl-easy-flow'];
  });

  // Processed Output States
  const [processedDataUrl, setProcessedDataUrl] = useState<string | null>(null);
  const [optimizedByteSize, setOptimizedByteSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [applySuccessMessage, setApplySuccessMessage] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [activePreviewContext, setActivePreviewContext] = useState<'canvas' | 'navbar' | 'app-card' | 'badge'>('canvas');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // Server Asset Catalog & Collision Management
  const [serverCatalog, setServerCatalog] = useState<ServerLogoAsset[]>([]);
  const [catalogLoading, setCatalogLoading] = useState<boolean>(false);

  // Naming & Collision Modal State
  const [isNamingModalOpen, setIsNamingModalOpen] = useState<boolean>(false);
  const [pendingUploadData, setPendingUploadData] = useState<{
    dataUrl: string;
    originalFileName: string;
    suggestedFileName: string;
    targetAppName: string;
    targetAppId: string;
    isCollision: boolean;
  } | null>(null);
  const [customNameInput, setCustomNameInput] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch Server Catalog on Mount
  const refreshServerCatalog = useCallback(async () => {
    try {
      setCatalogLoading(true);
      const res = await axios.get('/api/ecosystem/logos');
      if (res.data && res.data.catalog) {
        setServerCatalog(res.data.catalog);
      }
    } catch (err) {
      console.warn('Could not fetch server logo catalog:', err);
    } finally {
      setCatalogLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshServerCatalog();
  }, [refreshServerCatalog]);

  // Load initial source image dimensions
  const measureSourceImage = useCallback((url: string, fileName = 'custom-logo.png') => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const byteLen = Math.round((url.length * 3) / 4);
      setOrigDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
        byteSize: byteLen
      });
      setSourceFileName(fileName);
      setAspectRatioValue(img.naturalWidth / img.naturalHeight);
    };
    img.src = url;
  }, []);

  useEffect(() => {
    if (sourceDataUrl) {
      measureSourceImage(sourceDataUrl, sourceFileName);
      localStorage.setItem('human_logo_studio_working_image', sourceDataUrl);
    }
  }, [sourceDataUrl, measureSourceImage, sourceFileName]);

  // Handle Preset selection
  const handleSelectPreset = (preset: RecommendedSizePreset) => {
    setTargetWidth(preset.width);
    setTargetHeight(preset.height);
    setOutputFormat(preset.recommendedFormat);
    setAspectRatioValue(preset.width / preset.height);
  };

  // Width & Height Change handlers with Aspect Ratio lock
  const handleWidthChange = (val: number) => {
    const w = Math.max(16, Math.min(2048, val));
    setTargetWidth(w);
    if (lockAspectRatio && aspectRatioValue > 0) {
      setTargetHeight(Math.max(16, Math.min(2048, Math.round(w / aspectRatioValue))));
    }
  };

  const handleHeightChange = (val: number) => {
    const h = Math.max(16, Math.min(2048, val));
    setTargetHeight(h);
    if (lockAspectRatio && aspectRatioValue > 0) {
      setTargetWidth(Math.max(16, Math.min(2048, Math.round(h * aspectRatioValue))));
    }
  };

  // Main Canvas Rendering & Optimization Pipeline
  const renderOptimizedCanvas = useCallback(() => {
    if (!sourceDataUrl) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      // Clear Canvas
      ctx.clearRect(0, 0, targetWidth, targetHeight);

      // Handle Background
      if (bgMode === 'solid-matte') {
        ctx.fillStyle = solidMatteColor;
        if (cornerRadiusPx > 0) {
          ctx.beginPath();
          ctx.roundRect(0, 0, targetWidth, targetHeight, cornerRadiusPx);
          ctx.fill();
        } else {
          ctx.fillRect(0, 0, targetWidth, targetHeight);
        }
      }

      // Compute destination dimensions with padding
      const availW = Math.max(8, targetWidth - paddingPx * 2);
      const availH = Math.max(8, targetHeight - paddingPx * 2);

      let drawW = availW;
      let drawH = availH;
      let drawX = paddingPx;
      let drawY = paddingPx;

      const imgAspect = img.naturalWidth / img.naturalHeight;
      const boxAspect = availW / availH;

      if (fitMode === 'contain') {
        if (imgAspect > boxAspect) {
          drawW = availW;
          drawH = availW / imgAspect;
          drawY = paddingPx + (availH - drawH) / 2;
        } else {
          drawH = availH;
          drawW = availH * imgAspect;
          drawX = paddingPx + (availW - drawW) / 2;
        }
      } else if (fitMode === 'cover') {
        // Source crop
        let sX = 0, sY = 0, sW = img.naturalWidth, sH = img.naturalHeight;
        if (imgAspect > boxAspect) {
          sW = img.naturalHeight * boxAspect;
          sX = (img.naturalWidth - sW) / 2;
        } else {
          sH = img.naturalWidth / boxAspect;
          sY = (img.naturalHeight - sH) / 2;
        }
        ctx.drawImage(img, sX, sY, sW, sH, paddingPx, paddingPx, availW, availH);
      }

      if (fitMode !== 'cover') {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      }

      // Chroma Key / White/Black Background knockout if selected
      if (bgMode === 'chroma-remove') {
        const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
        const data = imgData.data;
        const tol = chromaTolerance;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const isNearWhite = r > 255 - tol && g > 255 - tol && b > 255 - tol;
          const isNearBlack = r < tol && g < tol && b < tol;

          if (isNearWhite || (isNearBlack && tol > 40)) {
            data[i + 3] = 0; // alpha = 0
          }
        }
        ctx.putImageData(imgData, 0, 0);
      }

      // Apply Filters (Brightness / Contrast / Cyber Emerald Glow)
      if (brightnessVal !== 100 || contrastVal !== 100 || cyberGlowOverlay) {
        const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
        const data = imgData.data;
        const bMult = brightnessVal / 100;
        const cFactor = (259 * (contrastVal + 255)) / (255 * (259 - contrastVal));

        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] > 0) {
            let r = cFactor * (data[i] - 128) + 128;
            let g = cFactor * (data[i + 1] - 128) + 128;
            let b = cFactor * (data[i + 2] - 128) + 128;

            r *= bMult;
            g *= bMult;
            b *= bMult;

            if (cyberGlowOverlay) {
              g = Math.min(255, g * 1.15 + 15);
              b = Math.min(255, b * 1.05);
            }

            data[i] = Math.max(0, Math.min(255, r));
            data[i + 1] = Math.max(0, Math.min(255, g));
            data[i + 2] = Math.max(0, Math.min(255, b));
          }
        }
        ctx.putImageData(imgData, 0, 0);
      }

      // Encode to Target Format & Quality
      const mimeType = outputFormat === 'webp' ? 'image/webp' : outputFormat === 'jpeg' ? 'image/jpeg' : 'image/png';
      const qualityRatio = compressionQuality / 100;
      const outputDataUrl = canvas.toDataURL(mimeType, qualityRatio);

      setProcessedDataUrl(outputDataUrl);
      const estBytes = Math.round((outputDataUrl.length * 3) / 4);
      setOptimizedByteSize(estBytes);
      setIsProcessing(false);
    };
    img.src = sourceDataUrl;
  }, [
    sourceDataUrl,
    targetWidth,
    targetHeight,
    outputFormat,
    compressionQuality,
    fitMode,
    paddingPx,
    cornerRadiusPx,
    bgMode,
    solidMatteColor,
    chromaTolerance,
    brightnessVal,
    contrastVal,
    cyberGlowOverlay
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      renderOptimizedCanvas();
    }, 120);
    return () => clearTimeout(timer);
  }, [renderOptimizedCanvas]);

  // =========================================================================
  // LOGO NAMING & CONFLICT RESOLUTION LOGIC
  // =========================================================================

  // Helper to test if uploaded filename matches target app name/slug
  const checkFileNameMatch = (fileName: string, targetAppId: string): boolean => {
    const normalizedFile = fileName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const app = CONNECTED_ECOSYSTEM_APPS.find(a => a.id === targetAppId);
    if (!app) return true;

    const appSlug = app.slug.toLowerCase().replace(/[^a-z0-9]/g, '');
    const appNameWords = app.name.toLowerCase().split(/\s+/).filter(w => w.length > 2);

    // If filename contains app slug or any major word from app name
    if (normalizedFile.includes(appSlug)) return true;
    for (const word of appNameWords) {
      if (normalizedFile.includes(word.replace(/[^a-z0-9]/g, ''))) return true;
    }
    return false;
  };

  // Helper to generate sanitized app logo filename
  const getSuggestedFileName = (targetAppId: string, extension = 'png'): string => {
    const app = CONNECTED_ECOSYSTEM_APPS.find(a => a.id === targetAppId) || CONNECTED_ECOSYSTEM_APPS[0];
    const baseSlug = app.slug || app.id;
    return `${baseSlug}-logo.${extension}`;
  };

  // Helper to detect identical filename collisions in server catalog
  const resolveCollisionName = (proposedName: string, targetAppId: string): string => {
    const existing = serverCatalog.find(asset => asset.filename === proposedName);
    if (existing) {
      const extMatch = proposedName.match(/\.([^.]+)$/);
      const ext = extMatch ? extMatch[1] : 'png';
      const randomId = Math.random().toString(36).substring(2, 6);
      return `${targetAppId}-${randomId}-logo.${ext}`;
    }
    return proposedName;
  };

  // Intercept and process newly uploaded/fetched image
  const processNewImageImport = (dataUrl: string, originalFileName: string) => {
    const primaryTargetId = selectedAppTargets[0] || 'forgeos';
    const targetApp = CONNECTED_ECOSYSTEM_APPS.find(a => a.id === primaryTargetId) || CONNECTED_ECOSYSTEM_APPS[0];
    const extMatch = originalFileName.match(/\.([^.]+)$/);
    const ext = extMatch ? extMatch[1].toLowerCase() : 'png';

    const isMatch = checkFileNameMatch(originalFileName, primaryTargetId);
    let suggestedName = getSuggestedFileName(primaryTargetId, ext);

    // Check collision
    const isCollision = serverCatalog.some(a => a.filename === originalFileName || a.filename === suggestedName);
    if (isCollision) {
      suggestedName = resolveCollisionName(suggestedName, primaryTargetId);
    }

    if (!isMatch || isCollision) {
      // Open Confirmation & Resolution Dialog
      setPendingUploadData({
        dataUrl,
        originalFileName,
        suggestedFileName: suggestedName,
        targetAppName: targetApp.name,
        targetAppId: primaryTargetId,
        isCollision
      });
      setCustomNameInput(suggestedName);
      setIsNamingModalOpen(true);
    } else {
      // Directly accept
      setSourceDataUrl(dataUrl);
      measureSourceImage(dataUrl, originalFileName);
      registerAssetOnServer(originalFileName, dataUrl, primaryTargetId, targetApp.name);
    }
  };

  // Confirm Name from Dialog
  const handleConfirmFileName = (action: 'use-app-name' | 'keep-original' | 'custom') => {
    if (!pendingUploadData) return;

    let finalName = pendingUploadData.originalFileName;
    if (action === 'use-app-name') {
      finalName = pendingUploadData.suggestedFileName;
    } else if (action === 'custom') {
      finalName = customNameInput.trim() || pendingUploadData.suggestedFileName;
    }

    // Ensure extension
    if (!finalName.includes('.')) {
      finalName = `${finalName}.png`;
    }

    // Collision safety
    const isColliding = serverCatalog.some(a => a.filename === finalName && a.dataUrl !== pendingUploadData.dataUrl);
    if (isColliding) {
      const ext = finalName.split('.').pop() || 'png';
      const randomId = Math.random().toString(36).substring(2, 6);
      finalName = `${pendingUploadData.targetAppId}-${randomId}-logo.${ext}`;
    }

    setSourceDataUrl(pendingUploadData.dataUrl);
    measureSourceImage(pendingUploadData.dataUrl, finalName);
    registerAssetOnServer(finalName, pendingUploadData.dataUrl, pendingUploadData.targetAppId, pendingUploadData.targetAppName);

    setIsNamingModalOpen(false);
    setPendingUploadData(null);
  };

  // Register Asset on Server and generate Unique URL
  const registerAssetOnServer = async (filename: string, dataUrl: string, targetAppId: string, appName: string) => {
    try {
      const res = await axios.post('/api/ecosystem/logos/update', {
        filename,
        targetAppId,
        appName,
        logoDataUrl: dataUrl
      });
      if (res.data && res.data.catalog) {
        setServerCatalog(res.data.catalog);
      }
      setApplySuccessMessage(`Generated unique URL for ${filename} and cataloged successfully!`);
    } catch (err) {
      console.warn('Server asset registration cached locally.');
    } finally {
      setTimeout(() => setApplySuccessMessage(null), 4000);
    }
  };

  // Handle Local File Upload
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/') && !file.name.endsWith('.svg') && !file.name.endsWith('.ico')) {
      alert('Please upload a valid image file (PNG, SVG, JPG, WEBP, ICO).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      processNewImageImport(dataUrl, file.name);
    };
    reader.readAsDataURL(file);
  };

  // Handle Google Drive Fetching & Proxy
  const handleFetchGoogleDriveImage = async () => {
    if (!gdriveInputUrl.trim()) return;
    setGdriveLoading(true);
    setGdriveError(null);

    try {
      const res = await axios.post('/api/ecosystem/logo-proxy', {
        url: gdriveInputUrl.trim()
      });

      if (res.data && res.data.dataUrl) {
        const defaultDriveName = 'gdrive-imported-logo.png';
        processNewImageImport(res.data.dataUrl, defaultDriveName);
        setGdriveLoading(false);
      } else {
        throw new Error('Could not resolve image from Google Drive link');
      }
    } catch (err: any) {
      console.error('Google Drive fetch failed:', err);
      setGdriveError(
        err.response?.data?.error || 
        'Unable to load image directly. Please ensure Google Drive sharing is set to "Anyone with the link can view", or use direct file upload.'
      );
      setGdriveLoading(false);
    }
  };

  // Apply to Selected Ecosystem Apps
  const handleApplyToEcosystem = async () => {
    if (!processedDataUrl) return;

    // 1. Update Theme Context & LocalStorage
    setAllAppLogos(processedDataUrl, selectedAppTargets);

    // 2. Broadcast to Server Ecosystem API
    try {
      const logosPayload: Record<string, string> = {};
      selectedAppTargets.forEach(id => {
        logosPayload[id] = processedDataUrl;
      });

      const primaryApp = CONNECTED_ECOSYSTEM_APPS.find(a => a.id === selectedAppTargets[0]) || CONNECTED_ECOSYSTEM_APPS[0];

      const res = await axios.post('/api/ecosystem/logos/update', {
        logos: logosPayload,
        filename: sourceFileName,
        targetAppId: selectedAppTargets[0],
        appName: primaryApp.name,
        logoDataUrl: processedDataUrl
      });

      if (res.data && res.data.catalog) {
        setServerCatalog(res.data.catalog);
      }

      setApplySuccessMessage(`Applied real logo to ${selectedAppTargets.length} ecosystem application${selectedAppTargets.length > 1 ? 's' : ''}! Unique URL active.`);
    } catch (err) {
      setApplySuccessMessage('Logo applied locally and saved to browser cache.');
    } finally {
      setTimeout(() => setApplySuccessMessage(null), 4000);
    }
  };

  // Download Single Optimized File
  const handleDownloadSingle = () => {
    if (!processedDataUrl) return;
    const a = document.createElement('a');
    a.href = processedDataUrl;
    const ext = outputFormat === 'webp' ? 'webp' : outputFormat === 'jpeg' ? 'jpg' : 'png';
    a.download = sourceFileName.replace(/\.[^/.]+$/, '') + `-${targetWidth}x${targetHeight}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Download Complete Multi-Size Icon ZIP Package
  const handleDownloadZipPackage = async () => {
    if (!sourceDataUrl) return;
    setIsZipping(true);

    try {
      const zip = new JSZip();
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise((resolve) => {
        img.onload = resolve;
        img.src = sourceDataUrl;
      });

      for (const preset of RECOMMENDED_LOGO_PRESETS) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = preset.width;
        tempCanvas.height = preset.height;
        const ctx = tempCanvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          const p = 4;
          const availW = preset.width - p * 2;
          const availH = preset.height - p * 2;
          const imgAspect = img.naturalWidth / img.naturalHeight;
          const boxAspect = availW / availH;

          let dW = availW, dH = availH, dX = p, dY = p;
          if (imgAspect > boxAspect) {
            dW = availW;
            dH = availW / imgAspect;
            dY = p + (availH - dH) / 2;
          } else {
            dH = availH;
            dW = availH * imgAspect;
            dX = p + (availW - dW) / 2;
          }

          ctx.drawImage(img, dX, dY, dW, dH);
          const dataUrl = tempCanvas.toDataURL('image/png', 0.95);
          const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
          zip.file(`${preset.id}-${preset.width}x${preset.height}.png`, base64Data, { base64: true });
        }
      }

      const manifestSnippet = {
        name: "The H.U.M.A.N. Initiative Powered App",
        short_name: "HumanApp",
        icons: [
          { src: "favicon-64-64x64.png", sizes: "64x64", type: "image/png" },
          { src: "desktop-taskbar-128-128x128.png", sizes: "128x128", type: "image/png" },
          { src: "pwa-master-512-512x512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" }
        ],
        c2pa_provenance_covenant: "50% Society Fund Royalty Initiative",
        asset_url: `/api/ecosystem/logos/asset/${sourceFileName}`
      };

      zip.file('manifest-icons.json', JSON.stringify(manifestSnippet, null, 2));
      zip.file('README.txt', `The H.U.M.A.N. Initiative Optimized Logo Package\nAsset Name: ${sourceFileName}\nGenerated URL: /api/ecosystem/logos/asset/${sourceFileName}\nGenerated at: ${new Date().toISOString()}`);

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${sourceFileName.replace(/\.[^/.]+$/, '')}-bundle.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate ZIP:', err);
      alert('Could not generate ZIP bundle. Please download individual optimized files.');
    } finally {
      setIsZipping(false);
    }
  };

  const calculateSavingsPct = () => {
    if (!origDimensions || !optimizedByteSize || origDimensions.byteSize === 0) return 0;
    const diff = origDimensions.byteSize - optimizedByteSize;
    if (diff <= 0) return 0;
    return Math.round((diff / origDimensions.byteSize) * 100);
  };

  // URL Generation Helpers
  const generatedAssetUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/api/ecosystem/logos/asset/${sourceFileName}`
    : `/api/ecosystem/logos/asset/${sourceFileName}`;

  const handleCopySnippet = (snippet: string, label: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedSnippet(label);
    setTimeout(() => setCopiedSnippet(null), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in text-[#F0FDF4]">
      
      {/* SUCCESS NOTIFICATION TOAST */}
      {applySuccessMessage && (
        <div className="p-3.5 rounded-2xl bg-[#064E3B] border border-[#10B981] text-[#34D399] flex items-center justify-between gap-3 shadow-lg animate-fade-in">
          <div className="flex items-center gap-2 text-xs font-mono font-bold">
            <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
            <span>{applySuccessMessage}</span>
          </div>
          <button 
            onClick={() => setApplySuccessMessage(null)}
            className="text-[#A7F3D0] hover:text-white text-xs font-bold px-2 py-0.5 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* TOP STEPPER / SOURCE TABS */}
      <div className="bg-[#101B18] p-4 rounded-2xl border border-[#1E3A33] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#064E3B] text-[#34D399] border border-[#10B981]/40">
              STEP 1
            </span>
            <h3 className="text-sm font-bold font-mono text-[#F0FDF4]">Select Logo Source & Target App</h3>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Import your real brand logo from Google Drive, local storage, or vector presets. Automated naming and unique injection URLs generated automatically.
          </p>
        </div>

        {/* Source Toggle Pills */}
        <div className="flex items-center bg-[#0B1311] p-1 rounded-xl border border-[#1E3A33]">
          <button
            onClick={() => setSourceType('local')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
              sourceType === 'local'
                ? 'bg-[#064E3B] text-[#34D399] font-bold shadow-xs'
                : 'text-[#94A3B8] hover:text-[#F0FDF4]'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>Local Upload</span>
          </button>

          <button
            onClick={() => setSourceType('gdrive')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
              sourceType === 'gdrive'
                ? 'bg-[#064E3B] text-[#34D399] font-bold shadow-xs'
                : 'text-[#94A3B8] hover:text-[#F0FDF4]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Google Drive</span>
          </button>

          <button
            onClick={() => setSourceType('preset')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
              sourceType === 'preset'
                ? 'bg-[#064E3B] text-[#34D399] font-bold shadow-xs'
                : 'text-[#94A3B8] hover:text-[#F0FDF4]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Vector Presets</span>
          </button>

          <button
            onClick={() => {
              setSourceType('catalog');
              refreshServerCatalog();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
              sourceType === 'catalog'
                ? 'bg-[#064E3B] text-[#34D399] font-bold shadow-xs'
                : 'text-[#94A3B8] hover:text-[#F0FDF4]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Asset Catalog ({serverCatalog.length})</span>
          </button>
        </div>
      </div>

      {/* UPLOAD / IMPORT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: SOURCE INPUTS & SETTINGS (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* SOURCE PANEL: LOCAL STORAGE */}
          {sourceType === 'local' && (
            <div 
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              className={`p-6 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                dragActive 
                  ? 'border-[#34D399] bg-[#064E3B]/20 shadow-lg' 
                  : 'border-[#1E3A33] hover:border-[#10B981]/50 bg-[#101B18]/70 hover:bg-[#142320]'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/png, image/jpeg, image/webp, image/svg+xml, image/x-icon" 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <div className="p-3.5 rounded-full bg-[#064E3B] border border-[#10B981]/40 text-[#34D399] mb-3 shadow-sm">
                <Upload className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold font-mono text-[#F0FDF4]">
                Click to browse or Drag & Drop Real Logo
              </h4>
              <p className="text-xs text-[#94A3B8] max-w-sm mt-1">
                Supports high-resolution PNG (with transparency), SVG vector, WEBP, JPG, or ICO files.
              </p>
              <div className="mt-3 flex items-center gap-2 text-[10px] font-mono text-[#34D399] bg-[#0B1311] px-2.5 py-1 rounded-full border border-[#1E3A33]">
                <Tag className="w-3 h-3" />
                <span>Auto-naming & URL injection enabled</span>
              </div>
            </div>
          )}

          {/* SOURCE PANEL: GOOGLE DRIVE IMPORT */}
          {sourceType === 'gdrive' && (
            <div className="p-5 rounded-2xl border border-[#1E3A33] bg-[#101B18] space-y-4">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#34D399]" />
                <h4 className="text-xs font-mono font-bold text-[#F0FDF4] uppercase">
                  Google Drive Direct Asset Resolver
                </h4>
              </div>

              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Paste any Google Drive share link (e.g. <span className="font-mono text-[#34D399]">https://drive.google.com/file/d/.../view</span>). The server proxy fetches and caches the asset with zero CORS restrictions.
              </p>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="https://drive.google.com/file/d/1A2B3C4D.../view?usp=sharing"
                  value={gdriveInputUrl}
                  onChange={(e) => setGdriveInputUrl(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0B1311] border border-[#1E3A33] text-xs font-mono text-[#F0FDF4] focus:outline-none focus:border-[#10B981]"
                />
                <button
                  onClick={handleFetchGoogleDriveImage}
                  disabled={gdriveLoading || !gdriveInputUrl.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#059669] text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer shadow-sm shrink-0"
                >
                  {gdriveLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Fetching...</span>
                    </>
                  ) : (
                    <>
                      <FolderOpen className="w-3.5 h-3.5 text-[#34D399]" />
                      <span>Fetch from Drive</span>
                    </>
                  )}
                </button>
              </div>

              {gdriveError && (
                <div className="p-3 rounded-xl bg-[#450A0A] border border-[#EF4444]/50 text-[#FCA5A5] text-xs font-mono">
                  {gdriveError}
                </div>
              )}

              <div className="p-3 rounded-xl bg-[#0B1311] border border-[#1E3A33] text-[11px] text-[#94A3B8] space-y-1">
                <div className="font-bold text-[#A7F3D0]">Google Drive Sharing Tip:</div>
                <div>Right-click your logo file in Google Drive &gt; <em>Share</em> &gt; Set General Access to <strong>"Anyone with the link can view"</strong> &gt; Copy link and paste above.</div>
              </div>
            </div>
          )}

          {/* SOURCE PANEL: VECTOR PRESETS */}
          {sourceType === 'preset' && (
            <div className="p-4 rounded-2xl border border-[#1E3A33] bg-[#101B18] space-y-3">
              <h4 className="text-xs font-mono font-bold text-[#F0FDF4] uppercase">
                Official Vector Brand Templates
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {CONNECTED_ECOSYSTEM_APPS.map(app => (
                  <button
                    key={app.id}
                    onClick={() => {
                      const svgElement = document.getElementById(`vector-preset-${app.id}`);
                      if (svgElement) {
                        const svgData = new XMLSerializer().serializeToString(svgElement);
                        const svg64 = btoa(unescape(encodeURIComponent(svgData)));
                        const dataUrl = `data:image/svg+xml;base64,${svg64}`;
                        processNewImageImport(dataUrl, `${app.slug}-vector-logo.svg`);
                      }
                    }}
                    className="p-3 rounded-xl bg-[#0B1311] hover:bg-[#142320] border border-[#1E3A33] hover:border-[#10B981] flex flex-col items-center text-center gap-2 transition-all cursor-pointer group"
                  >
                    <div className="p-2 rounded-lg bg-[#142320] border border-[#1E3A33] group-hover:border-[#34D399]/40">
                      {app.id === 'human-master' && <EmeraldHumanNetworkLogoIcon size={32} id="vector-preset-human-master" />}
                      {app.id === 'forgeos' && <ForgeOsLogoIcon size={32} id="vector-preset-forgeos" />}
                      {app.id === 'tome-crafter' && <TomeCrafterLogoIcon size={32} id="vector-preset-tome-crafter" />}
                      {app.id === 'rlm-pro-studio' && <RlmProStudioLogoIcon size={32} id="vector-preset-rlm-pro-studio" />}
                      {app.id === 'rl-easy-flow' && <RlEasyFlowLogoIcon size={32} id="vector-preset-rl-easy-flow" />}
                    </div>
                    <div className="text-[11px] font-mono font-bold text-[#F0FDF4] truncate w-full">{app.name}</div>
                    <span className="text-[9px] font-mono text-[#34D399] bg-[#064E3B]/40 px-1.5 py-0.5 rounded border border-[#10B981]/30">
                      {app.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SOURCE PANEL: ASSET CATALOG */}
          {sourceType === 'catalog' && (
            <div className="p-4 rounded-2xl border border-[#1E3A33] bg-[#101B18] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#34D399]" />
                  <h4 className="text-xs font-mono font-bold text-[#F0FDF4] uppercase">
                    Ecosystem Asset Catalog & Registered URLs
                  </h4>
                </div>
                <button
                  onClick={refreshServerCatalog}
                  className="text-xs font-mono text-[#34D399] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${catalogLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {serverCatalog.length === 0 ? (
                <div className="p-6 text-center text-xs font-mono text-[#94A3B8] bg-[#0B1311] rounded-xl border border-[#1E3A33]">
                  No logo assets registered in server catalog yet. Upload a logo to automatically generate unique URLs.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                  {serverCatalog.map((asset) => (
                    <div 
                      key={asset.id || asset.filename}
                      className="p-3 rounded-xl bg-[#0B1311] border border-[#1E3A33] hover:border-[#10B981] transition-all space-y-2 flex flex-col justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#142320] border border-[#1E3A33] p-1 flex items-center justify-center shrink-0">
                          <img src={asset.dataUrl} alt={asset.filename} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-mono font-bold text-[#F0FDF4] truncate">{asset.filename}</div>
                          <div className="text-[10px] font-mono text-[#34D399] truncate">{asset.appName}</div>
                          <div className="text-[9px] font-mono text-[#94A3B8]">{(asset.byteSize / 1024).toFixed(1)} KB</div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#1E3A33] flex items-center justify-between gap-1.5">
                        <button
                          onClick={() => {
                            setSourceDataUrl(asset.dataUrl);
                            setSourceFileName(asset.filename);
                            measureSourceImage(asset.dataUrl, asset.filename);
                          }}
                          className="px-2 py-1 rounded bg-[#064E3B] text-[#34D399] hover:bg-[#059669] hover:text-white text-[10px] font-mono font-bold cursor-pointer"
                        >
                          Load in Studio
                        </button>
                        <button
                          onClick={() => handleCopySnippet(`/api/ecosystem/logos/asset/${asset.filename}`, `cat_${asset.filename}`)}
                          className="px-2 py-1 rounded bg-[#142320] text-[#94A3B8] hover:text-white text-[10px] font-mono flex items-center gap-1 cursor-pointer"
                        >
                          {copiedSnippet === `cat_${asset.filename}` ? <Check className="w-3 h-3 text-[#34D399]" /> : <Copy className="w-3 h-3" />}
                          <span>URL</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: RECOMMENDED SIZE PRESETS */}
          <div className="p-4 rounded-2xl border border-[#1E3A33] bg-[#101B18] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#064E3B] text-[#34D399] border border-[#10B981]/40">
                  STEP 2
                </span>
                <h4 className="text-xs font-mono font-bold text-[#F0FDF4] uppercase">
                  Target Preset Sizes
                </h4>
              </div>
              <span className="text-[10px] font-mono text-[#94A3B8]">1-Click Recommended Dimensions</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {RECOMMENDED_LOGO_PRESETS.map((preset) => {
                const isSelected = targetWidth === preset.width && targetHeight === preset.height;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-[#064E3B] border-[#10B981] text-white shadow-sm'
                        : 'bg-[#0B1311] hover:bg-[#142320] border-[#1E3A33] text-[#F0FDF4]'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-[#042F24] text-[#34D399]' : 'bg-[#142320] text-[#94A3B8]'}`}>
                      {preset.category === 'icon' && <Smartphone className="w-4 h-4" />}
                      {preset.category === 'navbar' && <Monitor className="w-4 h-4" />}
                      {preset.category === 'badge' && <ShieldCheck className="w-4 h-4" />}
                      {preset.category === 'hero' && <Maximize2 className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-mono font-bold truncate">{preset.name}</div>
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                          isSelected ? 'bg-[#0B1311] text-[#34D399] border-[#10B981]' : 'bg-[#142320] text-[#A7F3D0] border-[#1E3A33]'
                        }`}>
                          {preset.width}×{preset.height}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#94A3B8] truncate mt-0.5">
                        {preset.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: RESIZING & CUSTOM SLIDERS */}
          <div className="p-4 rounded-2xl border border-[#1E3A33] bg-[#101B18] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#064E3B] text-[#34D399] border border-[#10B981]/40">
                  STEP 3
                </span>
                <h4 className="text-xs font-mono font-bold text-[#F0FDF4] uppercase">
                  Custom Dimension Sliders
                </h4>
              </div>

              <button
                onClick={() => setLockAspectRatio(!lockAspectRatio)}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono transition-all cursor-pointer ${
                  lockAspectRatio ? 'bg-[#064E3B] text-[#34D399] font-bold' : 'bg-[#142320] text-[#94A3B8]'
                }`}
              >
                {lockAspectRatio ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                <span>{lockAspectRatio ? 'Locked Aspect' : 'Freeform'}</span>
              </button>
            </div>

            {/* Width & Height Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#94A3B8]">Width:</span>
                  <span className="text-[#34D399] font-bold">{targetWidth}px</span>
                </div>
                <input
                  type="range"
                  min="24"
                  max="1200"
                  value={targetWidth}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  className="w-full accent-[#10B981] cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#94A3B8]">Height:</span>
                  <span className="text-[#34D399] font-bold">{targetHeight}px</span>
                </div>
                <input
                  type="range"
                  min="24"
                  max="1200"
                  value={targetHeight}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  className="w-full accent-[#10B981] cursor-pointer"
                />
              </div>
            </div>

            {/* Padding & Corner Radius */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#1E3A33]">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#94A3B8]">Canvas Padding:</span>
                  <span className="text-[#F0FDF4]">{paddingPx}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={paddingPx}
                  onChange={(e) => setPaddingPx(Number(e.target.value))}
                  className="w-full accent-[#10B981] cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#94A3B8]">Corner Radius:</span>
                  <span className="text-[#F0FDF4]">{cornerRadiusPx}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={cornerRadiusPx}
                  onChange={(e) => setCornerRadiusPx(Number(e.target.value))}
                  className="w-full accent-[#10B981] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* STEP 4: OPTIMIZATION & BACKGROUND KNOCKOUT */}
          <div className="p-4 rounded-2xl border border-[#1E3A33] bg-[#101B18] space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#064E3B] text-[#34D399] border border-[#10B981]/40">
                STEP 4
              </span>
              <h4 className="text-xs font-mono font-bold text-[#F0FDF4] uppercase">
                Format & Alpha Transparency
              </h4>
            </div>

            {/* Format Selection */}
            <div className="grid grid-cols-3 gap-2">
              {(['png', 'webp', 'jpeg'] as const).map(fmt => (
                <button
                  key={fmt}
                  onClick={() => setOutputFormat(fmt)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    outputFormat === fmt
                      ? 'bg-[#064E3B] text-[#34D399] border-[#10B981] font-bold shadow-sm'
                      : 'bg-[#0B1311] text-[#94A3B8] border-[#1E3A33] hover:text-[#F0FDF4]'
                  }`}
                >
                  <div className="text-xs font-mono uppercase">{fmt}</div>
                  <div className="text-[10px] text-[#94A3B8]">
                    {fmt === 'png' && 'Lossless Alpha'}
                    {fmt === 'webp' && 'Modern Compact'}
                    {fmt === 'jpeg' && 'Solid Photo'}
                  </div>
                </button>
              ))}
            </div>

            {/* Background Alpha Mode */}
            <div className="space-y-2 pt-2 border-t border-[#1E3A33]">
              <div className="text-xs font-mono text-[#94A3B8]">Background Handling:</div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setBgMode('transparent')}
                  className={`p-2 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                    bgMode === 'transparent'
                      ? 'bg-[#064E3B] text-[#34D399] border-[#10B981] font-bold'
                      : 'bg-[#142320] text-[#94A3B8] border-[#1E3A33]'
                  }`}
                >
                  True Alpha
                </button>
                <button
                  onClick={() => setBgMode('chroma-remove')}
                  className={`p-2 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                    bgMode === 'chroma-remove'
                      ? 'bg-[#064E3B] text-[#34D399] border-[#10B981] font-bold'
                      : 'bg-[#142320] text-[#94A3B8] border-[#1E3A33]'
                  }`}
                  title="Auto-detect white/black background pixels and make transparent"
                >
                  Auto Knockout
                </button>
                <button
                  onClick={() => setBgMode('solid-matte')}
                  className={`p-2 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                    bgMode === 'solid-matte'
                      ? 'bg-[#064E3B] text-[#34D399] border-[#10B981] font-bold'
                      : 'bg-[#142320] text-[#94A3B8] border-[#1E3A33]'
                  }`}
                >
                  Matte Solid
                </button>
              </div>

              {bgMode === 'chroma-remove' && (
                <div className="pt-2 space-y-1 border-t border-[#1E3A33]">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-[#94A3B8]">Knockout Threshold:</span>
                    <span className="font-bold text-[#34D399]">{chromaTolerance}</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    value={chromaTolerance}
                    onChange={(e) => setChromaTolerance(Number(e.target.value))}
                    className="w-full accent-[#10B981] cursor-pointer"
                  />
                </div>
              )}

              {bgMode === 'solid-matte' && (
                <div className="pt-2 flex items-center gap-2 border-t border-[#1E3A33]">
                  <span className="text-[11px] font-mono text-[#94A3B8]">Matte Color:</span>
                  <input
                    type="color"
                    value={solidMatteColor}
                    onChange={(e) => setSolidMatteColor(e.target.value)}
                    className="w-7 h-7 rounded border border-[#1E3A33] bg-transparent cursor-pointer"
                  />
                  <span className="text-xs font-mono text-[#F0FDF4]">{solidMatteColor}</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: LIVE INTERACTIVE SANDBOX & ECOSYSTEM DEPLOYMENT (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* LIVE SANDBOX CONTAINER */}
          <div className="bg-[#101B18] p-5 rounded-2xl border border-[#1E3A33] space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#1E3A33] pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#34D399]" />
                <h4 className="text-xs font-mono font-bold text-[#F0FDF4] uppercase">
                  Live Interactive Preview
                </h4>
              </div>

              {/* Context Switcher Pills */}
              <div className="flex items-center bg-[#0B1311] p-0.5 rounded-lg border border-[#1E3A33]">
                {(['canvas', 'navbar', 'app-card', 'badge'] as const).map(ctxKey => (
                  <button
                    key={ctxKey}
                    onClick={() => setActivePreviewContext(ctxKey)}
                    className={`px-2 py-1 rounded text-[10px] font-mono capitalize transition-all cursor-pointer ${
                      activePreviewContext === ctxKey
                        ? 'bg-[#064E3B] text-[#34D399] font-bold shadow-xs'
                        : 'text-[#94A3B8] hover:text-[#F0FDF4]'
                    }`}
                  >
                    {ctxKey.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* PREVIEW DISPLAY AREA */}
            <div className="relative min-h-[200px] rounded-xl overflow-hidden flex items-center justify-center p-4 bg-[#0B1311] border border-[#1E3A33]">
              
              {/* Context 1: High-DPI Checkerboard Canvas */}
              {activePreviewContext === 'canvas' && (
                <div 
                  className="p-3 rounded-xl border border-[#1E3A33]/80 shadow-2xl flex items-center justify-center relative overflow-hidden"
                  style={{
                    backgroundImage: 'repeating-conic-gradient(#142320 0% 25%, #0B1311 0% 50%)',
                    backgroundSize: '16px 16px',
                    maxWidth: '100%',
                    maxHeight: '260px'
                  }}
                >
                  {processedDataUrl ? (
                    <img 
                      src={processedDataUrl} 
                      alt="Optimized Logo" 
                      style={{
                        width: targetWidth > 320 ? '100%' : `${targetWidth}px`,
                        height: targetWidth > 320 ? 'auto' : `${targetHeight}px`,
                        maxHeight: '220px',
                        objectFit: fitMode
                      }}
                      className="rounded-lg shadow-md"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="text-xs font-mono text-[#94A3B8] flex flex-col items-center gap-2 p-6">
                      <ImageIcon className="w-8 h-8 text-[#1E3A33]" />
                      <span>Upload or select a logo to preview</span>
                    </div>
                  )}
                </div>
              )}

              {/* Context 2: Navbar Header Context */}
              {activePreviewContext === 'navbar' && (
                <div className="w-full bg-[#101E1A] p-3 rounded-xl border border-[#1E3A33] shadow-md space-y-2">
                  <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Navbar Simulation:</div>
                  <div className="flex items-center justify-between bg-[#0B1311] p-2.5 rounded-lg border border-[#1A2E28]">
                    <div className="flex items-center gap-2">
                      {processedDataUrl && (
                        <img 
                          src={processedDataUrl} 
                          alt="Nav Logo" 
                          className="h-8 max-w-[140px] object-contain rounded"
                          referrerPolicy="no-referrer" 
                        />
                      )}
                      <div>
                        <div className="text-xs font-bold font-mono text-[#F0FDF4]">H.U.M.A.N.</div>
                        <div className="text-[9px] font-mono text-[#34D399]">Ethical AI Network</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#064E3B] text-[#34D399] border border-[#10B981]/50">
                      50% Covenant
                    </span>
                  </div>
                </div>
              )}

              {/* Context 3: App Card Context */}
              {activePreviewContext === 'app-card' && (
                <div className="w-full max-w-sm bg-[#142320] p-4 rounded-xl border border-[#1E3A33] space-y-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    {processedDataUrl && (
                      <div className="w-12 h-12 rounded-xl bg-[#0B1311] border border-[#10B981]/40 p-1 flex items-center justify-center shrink-0">
                        <img 
                          src={processedDataUrl} 
                          alt="App Tile" 
                          className="w-full h-full object-contain rounded-lg"
                          referrerPolicy="no-referrer" 
                        />
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-bold font-mono text-[#F0FDF4]">Connected App</div>
                      <div className="text-[10px] text-[#A7F3D0]">Real Logo Active</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-[#94A3B8] font-mono">
                    Stripe Sandbox verified • 50% fund routing enabled
                  </div>
                </div>
              )}

              {/* Context 4: C2PA Trust Badge Context */}
              {activePreviewContext === 'badge' && (
                <div className="p-4 rounded-2xl bg-[#0B1311] border border-[#10B981]/60 shadow-lg flex flex-col items-center text-center gap-2">
                  <div className="w-16 h-16 rounded-full bg-[#064E3B] border-2 border-[#34D399] p-1.5 flex items-center justify-center shadow-md">
                    {processedDataUrl && (
                      <img 
                        src={processedDataUrl} 
                        alt="Badge Seal" 
                        className="w-full h-full object-contain rounded-full"
                        referrerPolicy="no-referrer" 
                      />
                    )}
                  </div>
                  <div className="text-xs font-mono font-bold text-[#F0FDF4]">C2PA Provenance Seal</div>
                  <div className="text-[9.5px] font-mono text-[#34D399] bg-[#142320] px-2 py-0.5 rounded-full border border-[#1E3A33]">
                    50% Subscription Restitution
                  </div>
                </div>
              )}
            </div>

            {/* GENERATED UNIQUE URL & INJECTION HUB */}
            <div className="p-4 rounded-xl bg-[#0B1311] border border-[#1E3A33] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#34D399]">
                  <Link className="w-3.5 h-3.5" />
                  <span>Unique Injection URL</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#064E3B] text-[#A7F3D0] border border-[#10B981]/30">
                  {sourceFileName}
                </span>
              </div>

              {/* URL Display */}
              <div className="p-2.5 rounded-lg bg-[#040807] border border-[#1E3A33] flex items-center justify-between gap-2 overflow-hidden">
                <span className="text-[11px] font-mono text-[#A7F3D0] truncate">
                  /api/ecosystem/logos/asset/{sourceFileName}
                </span>
                <button
                  onClick={() => handleCopySnippet(`/api/ecosystem/logos/asset/${sourceFileName}`, 'url')}
                  className="px-2 py-1 rounded bg-[#064E3B] hover:bg-[#059669] text-white text-[10px] font-mono font-bold flex items-center gap-1 shrink-0 cursor-pointer shadow-xs"
                >
                  {copiedSnippet === 'url' ? <Check className="w-3 h-3 text-[#34D399]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSnippet === 'url' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Code Snippet Quick Injections */}
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <button
                  onClick={() => handleCopySnippet(`<img src="/api/ecosystem/logos/asset/${sourceFileName}" alt="Brand Logo" width="${targetWidth}" height="${targetHeight}" />`, 'html')}
                  className="p-1.5 rounded bg-[#142320] hover:bg-[#1E3A33] text-[10px] font-mono text-[#94A3B8] hover:text-[#F0FDF4] flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <Code className="w-3 h-3 text-[#34D399]" />
                  <span>{copiedSnippet === 'html' ? 'HTML Copied!' : 'Copy HTML <img>'}</span>
                </button>

                <button
                  onClick={() => handleCopySnippet(`<img src="/api/ecosystem/logos/asset/${sourceFileName}" alt="Brand Logo" className="h-${Math.round(targetHeight/4)} w-auto" />`, 'jsx')}
                  className="p-1.5 rounded bg-[#142320] hover:bg-[#1E3A33] text-[10px] font-mono text-[#94A3B8] hover:text-[#F0FDF4] flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <Code className="w-3 h-3 text-[#34D399]" />
                  <span>{copiedSnippet === 'jsx' ? 'JSX Copied!' : 'Copy React JSX'}</span>
                </button>
              </div>
            </div>

            {/* REAL-TIME METRICS & SAVINGS ANALYSIS */}
            <div className="p-3.5 rounded-xl bg-[#0B1311] border border-[#1E3A33] space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#94A3B8]">Output Dimensions:</span>
                <span className="font-bold text-[#34D399]">{targetWidth} × {targetHeight} px</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#94A3B8]">Optimized File Size:</span>
                <span className="font-bold text-[#F0FDF4]">
                  {optimizedByteSize > 1024 ? `${(optimizedByteSize / 1024).toFixed(1)} KB` : `${optimizedByteSize} bytes`}
                </span>
              </div>
              {origDimensions && (
                <div className="flex justify-between items-center text-xs font-mono pt-1.5 border-t border-[#1E3A33]">
                  <span className="text-[#94A3B8]">Optimization Savings:</span>
                  <span className="text-xs font-bold text-[#34D399] bg-[#064E3B] px-2 py-0.5 rounded-full border border-[#10B981]/50">
                    -{calculateSavingsPct()}% reduction
                  </span>
                </div>
              )}
            </div>

            {/* MULTI-APP APPLICATION SELECTOR */}
            <div className="space-y-2.5 pt-2 border-t border-[#1E3A33]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#F0FDF4] uppercase">
                  Apply To Apps:
                </span>
                <button
                  onClick={() => {
                    if (selectedAppTargets.length === CONNECTED_ECOSYSTEM_APPS.length) {
                      setSelectedAppTargets(['human-master']);
                    } else {
                      setSelectedAppTargets(CONNECTED_ECOSYSTEM_APPS.map(a => a.id));
                    }
                  }}
                  className="text-[10px] font-mono text-[#34D399] hover:underline cursor-pointer"
                >
                  {selectedAppTargets.length === CONNECTED_ECOSYSTEM_APPS.length ? 'Deselect All' : 'Select All 5 Apps'}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                {CONNECTED_ECOSYSTEM_APPS.map(app => {
                  const isChecked = selectedAppTargets.includes(app.id);
                  return (
                    <label
                      key={app.id}
                      className={`flex items-center justify-between p-2 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#142320] border-[#10B981] text-[#F0FDF4]'
                          : 'bg-[#0B1311] border-[#1E3A33] text-[#94A3B8]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAppTargets(prev => [...prev, app.id]);
                            } else {
                              setSelectedAppTargets(prev => prev.filter(id => id !== app.id));
                            }
                          }}
                          className="accent-[#10B981] rounded"
                        />
                        <span className="truncate">{app.name}</span>
                      </div>
                      <span className="text-[9px] font-mono text-[#34D399] shrink-0 ml-2">
                        {app.badge}
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* ACTION BUTTON: APPLY TO APPS */}
              <button
                onClick={handleApplyToEcosystem}
                disabled={!processedDataUrl || selectedAppTargets.length === 0}
                className="w-full py-3 rounded-xl bg-[#064E3B] hover:bg-[#059669] text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4 text-[#34D399]" />
                <span>Apply Real Logo to Selected Apps</span>
              </button>
            </div>

            {/* EXPORT & DOWNLOAD PACKAGE BUTTONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#1E3A33]">
              <button
                onClick={handleDownloadSingle}
                disabled={!processedDataUrl}
                className="py-2.5 px-3 rounded-xl bg-[#142320] hover:bg-[#1E3A33] border border-[#1E3A33] text-[#F0FDF4] text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5 text-[#34D399]" />
                <span>Download ({targetWidth}×{targetHeight})</span>
              </button>

              <button
                onClick={handleDownloadZipPackage}
                disabled={!sourceDataUrl || isZipping}
                className="py-2.5 px-3 rounded-xl bg-[#142320] hover:bg-[#1E3A33] border border-[#1E3A33] text-[#34D399] text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                {isZipping ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <FileArchive className="w-3.5 h-3.5 text-[#34D399]" />
                )}
                <span>Export Icon ZIP</span>
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* LOGO NAMING & CONFLICT RESOLUTION CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {isNamingModalOpen && pendingUploadData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl border border-[#1E3A33] bg-[#101B18] p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150 text-[#F0FDF4]">
            
            <div className="flex items-center justify-between border-b border-[#1E3A33] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#064E3B] border border-[#10B981]/50 text-[#34D399]">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-mono text-white">
                    Logo Naming & Identification Match
                  </h3>
                  <p className="text-[11px] text-[#94A3B8]">
                    Target App: {pendingUploadData.targetAppName}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleConfirmFileName('keep-original')}
                className="text-xs font-mono text-[#94A3B8] hover:text-white cursor-pointer px-2 py-1"
              >
                ✕
              </button>
            </div>

            {/* Mismatch & Conflict Explanation */}
            <div className="space-y-3 text-xs leading-relaxed">
              {pendingUploadData.isCollision ? (
                <div className="p-3.5 rounded-xl bg-[#451A03] border border-[#F59E0B]/40 text-[#FDE68A] space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-[#F59E0B]" />
                    <span>Identical File Name Detected</span>
                  </div>
                  <p className="text-[11px] text-[#FEF3C7]">
                    An asset named <strong>{pendingUploadData.originalFileName}</strong> already exists in the catalog. To prevent collision and generate a unique URL, we recommend appending an app ID identifier.
                  </p>
                </div>
              ) : (
                <p className="text-[#CBD5E1]">
                  The uploaded file name (<strong className="text-white font-mono">{pendingUploadData.originalFileName}</strong>) does not match the selected target application (<strong className="text-[#34D399]">{pendingUploadData.targetAppName}</strong>).
                </p>
              )}

              <div className="p-3.5 rounded-xl bg-[#0B1311] border border-[#1E3A33] space-y-2">
                <div className="text-[11px] font-mono text-[#94A3B8]">
                  Would you like to rename the file to the app name for seamless injection and unique identification?
                </div>
                <div className="text-sm font-mono font-bold text-[#34D399] bg-[#142320] p-2.5 rounded-lg border border-[#1E3A33] flex items-center justify-between">
                  <span>{pendingUploadData.suggestedFileName}</span>
                  <span className="text-[10px] font-normal text-[#94A3B8]">Recommended</span>
                </div>
              </div>

              {/* Custom Name Override Option */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-[11px] font-mono text-[#94A3B8]">
                  Or enter a custom file name:
                </label>
                <input
                  type="text"
                  value={customNameInput}
                  onChange={(e) => setCustomNameInput(e.target.value)}
                  placeholder="e.g. forgeos-custom-logo.png"
                  className="w-full px-3 py-2 rounded-xl bg-[#0B1311] border border-[#1E3A33] text-xs font-mono text-[#F0FDF4] focus:outline-none focus:border-[#10B981]"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2 border-t border-[#1E3A33]">
              <button
                type="button"
                onClick={() => handleConfirmFileName('keep-original')}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#142320] hover:bg-[#1E3A33] text-xs font-mono text-[#94A3B8] hover:text-white transition-all cursor-pointer"
              >
                Keep Original ({pendingUploadData.originalFileName})
              </button>

              <button
                type="button"
                onClick={() => handleConfirmFileName('use-app-name')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#059669] border border-[#10B981] text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Check className="w-4 h-4 text-[#34D399]" />
                <span>Apply App Name & Generate URL</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
