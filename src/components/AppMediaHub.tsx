import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
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
  HardDrive,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Copy,
  CheckCheck,
  Mail,
  Send,
  MessageSquare,
  Disc,
  Headphones,
  Info
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

  // 2. Playback, Station Looping & Audio Engine State Control
  const [activeEpisode, setActiveEpisode] = useState<PodcastEpisode>(episodes[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [loopMode, setLoopMode] = useState<'station' | 'focused' | 'off'>('station');
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [playerViewMode, setPlayerViewMode] = useState<'audio' | 'video_collage'>('video_collage');
  const [isGeminiStudioOpen, setIsGeminiStudioOpen] = useState<boolean>(false);
  const [geminiStudioInitialTab, setGeminiStudioInitialTab] = useState<'local' | 'drive'>('local');
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedEmbed, setCopiedEmbed] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Audio HTML5 and Web Audio Synthesizer references
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthCtxRef = useRef<AudioContext | null>(null);
  const synthGainRef = useRef<GainNode | null>(null);
  const synthOscTimerRef = useRef<any>(null);

  const handleOpenGeminiStudio = (tab: 'local' | 'drive' = 'local') => {
    setGeminiStudioInitialTab(tab);
    setIsGeminiStudioOpen(true);
  };

  // Check URL query parameters for deep linked episode on mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const epParam = params.get('episode');
      if (epParam) {
        const found = episodes.find((e) => e.id === epParam);
        if (found) {
          setActiveEpisode(found);
          setIsPlaying(true);
          setToastMessage(`Tuned in to "${found.title}"`);
          setTimeout(() => setToastMessage(null), 4000);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Web Audio Synth for default episodes without uploaded MP3s
  const startSynthesizerAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!synthCtxRef.current || synthCtxRef.current.state === 'closed') {
        synthCtxRef.current = new AudioCtx();
      }
      const ctx = synthCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      if (!synthGainRef.current) {
        synthGainRef.current = ctx.createGain();
        synthGainRef.current.connect(ctx.destination);
      }
      const effectiveVol = isMuted ? 0 : (volume / 100) * 0.15;
      synthGainRef.current.gain.setValueAtTime(effectiveVol, ctx.currentTime);

      const chords = [
        [220, 277.18, 329.63, 440],
        [196, 246.94, 293.66, 392],
        [174.61, 220, 261.63, 349.23],
        [164.81, 207.65, 246.94, 329.63]
      ];
      let chordIdx = 0;

      clearInterval(synthOscTimerRef.current);
      synthOscTimerRef.current = setInterval(() => {
        if (ctx.state === 'closed') return;
        const currentChord = chords[chordIdx % chords.length];
        chordIdx++;
        currentChord.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          osc.type = i === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          noteGain.gain.setValueAtTime(0, ctx.currentTime);
          noteGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.8);
          noteGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.8);

          osc.connect(noteGain);
          if (synthGainRef.current) {
            noteGain.connect(synthGainRef.current);
          }
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 4.0);
        });
      }, 4000);
    } catch (e) {
      console.warn('Synth error:', e);
    }
  };

  const stopSynthesizerAudio = () => {
    clearInterval(synthOscTimerRef.current);
    if (synthGainRef.current && synthCtxRef.current) {
      try {
        synthGainRef.current.gain.linearRampToValueAtTime(0, synthCtxRef.current.currentTime + 0.2);
      } catch (e) {}
    }
  };

  // Synchronize audio element and synthesizer with isPlaying & activeEpisode
  useEffect(() => {
    if (activeEpisode.audioUrl) {
      stopSynthesizerAudio();
      if (audioRef.current) {
        if (audioRef.current.src !== activeEpisode.audioUrl) {
          audioRef.current.src = activeEpisode.audioUrl;
          audioRef.current.load();
        }
        audioRef.current.volume = isMuted ? 0 : volume / 100;
        if (isPlaying) {
          audioRef.current.play().catch((err) => {
            console.warn('Audio play request interrupted:', err);
          });
        } else {
          audioRef.current.pause();
        }
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (isPlaying) {
        startSynthesizerAudio();
      } else {
        stopSynthesizerAudio();
      }
    }

    return () => {
      stopSynthesizerAudio();
    };
  }, [isPlaying, activeEpisode.audioUrl, activeEpisode.id]);

  // Handle audio volume & mute updates
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    }
    if (audioRef.current) {
      audioRef.current.volume = newVol / 100;
    }
    if (synthGainRef.current && synthCtxRef.current) {
      synthGainRef.current.gain.setValueAtTime((newVol / 100) * 0.15, synthCtxRef.current.currentTime);
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.volume = nextMuted ? 0 : volume / 100;
    }
    if (synthGainRef.current && synthCtxRef.current) {
      synthGainRef.current.gain.setValueAtTime(nextMuted ? 0 : (volume / 100) * 0.15, synthCtxRef.current.currentTime);
    }
  };

  // Handle track ending logic based on Loop Mode (Station vs Focused Loop)
  const handleTrackEnded = () => {
    if (loopMode === 'focused') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
      setPlaybackProgress(0);
      setCurrentTime(0);
      setToastMessage(`🔁 Repeating: "${activeEpisode.title}"`);
      setTimeout(() => setToastMessage(null), 3000);
    } else if (loopMode === 'station') {
      const currentIndex = episodes.findIndex((e) => e.id === activeEpisode.id);
      const nextIndex = isShuffle 
        ? Math.floor(Math.random() * episodes.length) 
        : (currentIndex + 1) % episodes.length;
      const nextEp = episodes[nextIndex];
      setActiveEpisode(nextEp);
      setIsPlaying(true);
      setPlaybackProgress(0);
      setCurrentTime(0);
      setToastMessage(`📻 Station Radio: Auto-advancing to "${nextEp.title}"`);
      setTimeout(() => setToastMessage(null), 4000);
    } else {
      setIsPlaying(false);
      setPlaybackProgress(100);
    }
  };

  // Real audio element timeupdate listener
  const handleAudioTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      const cur = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      setCurrentTime(cur);
      setDuration(dur);
      setPlaybackProgress((cur / dur) * 100);
    }
  };

  const handleAudioLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  // Progress timer for synthesized/fallback episodes
  useEffect(() => {
    let timer: any = null;
    if (isPlaying && !activeEpisode.audioUrl) {
      timer = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            handleTrackEnded();
            return 0;
          }
          return prev + 0.6;
        });
        setCurrentTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, activeEpisode.audioUrl, loopMode, isShuffle, episodes, activeEpisode.id]);

  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPercent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setPlaybackProgress(clickPercent * 100);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = clickPercent * audioRef.current.duration;
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleNextEpisode = () => {
    const currentIndex = episodes.findIndex((e) => e.id === activeEpisode.id);
    const nextIndex = isShuffle 
      ? Math.floor(Math.random() * episodes.length) 
      : (currentIndex + 1) % episodes.length;
    const nextEp = episodes[nextIndex];
    setActiveEpisode(nextEp);
    setPlaybackProgress(0);
    setCurrentTime(0);
    setIsPlaying(true);
    setToastMessage(`Tuned in to: "${nextEp.title}"`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePrevEpisode = () => {
    const currentIndex = episodes.findIndex((e) => e.id === activeEpisode.id);
    const prevIndex = (currentIndex - 1 + episodes.length) % episodes.length;
    const prevEp = episodes[prevIndex];
    setActiveEpisode(prevEp);
    setPlaybackProgress(0);
    setCurrentTime(0);
    setIsPlaying(true);
    setToastMessage(`Tuned in to: "${prevEp.title}"`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec) || sec <= 0) return '00:00';
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getEpisodeShareUrl = (epId: string) => {
    const origin = window.location.origin;
    const path = window.location.pathname;
    return `${origin}${path}?tab=media-hub&episode=${encodeURIComponent(epId)}`;
  };

  const handleShareEpisode = async () => {
    const shareUrl = getEpisodeShareUrl(activeEpisode.id);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${activeEpisode.title} | The H.U.M.A.N. Protocol Broadcast Matrix`,
          text: `${activeEpisode.title} — ${activeEpisode.introduction}`,
          url: shareUrl
        });
        setToastMessage('Shared episode link successfully!');
        setTimeout(() => setToastMessage(null), 3000);
        return;
      } catch (e) {
        // Fall back to modal
      }
    }
    setIsShareModalOpen(true);
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
    setPlaybackProgress(0);
    setCurrentTime(0);
    setIsPlaying(true);
    setToastMessage(`Focused on "${episode.title}"`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePublishFromStudio = (newEp: PodcastEpisode, assets: MediaAsset[], style: string) => {
    setEpisodes((prev) => [newEp, ...prev]);
    setActiveEpisode(newEp);
    setCurrentCollageAssets(assets);
    setCurrentCollageStyle(style);
    setIsPlaying(true);
    setPlaybackProgress(0);
    setCurrentTime(0);
    
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

          {/* RIGHT SIDE: Interactive Video Previewer, Radio Station Player & Audio Engine */}
          <div className="lg:col-span-5 bg-slate-900/40 border border-slate-850 p-5 rounded-3xl relative overflow-hidden shadow-2xl backdrop-blur-sm">
            
            {/* Real Audio Element for actual playback with volume & station looping */}
            <audio 
              ref={audioRef}
              onTimeUpdate={handleAudioTimeUpdate}
              onLoadedMetadata={handleAudioLoadedMetadata}
              onEnded={handleTrackEnded}
              className="hidden"
            />

            {/* Mode Switcher Banner: Audio vs Video Collage & Station Mode Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-mono">
                <button
                  onClick={() => setPlayerViewMode('video_collage')}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    playerViewMode === 'video_collage' ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Film className="w-3 h-3" />
                  <span>Video Collage</span>
                </button>
                <button
                  onClick={() => setPlayerViewMode('audio')}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    playerViewMode === 'audio' ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Radio className="w-3 h-3" />
                  <span>Audio Matrix</span>
                </button>
              </div>

              <div className="flex items-center space-x-1.5">
                {/* Station Mode Toggle Button */}
                <button
                  onClick={() => {
                    const nextMode = loopMode === 'station' ? 'focused' : loopMode === 'focused' ? 'off' : 'station';
                    setLoopMode(nextMode);
                    setToastMessage(
                      nextMode === 'station' 
                        ? '📻 Sovereign Radio: Continuous Station Loop Active (Auto-advance all)' 
                        : nextMode === 'focused' 
                        ? '🔁 Focus Mode: Repeating Active Episode in Loop' 
                        : '⏹️ Single Playback (No Loop)'
                    );
                    setTimeout(() => setToastMessage(null), 3500);
                  }}
                  className={`text-[11px] font-mono flex items-center space-x-1 px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    loopMode === 'station'
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold'
                      : loopMode === 'focused'
                      ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                  title={loopMode === 'station' ? 'Station Loop: Auto-cycles all matrix episodes continuously' : loopMode === 'focused' ? 'Focused Loop: Repeats current episode' : 'Loop Off: Stops at track end'}
                >
                  {loopMode === 'station' ? (
                    <>
                      <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                      <span>Station Loop</span>
                    </>
                  ) : loopMode === 'focused' ? (
                    <>
                      <Repeat1 className="w-3 h-3 text-cyan-400" />
                      <span>Focus Loop</span>
                    </>
                  ) : (
                    <>
                      <Repeat className="w-3 h-3 text-slate-500" />
                      <span>Play Once</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setIsGeminiStudioOpen(true)}
                  className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 cursor-pointer bg-cyan-950/40 border border-cyan-800/40 px-2 py-1 rounded-lg"
                  title="Open Studio"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Studio</span>
                </button>
              </div>
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
                    <span className="text-[9px] font-mono text-emerald-300 bg-slate-950/90 border border-emerald-500/40 px-2 py-0.5 rounded-md flex items-center space-x-1.5 shadow-sm">
                      <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
                      <span>{loopMode === 'station' ? '24/7 STATION RADIO LOOP' : 'LIVE COLLAGE REEL'}</span>
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {activeEpisode.category}
                    </span>
                    {activeEpisode.audioUrl ? (
                      <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 px-1.5 py-0.5 rounded flex items-center space-x-1">
                        <Headphones className="w-2.5 h-2.5" />
                        <span>Voice Track</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded flex items-center space-x-1">
                        <Disc className="w-2.5 h-2.5" />
                        <span>Ambient Protocol</span>
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {formatSeconds(currentTime)} / {activeEpisode.audioUrl && duration > 0 ? formatSeconds(duration) : activeEpisode.duration}
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

              {/* Interactive Scrubber Bar with Click/Drag Seeking */}
              <div 
                onClick={handleScrubberClick}
                className="relative h-2 w-full bg-slate-800 hover:bg-slate-750 rounded-full overflow-hidden cursor-pointer group transition-all"
                title="Click to seek position"
              >
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-150" 
                  style={{ width: `${Math.min(100, Math.max(0, playbackProgress))}%` }} 
                />
              </div>

              {/* Comprehensive Audio Player Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                
                {/* Left Controls: Prev, Play/Pause, Next */}
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={handlePrevEpisode}
                    className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 hover:border-slate-700 hover:text-emerald-400 text-slate-300 flex items-center justify-center transition-all cursor-pointer"
                    title="Previous Episode"
                  >
                    <SkipBack className="w-3.5 h-3.5" />
                  </button>

                  <button 
                    onClick={togglePlayback}
                    className="w-10 h-10 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full flex items-center justify-center font-bold transition-all transform active:scale-95 shadow-md shadow-emerald-500/20 cursor-pointer"
                    title={isPlaying ? 'Pause' : 'Play Audio Broadcast'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950 ml-0.5" />}
                  </button>

                  <button 
                    onClick={handleNextEpisode}
                    className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 hover:border-slate-700 hover:text-emerald-400 text-slate-300 flex items-center justify-center transition-all cursor-pointer"
                    title="Next Episode"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                  </button>

                  {/* Volume Slider with Mute Toggle */}
                  <div className="flex items-center space-x-1.5 text-slate-400 bg-slate-950/80 border border-slate-800/80 px-2 py-1 rounded-lg">
                    <button 
                      onClick={toggleMute}
                      className="hover:text-emerald-400 transition-colors cursor-pointer"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={isMuted ? 0 : volume} 
                      onChange={(e) => handleVolumeChange(Number(e.target.value))}
                      className="w-14 accent-emerald-500 h-1 bg-slate-800 rounded-lg outline-none cursor-pointer" 
                      title={`Volume: ${isMuted ? 0 : volume}%`}
                    />
                    <span className="text-[10px] font-mono text-slate-500 w-5 text-right">
                      {isMuted ? '0' : volume}%
                    </span>
                  </div>
                </div>

                {/* Right Controls: Shuffle, Collage, Share */}
                <div className="flex items-center space-x-1.5">
                  <button 
                    onClick={() => {
                      setIsShuffle(!isShuffle);
                      setToastMessage(!isShuffle ? '🔀 Matrix Shuffle: Randomized Station Queue' : '▶️ Sequential Station Order');
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className={`p-1.5 border rounded-lg transition-all cursor-pointer ${
                      isShuffle 
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' 
                        : 'border-slate-800 hover:border-slate-700 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                    title={isShuffle ? 'Shuffle enabled' : 'Shuffle disabled'}
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                  </button>

                  <button 
                    onClick={() => setIsGeminiStudioOpen(true)}
                    className="px-2.5 py-1.5 border border-slate-800 hover:border-slate-700 bg-slate-950 rounded-lg text-slate-300 text-xs font-mono flex items-center space-x-1 hover:text-emerald-400 transition-all cursor-pointer"
                    title="Edit Background Collage"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Collage</span>
                  </button>

                  <button 
                    onClick={handleShareEpisode}
                    className="p-1.5 border border-slate-800 hover:border-emerald-500/50 bg-slate-950 hover:bg-emerald-500/10 rounded-lg text-slate-400 hover:text-emerald-300 transition-all cursor-pointer flex items-center space-x-1"
                    title="Share Podcast & Station Link"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span className="text-xs font-mono hidden sm:inline">Share</span>
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
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Official Protected Logo
                        </span>
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



      {/* 2.4 Share Broadcast Station & Episode Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl space-y-0">
            
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">Broadcast Station Link</h3>
                  <p className="text-xs text-slate-400 font-mono">Deep-link to this episode & continuous radio loop</p>
                </div>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              
              {/* Episode Preview Pill */}
              <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-2xl flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-bold shrink-0">
                  <Radio className="w-6 h-6 animate-pulse" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded">
                    {activeEpisode.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-100 truncate mt-0.5">{activeEpisode.title}</h4>
                  <p className="text-[11px] font-mono text-slate-400">{activeEpisode.duration} • 24/7 Sovereign Radio Loop</p>
                </div>
              </div>

              {/* Direct Share URL Box */}
              {(() => {
                const shareUrl = getEpisodeShareUrl(activeEpisode.id);
                const copyShareUrl = async () => {
                  try {
                    await navigator.clipboard.writeText(shareUrl);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2500);
                  } catch (e) {
                    console.error(e);
                  }
                };

                return (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-300 font-semibold flex items-center justify-between">
                        <span>Episode Deep Link</span>
                        {copiedLink && <span className="text-emerald-400">✓ Copied to clipboard!</span>}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={shareUrl}
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-300 select-all outline-none"
                        />
                        <button
                          onClick={copyShareUrl}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer shadow-md shadow-emerald-500/10"
                        >
                          {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Social Quick Share */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-400 font-semibold">Quick Share Channels</label>
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Tune into "${activeEpisode.title}" on the Broadcast Matrix:`)}&url=${encodeURIComponent(shareUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 flex items-center justify-center space-x-2 transition-all"
                        >
                          <span>𝕏 Post on Twitter</span>
                        </a>
                        <a
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 flex items-center justify-center space-x-2 transition-all"
                        >
                          <span>💼 Share on LinkedIn</span>
                        </a>
                      </div>
                    </div>
                  </>
                );
              })()}

            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/40 flex justify-end">
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-bold text-xs transition-all cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AppMediaHub;
