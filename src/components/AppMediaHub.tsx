import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  ExternalLink, 
  BookOpen, 
  Music, 
  Cpu, 
  Video, 
  ShieldAlert, 
  Users, 
  Heart, 
  ChevronRight, 
  Award,
  Globe,
  Share2,
  Lock,
  Compass,
  Sparkles,
  Upload,
  Layers,
  Film,
  LayoutGrid,
  Radio,
  Sliders,
  Check,
  BrainCircuit,
  Eye,
  Plus,
  Image as ImageIcon,
  Trash2,
  Link as LinkIcon,
  UploadCloud,
  X,
  RefreshCw,
  Cloud,
  HardDrive
} from 'lucide-react';
import { GeminiPodcastVideoStudio, MediaAsset } from './GeminiPodcastVideoStudio';
import { compressImage } from '../utils/imageCompressor';
import { safeGetJSON, safeSetJSON, safeRemove, idbGet } from '../utils/safeStorage';

// Interfaces for our state and data
export interface PodcastEpisode {
  id: string;
  title: string;
  duration: string;
  category: 'Protocol' | 'Creative' | 'Engineering';
  introduction: string;
  keyTakeaways: string[];
  audioUrl?: string; // Links to real or mock assets
}

export interface NativeApp {
  id: string;
  name: string;
  systemId: string;
  tagline: string;
  logoType: 'book' | 'node' | 'gear' | 'flow';
  themeColor: string; // Tailwind class color mapping
  glowColor: string; // CSS hex or Tailwind class for glow shadow
  description: string;
  licenseStandard: string;
  url: string;
}

interface AppMediaHubProps {
  onNavigateToTab?: (tab: any) => void;
  onOpenOnboardModal?: () => void;
}

export const AppMediaHub: React.FC<AppMediaHubProps> = ({
  onNavigateToTab,
  onOpenOnboardModal
}) => {
  // 1. Data Definitions
  const initialEpisodes: PodcastEpisode[] = [
    {
      id: 'ep-sdk',
      title: 'The H.U.M.A.N. Initiative: The Open SDK Revolution',
      duration: '18:42',
      category: 'Protocol',
      introduction: 'Discover the monumental transition from a closed application suite to an open, global protocol. Learn how any developer can integrate the H.U.M.A.N. SDK to instantly inherit our Zero-Ingestion Guarantee, provide unassailable C2PA Content Credentials, and capture the elite "Ethical Trust Premium" to skyrocket sales over extractive competitors while streaming automated micro-royalties directly to human living floors.',
      keyTakeaways: [
        'How the "Ethical Trust Premium" shifts customer acquisition cost dynamics.',
        'Explaining the correct-by-construction code generation in the onboarding registry.',
        'The structural flow of Stripe Connect multi-party splits in real-time.'
      ]
    },
    {
      id: 'ep-tome',
      title: 'Tome Crafter: The Ethical Future of Storywriting',
      duration: '12:15',
      category: 'Creative',
      introduction: 'Step into Tome Crafter (FT-ETHIC-TOMECRAFTER-2026), your native book-authoring and publishing engine. We break down the luminescent circuitry open-book logo, the cryptographic firewalls that prevent scrapers from mining your drafts, and how writing on a Fairly Trained certified platform returns sovereign dignity and full commercial rights back to human storytellers.',
      keyTakeaways: [
        'Protecting WIP manuscripts from non-consensual AI model scraping.',
        'Injecting C2PA JUMBF v2.1 Content Credentials into exported EPUBs and PDFs.',
        'Direct creator payout streams upon successful publication.'
      ]
    },
    {
      id: 'ep-audio',
      title: 'RLM Pro Studio: Audio Provenance & Node Networks',
      duration: '14:30',
      category: 'Creative',
      introduction: 'An in-depth exploration of RLM Pro Studio (FT-ETHIC-RLM-AUDIO-2026), the hybrid audio stem workstation and DAW. Learn how the stylized purple fingerprint interlaced with node networks represents personal human authorship fused with technology, and how decentralized asset tracking protects voice actors, musicians, and sound designs.',
      keyTakeaways: [
        'Using role-based wallets to distribute stem-level attribution payouts.',
        'Preventing voice cloning and deepfakes via cryptographic provenance hashes.',
        'Collaborating in real-time across decentralized secure creator hubs.'
      ]
    },
    {
      id: 'ep-forge',
      title: 'ForgeOS: The Code Compiler & Sandboxed Testing Guardrails',
      duration: '16:05',
      category: 'Engineering',
      introduction: 'For the builders. Explore ForgeOS (FT-ETHIC-FORGEOS-APPBUILDER-2026), your offline sandboxed compiler and AST auditing engine. We examine the 5-stage testing guardrails, how the compiler quarantines viral copyleft licensing (GPL/AGPL) at the AST tree level, and how the platform guarantees that your software remains pristine and legally safe.',
      keyTakeaways: [
        'The mechanics of the AST (Abstract Syntax Tree) Zero-Copyleft Quarantine.',
        'Simulating Stripe sandboxes with 0 license contamination.',
        'Securing the compliance signatures needed for the official Ethical AI Badge.'
      ]
    },
    {
      id: 'ep-video',
      title: 'RL Easy Flow: Flow-State Video and Biometric Verification',
      duration: '11:50',
      category: 'Creative',
      introduction: 'Enter RL Easy Flow (FT-ETHIC-RL-EASY-FLOW-2026), the AI-powered high-speed video rendering and layout suite. The hosts discuss the green motion-blurred biometric fingerprint design and trace how automated video production tools can operate safely under zero-ingestion rules.',
      keyTakeaways: [
        'Scaling visual renders without feeding proprietary neural networks.',
        'Understanding synthetic media labeling compliance under Articles 50 & 53 of the EU AI Act.',
        'Automating payout calculations when style templates or source footage are referenced.'
      ]
    }
  ];

  // Dynamic episodes with localStorage persistence
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>(() => {
    try {
      const saved = localStorage.getItem('human_gemini_podcasts');
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...parsed, ...initialEpisodes];
      }
    } catch (e) {
      console.error(e);
    }
    return initialEpisodes;
  });

  const apps: NativeApp[] = [
    {
      id: 'app-tome',
      name: 'Tome Crafter',
      systemId: 'FT-ETHIC-TOMECRAFTER-2026',
      tagline: 'Ethical Book Publishing & Writer Suite',
      logoType: 'book',
      themeColor: 'from-blue-500 to-indigo-600',
      glowColor: 'rgba(59, 130, 246, 0.4)',
      description: 'The native writer ecosystem built from the ground up to secure creative authorship. Authors can draft, collaborate, format, and publish with complete peace of mind, knowing their words are protected by an unyielding cleanroom protocol.',
      licenseStandard: 'Fairly Trained (FT-2026) Certified',
      url: 'https://tomecrafter-ai-book-studio.ai.studio'
    },
    {
      id: 'app-audio',
      name: 'RLM Pro Studio',
      systemId: 'FT-ETHIC-RLM-AUDIO-2026',
      tagline: 'Decentralized Audio DAW & Stem Lab',
      logoType: 'node',
      themeColor: 'from-fuchsia-500 to-purple-600',
      glowColor: 'rgba(217, 70, 239, 0.4)',
      description: 'A professional-grade digital audio workstation featuring secure, stem-level attribution tracking. Harness advanced generation tools with a hardcoded promise that your unique acoustic signature is never ingested.',
      licenseStandard: 'C2PA JUMBF v2.1 Audio Compliant',
      url: 'https://remix-lyria-studio-5954.ai.studio'
    },
    {
      id: 'app-forge',
      name: 'ForgeOS',
      systemId: 'FT-ETHIC-FORGEOS-APPBUILDER-2026',
      tagline: 'Compiler Sandbox & AST Licensing Shield',
      logoType: 'gear',
      themeColor: 'from-emerald-500 to-teal-600',
      glowColor: 'rgba(16, 185, 129, 0.4)',
      description: 'The ultimate offline compiler and testing ground. Scans dependencies at the Abstract Syntax Tree level to isolate viral copyleft licenses, keeping your commercial products legally pristine and certified for distribution.',
      licenseStandard: 'EU AI Act (Art. 50/53) Verified',
      url: 'https://reforgeos-live.ai.studio'
    },
    {
      id: 'app-video',
      name: 'RL Easy Flow',
      systemId: 'FT-ETHIC-RL-EASY-FLOW-2026',
      tagline: 'Zero-Ingestion AI Video Render Suite',
      logoType: 'flow',
      themeColor: 'from-cyan-500 to-blue-600',
      glowColor: 'rgba(6, 182, 212, 0.4)',
      description: 'A fluid, template-driven motion design and video rendering ecosystem. Empowers independent creators to output professional cinemagraphs and reels while validating visual provenance through strict cryptographic streams.',
      licenseStandard: 'Cleanroom Zero-Ingestion Certified',
      url: 'https://rl-easy-flow.ai.studio'
    }
  ];

  // 2. Playback & Video Collage State Control
  const [activeEpisode, setActiveEpisode] = useState<PodcastEpisode>(episodes[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(35); // simulated percent
  const [volume, setVolume] = useState<number>(80);
  const [playerViewMode, setPlayerViewMode] = useState<'audio' | 'video_collage'>('video_collage');
  const [isGeminiStudioOpen, setIsGeminiStudioOpen] = useState<boolean>(false);
  const [geminiStudioInitialTab, setGeminiStudioInitialTab] = useState<'local' | 'drive'>('local');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleOpenGeminiStudio = (tab: 'local' | 'drive' = 'local') => {
    setGeminiStudioInitialTab(tab);
    setIsGeminiStudioOpen(true);
  };

  // 2.1 Custom App Logos State & Persistence (Protected against LocalStorage quota overflow)
  const [customLogos, setCustomLogos] = useState<Record<string, string>>(() => {
    return safeGetJSON<Record<string, string>>('human_custom_app_logos', {});
  });
  const [isLogoManagerOpen, setIsLogoManagerOpen] = useState<boolean>(false);
  const [activeLogoEditAppId, setActiveLogoEditAppId] = useState<string>('app-tome');
  const [customLogoUrlInput, setCustomLogoUrlInput] = useState<string>('');
  const [logoUploadError, setLogoUploadError] = useState<string | null>(null);

  // Sync from IndexedDB in case of large past logos
  useEffect(() => {
    idbGet<Record<string, string>>('human_custom_app_logos').then((idbLogos) => {
      if (idbLogos && Object.keys(idbLogos).length > 0) {
        setCustomLogos((prev) => ({ ...idbLogos, ...prev }));
      }
    }).catch(() => {});
  }, []);

  const handleSaveCustomLogo = async (appId: string, url: string) => {
    let optimizedUrl = url;
    // If it's a base64 data URL or long image string, compress it to keep under quota
    if (url.startsWith('data:image/')) {
      try {
        optimizedUrl = await compressImage(url, 256, 256, 0.85);
      } catch (e) {
        console.warn('Compression failed, using raw url', e);
      }
    }

    const updated = { ...customLogos, [appId]: optimizedUrl };
    setCustomLogos(updated);
    safeSetJSON('human_custom_app_logos', updated);
    
    const appName = apps.find(a => a.id === appId)?.name || 'App';
    setToastMessage(`Custom logo applied for ${appName}!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleResetCustomLogo = (appId: string) => {
    const updated = { ...customLogos };
    delete updated[appId];
    setCustomLogos(updated);
    safeSetJSON('human_custom_app_logos', updated);
    const appName = apps.find(a => a.id === appId)?.name || 'App';
    setToastMessage(`Reset ${appName} to default generated vector logo.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleResetAllLogos = () => {
    setCustomLogos({});
    safeRemove('human_custom_app_logos');
    setToastMessage('All app logos reset to default vector graphics.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleFileLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, appId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setLogoUploadError('Please select a valid image file (PNG, SVG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setLogoUploadError('Image size exceeds 5MB. Please select a smaller logo.');
      return;
    }

    setLogoUploadError(null);
    try {
      // Automatically compress and resize image to compact 256x256 WebP/PNG (~5-15KB)
      const compressedDataUrl = await compressImage(file, 256, 256, 0.85);
      await handleSaveCustomLogo(appId, compressedDataUrl);
    } catch (err: any) {
      console.error('Failed to process uploaded logo image:', err);
      setLogoUploadError('Failed to optimize and process the image. Please try another file.');
    }
  };

  // Background media assets for the live player video collage
  const defaultPlayerAssets: MediaAsset[] = [
    {
      id: 'hero-1',
      type: 'image',
      name: 'Neural Human Symbiosis',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'hero-2',
      type: 'image',
      name: 'Decentralized Nodes',
      url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'hero-3',
      type: 'image',
      name: 'Acoustic Stems Lab',
      url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'hero-4',
      type: 'image',
      name: 'Cleanroom Architecture',
      url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    }
  ];
  const [currentCollageAssets, setCurrentCollageAssets] = useState<MediaAsset[]>(defaultPlayerAssets);
  const [activeCollageIndex, setActiveCollageIndex] = useState<number>(0);
  const [currentCollageStyle, setCurrentCollageStyle] = useState<string>('bento');

  // Audio simulation timer
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setPlaybackProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Slideshow timer for background collage in player
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveCollageIndex((prev) => (prev + 1) % currentCollageAssets.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, currentCollageAssets.length]);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const handleEpisodeSelect = (episode: PodcastEpisode) => {
    setActiveEpisode(episode);
    setIsPlaying(false);
    setPlaybackProgress(0);
  };

  const handlePublishFromStudio = (newEp: PodcastEpisode, assets: MediaAsset[], style: string) => {
    setEpisodes((prev) => [newEp, ...prev]);
    setActiveEpisode(newEp);
    setCurrentCollageAssets(assets);
    setCurrentCollageStyle(style);
    setIsPlaying(true);
    setPlaybackProgress(0);
    
    const existing = safeGetJSON<PodcastEpisode[]>('human_gemini_podcasts', []);
    safeSetJSON('human_gemini_podcasts', [newEp, ...existing]);

    setToastMessage(`Published "${newEp.title}" with dynamic video collage to the Broadcast Matrix!`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  // 3. Logo SVG Generators based on their descriptions
  const renderLogoSVG = (type: 'book' | 'node' | 'gear' | 'flow', _color: string) => {
    switch (type) {
      case 'book':
        // Tome Crafter: Luminescent open book with fingerprint at the heart
        return (
          <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#818CF8" />
              </linearGradient>
              <filter id="glowBook" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            {/* Open Book Wings as circuit tracks */}
            <path d="M50 85 C40 85, 20 80, 10 70 V25 C20 35, 40 40, 50 40 C60 40, 80 35, 90 25 V70 C80 80, 60 85, 50 85 Z" fill="url(#bookGrad)" fillOpacity="0.1" stroke="url(#bookGrad)" strokeWidth="2.5" strokeDasharray="3,3" filter="url(#glowBook)" />
            <path d="M50 40 V85" stroke="url(#bookGrad)" strokeWidth="3" />
            {/* Circuit Nodes radiating from center */}
            <circle cx="25" cy="50" r="3" fill="#60A5FA" />
            <line x1="25" y1="50" x2="35" y2="45" stroke="#60A5FA" strokeWidth="1.5" />
            <circle cx="75" cy="50" r="3" fill="#60A5FA" />
            <line x1="75" y1="50" x2="65" y2="45" stroke="#60A5FA" strokeWidth="1.5" />
            {/* Fingerprint at the heart */}
            <g transform="translate(37, 45) scale(0.25)" stroke="#60A5FA" strokeWidth="2" fill="none" strokeLinecap="round">
              <path d="M10 30 C12 18, 38 18, 40 30 C41 36, 35 40, 30 45" strokeWidth="3" />
              <path d="M16 35 C18 24, 32 24, 34 35" />
              <path d="M22 40 C24 35, 26 35, 28 40" />
              <path d="M4 25 C8 10, 42 10, 46 25" />
            </g>
          </svg>
        );
      case 'node':
        // RLM Pro Studio: Neon fingerprint interlaced with node network
        return (
          <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="nodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D946EF" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
              <filter id="glowNode" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            {/* Geometric Concentric Rings */}
            <circle cx="50" cy="50" r="42" stroke="url(#nodeGrad)" strokeWidth="1" strokeDasharray="5,5" />
            <circle cx="50" cy="50" r="34" stroke="url(#nodeGrad)" strokeWidth="1.5" />
            {/* Node Network Lines */}
            <line x1="15" y1="50" x2="35" y2="25" stroke="#D946EF" strokeWidth="1" strokeOpacity="0.5" />
            <line x1="85" y1="50" x2="65" y2="75" stroke="#8B5CF6" strokeWidth="1" strokeOpacity="0.5" />
            <line x1="35" y1="25" x2="65" y2="25" stroke="#D946EF" strokeWidth="1" strokeOpacity="0.3" />
            {/* Glowing Nodes */}
            <circle cx="15" cy="50" r="4" fill="#D946EF" filter="url(#glowNode)" />
            <circle cx="35" cy="25" r="4" fill="#8B5CF6" filter="url(#glowNode)" />
            <circle cx="65" cy="75" r="4" fill="#D946EF" filter="url(#glowNode)" />
            <circle cx="85" cy="50" r="4" fill="#8B5CF6" filter="url(#glowNode)" />
            {/* Neon Fingerprint at center */}
            <g transform="translate(37, 35) scale(0.25)" stroke="#D946EF" strokeWidth="2.5" fill="none" strokeLinecap="round" filter="url(#glowNode)">
              <path d="M10 30 C12 18, 38 18, 40 30 C41 36, 35 40, 30 45" />
              <path d="M16 35 C18 24, 32 24, 34 35" />
              <path d="M22 40 C24 35, 26 35, 28 40" />
              <path d="M4 25 C8 10, 42 10, 46 25" />
            </g>
          </svg>
        );
      case 'gear':
        // ForgeOS: Heavy serrated gear silhouette framing microchip + radiating fingerprint
        return (
          <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="gearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <filter id="glowGear" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            {/* Gear Teeth Outer Border */}
            <path d="M50 10 L54 22 L66 18 L66 31 L78 31 L74 43 L84 50 L74 57 L78 69 L66 69 L66 82 L54 78 L50 88 L46 78 L34 82 L34 69 L22 69 L26 57 L16 50 L26 43 L22 31 L34 31 L34 18 L46 22 Z" fill="none" stroke="url(#gearGrad)" strokeWidth="2.5" filter="url(#glowGear)" />
            {/* Inner Microchip Box */}
            <rect x="35" y="35" width="30" height="30" rx="3" stroke="#10B981" strokeWidth="2" fill="#042F1A" />
            {/* Microchip pins radiating */}
            <line x1="30" y1="42" x2="35" y2="42" stroke="#10B981" strokeWidth="2" />
            <line x1="30" y1="50" x2="35" y2="50" stroke="#10B981" strokeWidth="2" />
            <line x1="30" y1="58" x2="35" y2="58" stroke="#10B981" strokeWidth="2" />
            <line x1="70" y1="42" x2="65" y2="42" stroke="#10B981" strokeWidth="2" />
            <line x1="70" y1="50" x2="65" y2="50" stroke="#10B981" strokeWidth="2" />
            <line x1="70" y1="58" x2="65" y2="58" stroke="#10B981" strokeWidth="2" />
            {/* Fingerprint inside microchip */}
            <g transform="translate(39, 40) scale(0.2)" stroke="#34D399" strokeWidth="2.5" fill="none" strokeLinecap="round">
              <path d="M10 30 C12 18, 38 18, 40 30 C41 36, 35 40, 30 45" />
              <path d="M16 35 C18 24, 32 24, 34 35" />
              <path d="M22 40 C24 35, 26 35, 28 40" />
            </g>
          </svg>
        );
      case 'flow':
        // RL Easy Flow: Green fingerprint encased in fluid, motion-blurred lines
        return (
          <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
              <filter id="glowFlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            {/* Motion Blur Waves wrapping around the logo */}
            <path d="M10 35 C30 20, 70 50, 90 35" stroke="url(#flowGrad)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            <path d="M10 65 C30 50, 70 80, 90 65" stroke="url(#flowGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
            <path d="M15 50 C35 35, 65 65, 85 50" stroke="url(#flowGrad)" strokeWidth="3" strokeLinecap="round" filter="url(#glowFlow)" />
            {/* Central glowing fingerprint, floating with fluid curves */}
            <g transform="translate(37, 36) scale(0.25)" stroke="#06B6D4" strokeWidth="3" fill="none" strokeLinecap="round" filter="url(#glowFlow)">
              <path d="M10 30 C12 18, 38 18, 40 30 C41 36, 35 40, 30 45" />
              <path d="M16 35 C18 24, 32 24, 34 35" />
              <path d="M22 40 C24 35, 26 35, 28 40" />
              <path d="M4 25 C8 10, 42 10, 46 25" />
            </g>
          </svg>
        );
    }
  };

  // Helper to render either custom uploaded logo or the generated vector logo
  const renderAppLogo = (app: NativeApp) => {
    const customUrl = customLogos[app.id];
    if (customUrl) {
      return (
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 flex items-center justify-center p-1.5 shadow-inner group-hover:border-emerald-500/50 transition-colors">
          <img 
            src={customUrl} 
            alt={`${app.name} Real Logo`} 
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      );
    }
    return renderLogoSVG(app.logoType, app.themeColor);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-black rounded-3xl overflow-hidden border border-slate-850 shadow-2xl">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-5 py-3 rounded-2xl font-mono text-xs font-bold shadow-2xl flex items-center space-x-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header/Navigation */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
              <Compass className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-wider text-slate-100">THE H.U.M.A.N. INITIATIVE</h1>
              <span className="text-xs text-emerald-500 tracking-widest font-mono uppercase">App & Broadcast Hub</span>
            </div>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Gemini Podcast Studio Button */}
            <button
              onClick={() => setIsGeminiStudioOpen(true)}
              className="flex items-center space-x-1.5 text-xs text-slate-100 font-mono bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 hover:border-emerald-400 px-3.5 py-2 rounded-md font-bold transition-all shadow-md cursor-pointer"
            >
              <BrainCircuit className="w-3.5 h-3.5 text-emerald-400" />
              <span>Gemini Podcast & Collage Studio</span>
            </button>

            <span className="text-xs sm:text-sm font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-md border border-slate-800 hidden md:inline">
              C2PA Merkle Root Verified
            </span>
            {onOpenOnboardModal ? (
              <button 
                onClick={onOpenOnboardModal}
                className="flex items-center space-x-1.5 text-xs text-slate-950 font-mono bg-emerald-500 hover:bg-emerald-400 px-4 py-2 rounded-md font-bold transition-all transform hover:-translate-y-0.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <span>Onboarding Console</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            ) : (
              <a 
                href="https://human-ethical-ai.ai.studio" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center space-x-1.5 text-xs text-slate-950 font-mono bg-emerald-500 hover:bg-emerald-400 px-4 py-2 rounded-md font-bold transition-all transform hover:-translate-y-0.5 shadow-lg shadow-emerald-500/20"
              >
                <span>Onboarding Console</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden py-16 px-6 border-b border-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-mono border border-emerald-500/20">
              <Award className="w-3.5 h-3.5" />
              <span>THE OPEN PROTOCOL ROADMAP</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-none text-slate-100">
              The Sovereign <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Human Renaissance</span> Soundboard
            </h2>
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl">
              Technology should be our symbiotic partner, never our replacement. Dive into our complete podcast fleet featuring comprehensive insights, application architectures, and the revolutionary <strong className="text-slate-100">H.U.M.A.N. SDK integration pipeline</strong>—designed to restore creator trust and fund regional human survival.
            </p>

            {/* Quick studio launcher pills */}
            <div className="pt-1 flex flex-wrap gap-2.5">
              <button
                onClick={() => handleOpenGeminiStudio('local')}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 text-emerald-300 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all shadow-lg cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Upload Gemini Notebook Audio & Video Collage</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleOpenGeminiStudio('drive')}
                className="inline-flex items-center space-x-1.5 bg-slate-900/80 hover:bg-slate-850 border border-slate-750 text-slate-200 hover:text-white px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer"
              >
                <Cloud className="w-4 h-4 text-cyan-400" />
                <span>Import from Google Drive</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center space-x-2.5 bg-slate-900/50 border border-slate-800 p-3 rounded-lg">
                <Users className="w-5 h-5 text-emerald-400" />
                <div className="text-left">
                  <div className="text-xs text-slate-500 font-mono">Registry Pool</div>
                  <div className="text-sm font-bold text-slate-100">100% Non-Profit</div>
                </div>
              </div>
              <div className="flex items-center space-x-2.5 bg-slate-900/50 border border-slate-800 p-3 rounded-lg">
                <Heart className="w-5 h-5 text-cyan-400" />
                <div className="text-left">
                  <div className="text-xs text-slate-500 font-mono">Society Split</div>
                  <div className="text-sm font-bold text-slate-100">50% Real-Time Escrow</div>
                </div>
              </div>
              <div className="flex items-center space-x-2.5 bg-slate-900/50 border border-slate-800 p-3 rounded-lg">
                <Lock className="w-5 h-5 text-blue-400" />
                <div className="text-left">
                  <div className="text-xs text-slate-500 font-mono">Data Policy</div>
                  <div className="text-sm font-bold text-slate-100">Zero-Ingestion</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Interactive Video Previewer & Player Card */}
          <div className="lg:col-span-5 bg-slate-900/40 border border-slate-850 p-5 rounded-3xl relative overflow-hidden shadow-2xl backdrop-blur-sm">
            
            {/* Mode Switcher Banner: Audio vs Video Collage */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-mono">
                <button
                  onClick={() => setPlayerViewMode('video_collage')}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    playerViewMode === 'video_collage' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Film className="w-3 h-3" />
                  <span>Video Collage</span>
                </button>
                <button
                  onClick={() => setPlayerViewMode('audio')}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    playerViewMode === 'audio' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Radio className="w-3 h-3" />
                  <span>Audio Matrix</span>
                </button>
              </div>

              <button
                onClick={() => setIsGeminiStudioOpen(true)}
                className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 cursor-pointer bg-cyan-950/40 border border-cyan-800/40 px-2 py-1 rounded-lg"
                title="Open Studio"
              >
                <Sparkles className="w-3 h-3" />
                <span>Open Studio</span>
              </button>
            </div>
            
            {/* Custom Interactive Player Card with Video Background Collage */}
            <div className="space-y-3">
              
              {/* VIDEO COLLAGE STAGE */}
              {playerViewMode === 'video_collage' && (
                <div className="relative rounded-2xl overflow-hidden aspect-video border border-slate-800 bg-slate-950 shadow-inner group">
                  
                  {/* Dynamic Background Images Grid / Ken Burns Motion */}
                  <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1 p-1">
                    {currentCollageAssets.slice(0, 4).map((asset, i) => {
                      const isActive = i === (activeCollageIndex % 4);
                      return (
                        <div key={asset.id} className="relative rounded-lg overflow-hidden bg-slate-900">
                          <img 
                            src={asset.url} 
                            alt={asset.name} 
                            className={`w-full h-full object-cover transition-all duration-1000 ${
                              isPlaying && isActive ? 'scale-115 opacity-100' : 'scale-100 opacity-70'
                            }`} 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                        </div>
                      );
                    })}
                  </div>

                  {/* Dark Translucent Overlay */}
                  <div className="absolute inset-0 bg-slate-950/45 pointer-events-none" />

                  {/* Top Badge Overlay */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                    <span className="text-[9px] font-mono text-emerald-300 bg-slate-950/90 border border-emerald-500/40 px-2 py-0.5 rounded-md flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>LIVE COLLAGE REEL</span>
                    </span>
                    <span className="text-[9px] font-mono text-slate-300 bg-slate-950/90 border border-slate-800 px-2 py-0.5 rounded-md">
                      C2PA Verified
                    </span>
                  </div>

                  {/* Center / Bottom Audio Waveform inside the video canvas */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between h-8 px-2 bg-slate-950/80 backdrop-blur-xs rounded-lg border border-slate-800/80 py-1 space-x-0.5 pointer-events-none">
                    {[30, 50, 20, 70, 40, 85, 60, 30, 65, 90, 40, 75, 50, 95, 30, 60, 80, 40, 70, 85, 30, 60, 90, 45].map((val, idx) => (
                      <div 
                        key={idx} 
                        className={`w-full rounded-t-xs transition-all duration-200 ${
                          isPlaying ? 'bg-gradient-to-t from-emerald-400 to-cyan-400' : 'bg-slate-700'
                        }`}
                        style={{ height: `${isPlaying ? Math.max(20, val * (0.6 + Math.random() * 0.4)) : val * 0.3}%` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Title & Metadata */}
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    {activeEpisode.category}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {activeEpisode.duration}
                  </span>
                </div>
                <h3 className="text-lg font-bold tracking-tight text-slate-100 line-clamp-1 mt-1">
                  {activeEpisode.title}
                </h3>
              </div>

              {/* Progress Bar & Audio Waves (For audio mode) */}
              {playerViewMode === 'audio' && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-end justify-between h-10 px-2 bg-slate-950/60 rounded-lg border border-slate-900/60 py-1.5 space-x-0.5">
                    {[40, 20, 60, 80, 50, 30, 45, 90, 70, 40, 20, 60, 85, 40, 30, 75, 50, 95, 60, 30, 45, 80, 65, 30, 50, 70, 90, 40, 25, 55, 75, 40].map((val, idx) => {
                      const isActive = idx < Math.floor(playbackProgress * 0.32);
                      return (
                        <div 
                          key={idx} 
                          className={`w-full rounded-t-sm transition-all duration-300 ${isActive ? (isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-emerald-500') : 'bg-slate-800'}`}
                          style={{ height: `${val}%` }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Scrubber Bar */}
              <div className="relative h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-cyan-400" style={{ width: `${playbackProgress}%` }} />
              </div>

              {/* Player Controls */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={togglePlayback}
                    className="w-10 h-10 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full flex items-center justify-center font-bold transition-all transform active:scale-95 shadow-md shadow-emerald-500/20 cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950 ml-0.5" />}
                  </button>
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <Volume2 className="w-4 h-4" />
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={volume} 
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="w-14 accent-emerald-500 h-1 bg-slate-800 rounded-lg outline-none cursor-pointer" 
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setIsGeminiStudioOpen(true)}
                    className="px-2.5 py-1.5 border border-slate-800 hover:border-slate-700 bg-slate-950 rounded-lg text-slate-300 text-xs font-mono flex items-center space-x-1 hover:text-emerald-400 transition-all cursor-pointer"
                    title="Edit Background Collage"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Collage</span>
                  </button>
                  <button 
                    onClick={() => alert(`Sharing Link for: ${activeEpisode.title}`)}
                    className="p-1.5 border border-slate-800 hover:border-slate-700 bg-slate-950 rounded-lg text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
                    title="Share Episode"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Body Grid */}
      <main className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Side: Broadcast / Podcast Selector (8 columns) */}
        <section className="lg:col-span-7 space-y-8">
          <div className="border-b border-slate-900 pb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center space-x-2">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                <span>THE BROADCAST MATRIX</span>
              </h3>
              <p className="text-sm text-slate-400 mt-1">Select an episode to populate the control studio and inspect deep takeaways.</p>
            </div>

            {/* Studio Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleOpenGeminiStudio('local')}
                className="flex items-center space-x-1.5 text-xs font-mono font-bold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 px-3.5 py-2 rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload Local Podcast</span>
              </button>
              <button
                onClick={() => handleOpenGeminiStudio('drive')}
                className="flex items-center space-x-1.5 text-xs font-mono font-bold bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 px-3.5 py-2 rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                <Cloud className="w-3.5 h-3.5 text-cyan-400" />
                <span>Google Drive Audio</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {episodes.map((ep) => {
              const isSelected = ep.id === activeEpisode.id;
              const isGeminiCustom = ep.id.startsWith('gemini-podcast');
              return (
                <div 
                  key={ep.id}
                  onClick={() => handleEpisodeSelect(ep)}
                  className={`border p-5 rounded-xl transition-all duration-300 cursor-pointer text-left relative ${isSelected ? 'bg-slate-900/60 border-emerald-500/40 shadow-lg shadow-emerald-500/5' : 'bg-slate-950/40 border-slate-900 hover:bg-slate-900/20 hover:border-slate-800'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${ep.category === 'Protocol' ? 'bg-emerald-500/10 text-emerald-400' : ep.category === 'Engineering' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-purple-500/10 text-purple-400'}`}>
                        {ep.category}
                      </span>
                      {isGeminiCustom && (
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center space-x-1">
                          <BrainCircuit className="w-2.5 h-2.5" />
                          <span>NotebookLM Overview</span>
                        </span>
                      )}
                      <span className="text-xs font-mono text-slate-500">{ep.duration} mins</span>
                    </div>

                    {isSelected && (
                      <div className="bg-emerald-500/15 border border-emerald-500/30 text-[10px] text-emerald-400 font-mono uppercase px-2 py-0.5 rounded flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                        <span>Transmitting</span>
                      </div>
                    )}
                  </div>

                  <h4 className={`text-lg font-bold tracking-tight transition-colors ${isSelected ? 'text-emerald-400' : 'text-slate-100'}`}>
                    {ep.title}
                  </h4>
                  <p className="text-sm text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {ep.introduction}
                  </p>
                  
                  {isSelected && (
                    <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-bold text-slate-300 font-mono tracking-wider uppercase">Key Takeaways from the episode:</div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsGeminiStudioOpen(true);
                          }}
                          className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 cursor-pointer"
                        >
                          <Film className="w-3 h-3" />
                          <span>Customize Video Collage</span>
                        </button>
                      </div>
                      <ul className="space-y-2">
                        {ep.keyTakeaways.map((takeaway, index) => (
                          <li key={index} className="flex items-start text-xs text-slate-400 space-x-2">
                            <span className="text-emerald-400 font-bold mt-0.5 font-mono">[{index + 1}]</span>
                            <span>{takeaway}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Side: The Ecosystem Applications (5 columns) */}
        <section className="lg:col-span-5 space-y-8">
          <div className="border-b border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center space-x-2">
                <span className="w-2.5 h-2.5 bg-cyan-500 rounded-full" />
                <span>THE APPLICATION REGISTRY</span>
              </h3>
              <p className="text-sm text-slate-400 mt-1">Live subdomains deployed and secured under Fairly Trained 2026 guidelines.</p>
            </div>

            <button
              onClick={() => setIsLogoManagerOpen(true)}
              className="flex items-center space-x-1.5 text-xs font-mono font-bold bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 px-3.5 py-2 rounded-xl transition-all active:scale-95 cursor-pointer shrink-0 self-start sm:self-auto shadow-sm"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Customize Real Logos</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {apps.map((app) => {
              const hasCustomLogo = Boolean(customLogos[app.id]);
              return (
                <div 
                  key={app.id} 
                  className="bg-slate-950 border border-slate-900 rounded-2xl p-6 transition-all duration-300 hover:border-slate-800 flex flex-col justify-between group"
                  style={{ boxShadow: `0 4px 20px -2px ${app.glowColor}` }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="relative group/logo">
                        <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 transition-all group-hover:border-slate-700">
                          {renderAppLogo(app)}
                        </div>

                        {/* Quick Replace Logo Badge on Hover */}
                        <button
                          onClick={() => {
                            setActiveLogoEditAppId(app.id);
                            setIsLogoManagerOpen(true);
                          }}
                          className="absolute -bottom-2 -right-2 p-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg shadow-md transition-all scale-90 sm:scale-100 cursor-pointer"
                          title="Replace with your own real logo"
                        >
                          <ImageIcon className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-mono text-slate-500 tracking-wider uppercase block">System Registration ID</span>
                        <span className="text-xs font-bold font-mono text-emerald-400 tracking-tight">{app.systemId}</span>
                        {hasCustomLogo && (
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 inline-block mt-1">
                            Real Logo Active
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xl font-bold tracking-tight text-slate-100">{app.name}</h4>
                        <button
                          onClick={() => {
                            setActiveLogoEditAppId(app.id);
                            setIsLogoManagerOpen(true);
                          }}
                          className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 cursor-pointer transition-colors"
                        >
                          <ImageIcon className="w-3 h-3" />
                          <span>{hasCustomLogo ? 'Change Real Logo' : 'Upload Real Logo'}</span>
                        </button>
                      </div>
                      <span className="text-xs font-mono text-emerald-500 block">{app.tagline}</span>
                      <p className="text-sm text-slate-400 leading-relaxed pt-2">
                        {app.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider bg-slate-900 text-slate-400 px-2 py-1 rounded border border-slate-800">
                      {app.licenseStandard}
                    </span>
                    <a 
                      href={app.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center space-x-1 text-xs text-slate-100 hover:text-emerald-400 font-mono tracking-tight font-bold transition-colors"
                    >
                      <span>Launch Studio</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* 4. Interactive Call-To-Action SDK Section */}
      <section className="bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-900/60 via-slate-950 to-slate-950 border-t border-slate-900 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-1.5 bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full text-xs font-mono border border-cyan-500/20">
            <Cpu className="w-3.5 h-3.5" />
            <span>CONNECT YOUR WORK</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-100">
            Build with the H.U.M.A.N. SDK
          </h2>
          <p className="text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            You don't need to depend on our native app fleet. By integrating our open-source, lightweight software development kit, you can immediately prove your respect for content creators, offer a certified trustworthy user alternative, and drive higher sales volumes in the ethical marketplace.
          </p>

          <div className="bg-slate-950 border border-slate-900 p-6 rounded-2xl max-w-xl mx-auto text-left space-y-4">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <span className="text-xs font-mono text-emerald-500 tracking-wider">Generated Initialisation Preview</span>
              <span className="text-[10px] font-mono text-slate-500">TypeScript / React</span>
            </div>
            <pre className="text-xs font-mono text-emerald-400 overflow-x-auto p-3 bg-slate-950 rounded-lg leading-relaxed">
{`import { HumanRegistrySDK } from '@human-initiative/sdk';

// Automatically generated client-side instance
const sdk = new HumanRegistrySDK({
  appId: "APP-ETHIC-YOURPLATFORM-2026",
  licenseStandard: "FT-2026",
  escrowSplit: 0.50, // Immutable 50% People's Covenant
  c2paWatermarking: true
});

await sdk.initialize();`}
            </pre>
            <div className="text-xs text-slate-500 leading-relaxed text-center">
              The customized SDK folder and dynamic guide are generated in real-time when you complete app registration on our main console.
            </div>
          </div>
          
          <div className="pt-4">
            {onNavigateToTab ? (
              <button 
                onClick={() => onNavigateToTab('developer-embed')}
                className="inline-flex items-center space-x-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-slate-100 px-6 py-3 rounded-lg font-mono text-sm font-bold transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Register Your App & Fetch SDK</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <a 
                href="https://human-ethical-ai.ai.studio" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-slate-100 px-6 py-3 rounded-lg font-mono text-sm font-bold transition-all transform hover:-translate-y-0.5"
              >
                <span>Register Your App & Fetch SDK</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 px-6 text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="bg-slate-900 p-1.5 rounded-md border border-slate-800">
              <Compass className="w-4 h-4 text-emerald-500" />
            </div>
            <span className="font-mono text-xs tracking-widest text-slate-400">THE H.U.M.A.N. INITIATIVE FOUNDATION</span>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
            {onOpenOnboardModal ? (
              <button onClick={onOpenOnboardModal} className="hover:text-slate-300 transition-colors cursor-pointer">Onboarding</button>
            ) : (
              <a href="https://human-ethical-ai.ai.studio" className="hover:text-slate-300 transition-colors">Onboarding</a>
            )}
            <span>•</span>
            <span className="text-emerald-500">EU AI Act Compliant</span>
            <span>•</span>
            <span>Est. 2026</span>
          </div>
        </div>
      </footer>

      {/* 6. Gemini Podcast & Video Collage Studio Modal */}
      {isGeminiStudioOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="w-full max-w-7xl max-h-[92vh] flex flex-col my-auto overflow-y-auto">
            <GeminiPodcastVideoStudio
              onClose={() => setIsGeminiStudioOpen(false)}
              onPublishEpisode={handlePublishFromStudio}
              initialEpisode={activeEpisode}
              initialSourceTab={geminiStudioInitialTab}
            />
          </div>
        </div>
      )}

      {/* 7. Real App Logos Customizer & Manager Modal */}
      {isLogoManagerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/60">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-cyan-500/15 border border-cyan-500/30 rounded-xl text-cyan-400">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                    <span>Application Real Logo Manager</span>
                    <span className="text-[10px] font-mono font-normal uppercase px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      Persistent
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Replace generated vector graphics with your own real brand logos.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsLogoManagerOpen(false);
                  setLogoUploadError(null);
                  setCustomLogoUrlInput('');
                }}
                className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs font-sans">
              
              {/* App Selection Tabs */}
              <div>
                <label className="text-[11px] font-mono text-slate-400 font-bold block uppercase tracking-wider mb-2">
                  Select App to Replace Logo:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {apps.map((app) => {
                    const isSelected = app.id === activeLogoEditAppId;
                    const hasCustom = Boolean(customLogos[app.id]);
                    return (
                      <button
                        key={app.id}
                        onClick={() => {
                          setActiveLogoEditAppId(app.id);
                          setLogoUploadError(null);
                          setCustomLogoUrlInput('');
                        }}
                        className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 border-cyan-500 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono text-slate-500">{app.id.replace('app-', '#')}</span>
                          {hasCustom ? (
                            <span className="w-2 h-2 rounded-full bg-emerald-400" title="Custom logo active" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-slate-700" title="Default vector" />
                          )}
                        </div>
                        <span className={`font-bold text-xs truncate ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                          {app.name}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500 mt-1">
                          {hasCustom ? 'Real Logo' : 'Generated'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active App Customizer Card */}
              {(() => {
                const targetApp = apps.find(a => a.id === activeLogoEditAppId) || apps[0];
                const currentCustomLogo = customLogos[targetApp.id];

                return (
                  <div className="space-y-6">
                    
                    {/* Live Preview Card */}
                    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center gap-5">
                      <div className="relative shrink-0">
                        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-700 shadow-xl flex items-center justify-center">
                          {renderAppLogo(targetApp)}
                        </div>
                        <span className={`absolute -bottom-2 -right-2 text-[9px] font-mono uppercase px-2 py-0.5 rounded-full font-bold shadow-md ${
                          currentCustomLogo 
                            ? 'bg-emerald-500 text-slate-950' 
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}>
                          {currentCustomLogo ? 'Real Custom' : 'Default SVG'}
                        </span>
                      </div>

                      <div className="space-y-1 text-center sm:text-left flex-1">
                        <h4 className="text-sm font-bold text-slate-100">{targetApp.name}</h4>
                        <p className="text-[11px] font-mono text-emerald-400">{targetApp.systemId}</p>
                        <p className="text-xs text-slate-400">{targetApp.tagline}</p>
                        {currentCustomLogo && (
                          <div className="pt-2">
                            <button
                              onClick={() => handleResetCustomLogo(targetApp.id)}
                              className="text-[11px] font-mono text-rose-400 hover:text-rose-300 flex items-center space-x-1 cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Revert to Default Generated Vector</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Upload Section 1: File from Computer / Device */}
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-slate-200 flex items-center space-x-1.5">
                          <UploadCloud className="w-4 h-4 text-cyan-400" />
                          <span>Option 1: Upload Image File (PNG, SVG, JPG, WebP)</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">Max 3MB</span>
                      </div>

                      <label className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-500/5 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all text-center group">
                        <UploadCloud className="w-6 h-6 text-slate-500 group-hover:text-cyan-400 mb-2 transition-colors" />
                        <span className="text-xs text-slate-300 font-medium">Click to select or drop your real brand logo here</span>
                        <span className="text-[10px] font-mono text-slate-500 mt-1">Recommended: 256x256 square PNG or SVG with transparent background</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileLogoUpload(e, targetApp.id)}
                        />
                      </label>
                    </div>

                    {/* Upload Section 2: Direct Image URL */}
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                      <span className="text-xs font-mono font-bold text-slate-200 flex items-center space-x-1.5">
                        <LinkIcon className="w-4 h-4 text-cyan-400" />
                        <span>Option 2: Direct Web Image URL</span>
                      </span>

                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://example.com/brand-logo.png"
                          value={customLogoUrlInput}
                          onChange={(e) => setCustomLogoUrlInput(e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-100 placeholder:text-slate-600 outline-none"
                        />
                        <button
                          onClick={() => {
                            if (!customLogoUrlInput.trim()) return;
                            handleSaveCustomLogo(targetApp.id, customLogoUrlInput.trim());
                            setCustomLogoUrlInput('');
                          }}
                          disabled={!customLogoUrlInput.trim()}
                          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                        >
                          Apply URL
                        </button>
                      </div>
                    </div>

                    {logoUploadError && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs">
                        {logoUploadError}
                      </div>
                    )}

                  </div>
                );
              })()}

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
              <button
                onClick={handleResetAllLogos}
                className="text-xs font-mono text-slate-400 hover:text-rose-400 transition-colors flex items-center space-x-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset All 4 Logos</span>
              </button>

              <button
                onClick={() => {
                  setIsLogoManagerOpen(false);
                  setLogoUploadError(null);
                  setCustomLogoUrlInput('');
                }}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs transition-all shadow-md cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AppMediaHub;
