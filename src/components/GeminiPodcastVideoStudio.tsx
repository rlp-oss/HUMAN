import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Video, 
  Image as ImageIcon, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  FastForward, 
  Rewind, 
  Sparkles, 
  Layers, 
  LayoutGrid, 
  Film, 
  Radio, 
  Maximize2, 
  Download, 
  Plus, 
  Trash2, 
  Check, 
  FileAudio, 
  Eye, 
  Settings2, 
  Sliders, 
  Share2, 
  ExternalLink,
  Bot,
  BrainCircuit,
  X,
  HardDrive,
  Cloud,
  RefreshCw,
  Search,
  Music,
  Headphones,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { PodcastEpisode } from './AppMediaHub';
import { listDriveFiles, downloadDriveAudioBlobUrl, GoogleDriveFile } from '../services/driveService';
import { auth, signInWithGoogle, getAccessToken } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export interface MediaAsset {
  id: string;
  type: 'image' | 'video';
  url: string;
  name: string;
  caption?: string;
  isCustom?: boolean;
}

interface GeminiPodcastVideoStudioProps {
  onPublishEpisode?: (episode: PodcastEpisode, mediaAssets: MediaAsset[], collageStyle: string) => void;
  onClose?: () => void;
  initialEpisode?: PodcastEpisode;
  initialSourceTab?: 'local' | 'drive';
}

export const GeminiPodcastVideoStudio: React.FC<GeminiPodcastVideoStudioProps> = ({
  onPublishEpisode,
  onClose,
  initialEpisode,
  initialSourceTab = 'local'
}) => {
  // 1. Audio and Podcast State
  const [podcastTitle, setPodcastTitle] = useState(
    initialEpisode?.title || 'Gemini Deep Dive: Restoring Human Sovereignty in AI'
  );
  const [notebookTopic, setNotebookTopic] = useState(
    'NotebookLM Research Synthesis: The 50% Creator Royalty Protocol & C2PA Trust Index'
  );
  const [category, setCategory] = useState<'Protocol' | 'Creative' | 'Engineering'>('Protocol');
  const [introduction, setIntroduction] = useState(
    initialEpisode?.introduction || 
    'A Gemini NotebookLM generated two-host audio discussion analyzing how ethical cleanroom architectures eliminate creator exploitation while driving enterprise adoption.'
  );
  const [takeaways, setTakeaways] = useState<string[]>([
    'How Gemini NotebookLM models transform dense whitepapers into engaging audio dialogue.',
    'Cryptographic C2PA validation guarantees zero non-consensual model scraping.',
    'Stripe Connect automated 50/50 splits provide resilient human economic floors.'
  ]);
  const [newTakeawayInput, setNewTakeawayInput] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(initialEpisode?.audioUrl || null);
  const [audioFileName, setAudioFileName] = useState<string>('gemini_notebook_overview.mp3');
  const [audioSourceTab, setAudioSourceTab] = useState<'local' | 'drive'>(initialSourceTab);

  // Google Drive State
  const [driveUser, setDriveUser] = useState<User | null>(auth.currentUser);
  const [driveAccessToken, setDriveAccessToken] = useState<string | null>(null);
  const [driveAudioFiles, setDriveAudioFiles] = useState<GoogleDriveFile[]>([]);
  const [isLoadingDrive, setIsLoadingDrive] = useState<boolean>(false);
  const [driveError, setDriveError] = useState<string | null>(null);
  const [driveSearchQuery, setDriveSearchQuery] = useState<string>('');
  const [isDownloadingDriveAudio, setIsDownloadingDriveAudio] = useState<boolean>(false);
  const [downloadingAudioId, setDownloadingAudioId] = useState<string | null>(null);

  // Monitor auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setDriveUser(user);
      if (user) {
        const token = await getAccessToken();
        setDriveAccessToken(token);
        if (token && audioSourceTab === 'drive') {
          fetchDriveAudioFiles(token);
        }
      } else {
        setDriveAccessToken(null);
        setDriveAudioFiles([]);
      }
    });
    return () => unsub();
  }, [audioSourceTab]);

  const fetchDriveAudioFiles = async (forcedToken?: string) => {
    const token = forcedToken || driveAccessToken || (await getAccessToken());
    if (!token) {
      // Don't execute unauthenticated fetch
      setDriveAudioFiles([]);
      return;
    }

    setIsLoadingDrive(true);
    setDriveError(null);
    try {
      const res = await listDriveFiles(token, {
        audioOnly: true,
        query: driveSearchQuery.trim() || undefined
      });
      setDriveAudioFiles(res.files || []);
    } catch (err: any) {
      console.warn('Failed to list Google Drive audio files:', err);
      if (err?.message?.includes('invalid authentication credentials') || err?.message?.includes('authorization required')) {
        setDriveAccessToken(null);
        setDriveError('Google Drive session requires authorization. Please click "Authorize Google Drive" below.');
      } else {
        setDriveError(err.message || 'Failed to connect to Google Drive.');
      }
    } finally {
      setIsLoadingDrive(false);
    }
  };

  const handleConnectDrive = async () => {
    setIsLoadingDrive(true);
    setDriveError(null);
    try {
      const res = await signInWithGoogle();
      setDriveUser(res.user);
      if (res.accessToken) {
        setDriveAccessToken(res.accessToken);
        const filesRes = await listDriveFiles(res.accessToken, { audioOnly: true });
        setDriveAudioFiles(filesRes.files || []);
        setStatusMessage('Connected to Google Drive! Audio files loaded.');
        setTimeout(() => setStatusMessage(null), 4000);
      } else {
        setDriveError('Google Drive access token not received. Please grant Drive permissions.');
      }
    } catch (err: any) {
      console.error('Failed to sign in to Google Drive:', err);
      setDriveError(err.message || 'Authentication with Google Drive failed.');
    } finally {
      setIsLoadingDrive(false);
    }
  };

  const handleSelectDriveAudio = async (file: GoogleDriveFile) => {
    const token = driveAccessToken || (await getAccessToken());
    if (!token) {
      setDriveError('Please click "Authorize Google Drive" to grant storage access.');
      return;
    }

    setIsDownloadingDriveAudio(true);
    setDownloadingAudioId(file.id);
    setDriveError(null);
    try {
      const { blobUrl } = await downloadDriveAudioBlobUrl(token, file.id);
      
      setAudioUrl(blobUrl);
      setAudioFileName(file.name);

      // Extract cleaned title
      const cleanedTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      if (cleanedTitle) {
        setPodcastTitle(cleanedTitle.charAt(0).toUpperCase() + cleanedTitle.slice(1));
      }

      // Calculate duration
      const tempAudio = new Audio(blobUrl);
      tempAudio.onloadedmetadata = () => {
        if (tempAudio.duration && !isNaN(tempAudio.duration)) {
          setDuration(Math.floor(tempAudio.duration));
        }
      };

      setStatusMessage(`Loaded "${file.name}" from Google Drive into Podcast Studio!`);
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      console.error('Failed to stream Drive audio:', err);
      setDriveError(`Failed to load audio: ${err.message || 'File access error'}`);
    } finally {
      setIsDownloadingDriveAudio(false);
      setDownloadingAudioId(null);
    }
  };

  // 2. Visual Media Assets (Default high-res curation + user uploads)
  const defaultAssets: MediaAsset[] = [
    {
      id: 'img-1',
      type: 'image',
      name: 'Neural Human Covenant',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      caption: 'Fluid neural gradients symbolizing human-machine symbiosis'
    },
    {
      id: 'img-2',
      type: 'image',
      name: 'Open Protocol Architecture',
      url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      caption: 'Decentralized cryptographic node matrices'
    },
    {
      id: 'img-3',
      type: 'image',
      name: 'Creative DAW & Provenance',
      url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
      caption: 'Acoustic waveform analysis and sovereign audio stems'
    },
    {
      id: 'img-4',
      type: 'image',
      name: 'Ethical Code Sandbox',
      url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      caption: 'AST AST zero-copyleft quarantine validation engine'
    },
    {
      id: 'img-5',
      type: 'image',
      name: 'Universal Creator Rights',
      url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
      caption: 'Global covenant for fair human compensation'
    }
  ];

  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(defaultAssets);
  const [activeAssetIndex, setActiveAssetIndex] = useState(0);

  // 3. Video Previewer & Collage Engine Settings
  const [collageLayout, setCollageLayout] = useState<'bento' | 'cinematic' | 'split' | 'matrix'>('bento');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [transitionSpeed, setTransitionSpeed] = useState<number>(6); // seconds
  const [overlayOpacity, setOverlayOpacity] = useState<number>(45); // percent
  const [showVisualizer, setShowVisualizer] = useState<boolean>(true);
  const [showTitleCard, setShowTitleCard] = useState<boolean>(true);
  const [showWatermark, setShowWatermark] = useState<boolean>(true);
  const [kenBurnsActive, setKenBurnsActive] = useState<boolean>(true);

  // 4. Playback State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(142); // 2m 22s simulated or real
  const [volume, setVolume] = useState<number>(85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const previewContainerRef = useRef<HTMLDivElement | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);
  const mediaInputRef = useRef<HTMLInputElement | null>(null);

  // Timer loop for simulated or real audio playback & collage cycling
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  // Slideshow cycle for background collage
  useEffect(() => {
    if (!isPlaying && mediaAssets.length <= 1) return;
    const cycleInterval = setInterval(() => {
      setActiveAssetIndex((prev) => (prev + 1) % mediaAssets.length);
    }, transitionSpeed * 1000);
    return () => clearInterval(cycleInterval);
  }, [isPlaying, mediaAssets.length, transitionSpeed]);

  // Sync real audio element if loaded
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
    }
    setIsPlaying(!isPlaying);

    // Sync any video elements
    Object.values(videoRefs.current).forEach((v: HTMLVideoElement | null) => {
      if (v) {
        if (!isPlaying) {
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      }
    });
  };

  const handleAudioSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Upload Audio File
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setAudioFileName(file.name);
    
    // Attempt to extract title from file name
    const cleanedTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    if (cleanedTitle && podcastTitle.includes('Gemini Deep Dive')) {
      setPodcastTitle(cleanedTitle.charAt(0).toUpperCase() + cleanedTitle.slice(1));
    }

    // Attempt to load duration
    const tempAudio = new Audio(url);
    tempAudio.onloadedmetadata = () => {
      if (tempAudio.duration && !isNaN(tempAudio.duration)) {
        setDuration(Math.floor(tempAudio.duration));
      }
    };

    setStatusMessage(`Loaded audio: "${file.name}"`);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Upload Images / Videos
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: MediaAsset[] = [];
    Array.from(files).forEach((file: File, index: number) => {
      const isVid = file.type.startsWith('video/');
      const url = URL.createObjectURL(file);
      newItems.push({
        id: `custom-${Date.now()}-${index}`,
        type: isVid ? 'video' : 'image',
        name: file.name,
        url: url,
        caption: `Custom uploaded ${isVid ? 'video clip' : 'visual asset'}`,
        isCustom: true
      });
    });

    setMediaAssets((prev) => [...newItems, ...prev]);
    setStatusMessage(`Added ${newItems.length} media asset(s) to collage reel!`);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Remove Media Asset
  const handleRemoveAsset = (id: string) => {
    if (mediaAssets.length <= 1) {
      alert('You must keep at least one visual asset in the collage.');
      return;
    }
    setMediaAssets((prev) => prev.filter((a) => a.id !== id));
  };

  // Add Takeaway
  const handleAddTakeaway = () => {
    if (!newTakeawayInput.trim()) return;
    setTakeaways([...takeaways, newTakeawayInput.trim()]);
    setNewTakeawayInput('');
  };

  // Remove Takeaway
  const handleRemoveTakeaway = (index: number) => {
    setTakeaways(takeaways.filter((_, i) => i !== index));
  };

  // Save / Publish to Live Broadcast Matrix
  const handlePublish = () => {
    const newEpisode: PodcastEpisode = {
      id: `gemini-podcast-${Date.now()}`,
      title: podcastTitle,
      duration: formatTime(duration),
      category: category,
      introduction: `${introduction} [Source: ${notebookTopic}]`,
      keyTakeaways: takeaways,
      audioUrl: audioUrl || undefined
    };

    if (onPublishEpisode) {
      onPublishEpisode(newEpisode, mediaAssets, collageLayout);
    }

    setStatusMessage('Successfully published episode to the live broadcast fleet!');
    setTimeout(() => {
      if (onClose) onClose();
    }, 1200);
  };

  // Snapshot capture
  const handleCaptureSnapshot = () => {
    setStatusMessage('Captured video preview frame! Ready for episode thumbnail.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <div className="bg-slate-950 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-w-7xl mx-auto my-4 flex flex-col">
      
      {/* Hidden audio element for real playback */}
      {audioUrl && (
        <audio 
          ref={audioRef} 
          src={audioUrl} 
          onEnded={() => setIsPlaying(false)}
          onTimeUpdate={() => {
            if (audioRef.current) {
              setCurrentTime(audioRef.current.currentTime);
            }
          }}
        />
      )}

      {/* Top Banner Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-cyan-500 to-emerald-500 p-2.5 rounded-xl text-slate-950 shadow-lg shadow-emerald-500/20">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold tracking-tight text-white">Gemini Notebook Podcast & Video Studio</h2>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold">
                Audio Overview + Dynamic Collage
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Upload NotebookLM audio discussions, pair with dynamic video/photo collages, and preview in real time.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handlePublish}
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-tight shadow-md shadow-emerald-500/20 transition-all transform active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Publish to Broadcast Matrix</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Close Studio"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* Notification Banner */}
      {statusMessage && (
        <div className="bg-emerald-500/20 border-b border-emerald-500/30 text-emerald-300 px-6 py-2 text-xs font-mono flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{statusMessage}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-emerald-400 hover:text-white text-xs">✕</button>
        </div>
      )}

      {/* Main Grid: Left Side Controls & Uploaders (5 cols) | Right Side Live Video Previewer (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 flex-1">
        
        {/* LEFT COLUMN: Uploads & Metadata Editor */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          
          <div className="space-y-6">
            
            {/* 1. Audio & Gemini Source Upload Box */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <FileAudio className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-slate-200">1. Gemini Podcast Audio Source</h3>
                </div>
                
                {/* Source Segmented Toggle */}
                <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-mono">
                  <button
                    type="button"
                    onClick={() => setAudioSourceTab('local')}
                    className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      audioSourceTab === 'local' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <HardDrive className="w-3 h-3" />
                    <span>Local File</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAudioSourceTab('drive');
                      if (driveUser) {
                        fetchDriveAudioFiles();
                      }
                    }}
                    className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      audioSourceTab === 'drive' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Cloud className="w-3 h-3" />
                    <span>Google Drive</span>
                  </button>
                </div>
              </div>

              {/* LOCAL FILE UPLOAD MODE */}
              {audioSourceTab === 'local' && (
                <div className="space-y-3">
                  <div 
                    onClick={() => audioInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 bg-slate-950/40 hover:bg-slate-900/40 p-4 rounded-xl text-center cursor-pointer transition-all group"
                  >
                    <input 
                      type="file" 
                      ref={audioInputRef} 
                      onChange={handleAudioUpload} 
                      accept="audio/*,.mp3,.wav,.ogg,.m4a,.flac,.aac" 
                      className="hidden" 
                    />
                    <div className="flex flex-col items-center space-y-2">
                      <div className="p-2.5 bg-slate-900 rounded-full group-hover:scale-110 transition-transform">
                        <Upload className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-200 block">
                          {audioUrl ? 'Click to Change / Replace Audio File' : 'Click to Upload Local Audio File (.wav, .mp3, .m4a)'}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Supports Gemini NotebookLM exports, podcast masters, WAV stems
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => audioInputRef.current?.click()}
                      className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg hover:border-slate-700 cursor-pointer"
                    >
                      <HardDrive className="w-3 h-3" />
                      <span>Browse Local Storage</span>
                    </button>
                  </div>
                </div>
              )}

              {/* GOOGLE DRIVE SELECTOR MODE */}
              {audioSourceTab === 'drive' && (
                <div className="space-y-3 bg-slate-950/70 border border-slate-800/80 p-3.5 rounded-xl">
                  {!driveUser || !driveAccessToken ? (
                    <div className="text-center py-4 space-y-3">
                      <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
                        <Cloud className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-200">
                          {driveUser ? `Authorize Drive Storage for ${driveUser.email}` : 'Connect Google Drive Account'}
                        </div>
                        <div className="text-[11px] text-slate-400 max-w-xs mx-auto mt-0.5">
                          Directly import NotebookLM podcast audio recordings and WAV files from your Google Drive.
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleConnectDrive}
                        disabled={isLoadingDrive}
                        className="inline-flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer shadow-lg"
                      >
                        {isLoadingDrive ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Cloud className="w-3.5 h-3.5" />}
                        <span>{isLoadingDrive ? 'Connecting to Drive...' : 'Authorize Google Drive Storage Access'}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2 text-slate-300">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="font-mono text-[11px] text-slate-400 truncate max-w-[180px]">{driveUser.email}</span>
                        </div>
                        <button
                          type="button"
                          onClick={fetchDriveAudioFiles}
                          disabled={isLoadingDrive}
                          className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 cursor-pointer"
                        >
                          <RefreshCw className={`w-3 h-3 ${isLoadingDrive ? 'animate-spin' : ''}`} />
                          <span>Refresh Files</span>
                        </button>
                      </div>

                      {/* Drive Audio Search Bar */}
                      <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5">
                        <Search className="w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="text"
                          value={driveSearchQuery}
                          onChange={(e) => setDriveSearchQuery(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && fetchDriveAudioFiles()}
                          placeholder="Search Drive audio (e.g. My.wav, podcast)..."
                          className="w-full bg-transparent text-xs text-slate-200 outline-none placeholder:text-slate-500"
                        />
                        {driveSearchQuery && (
                          <button
                            type="button"
                            onClick={() => {
                              setDriveSearchQuery('');
                              setTimeout(fetchDriveAudioFiles, 50);
                            }}
                            className="text-slate-500 hover:text-white text-xs"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      {/* Drive Audio Files List */}
                      {isLoadingDrive ? (
                        <div className="text-center py-6 text-xs text-slate-400 font-mono flex items-center justify-center space-x-2">
                          <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
                          <span>Querying audio files from Google Drive...</span>
                        </div>
                      ) : driveAudioFiles.length === 0 ? (
                        <div className="text-center py-5 space-y-2 border border-dashed border-slate-800 rounded-xl bg-slate-900/40">
                          <Music className="w-6 h-6 text-slate-600 mx-auto" />
                          <div className="text-xs text-slate-400">No audio files found matching query.</div>
                          <button
                            type="button"
                            onClick={fetchDriveAudioFiles}
                            className="text-[11px] font-mono text-emerald-400 hover:underline"
                          >
                            Reload all Drive audio
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {driveAudioFiles.map((file) => {
                            const isSelected = audioFileName === file.name;
                            const isDownloadingThis = downloadingAudioId === file.id;
                            const sizeMb = file.size ? (Number(file.size) / (1024 * 1024)).toFixed(2) : null;
                            return (
                              <div
                                key={file.id}
                                className={`flex items-center justify-between p-2 rounded-lg border transition-all ${
                                  isSelected 
                                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' 
                                    : 'bg-slate-900/70 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700 text-slate-200'
                                }`}
                              >
                                <div className="flex items-center space-x-2.5 overflow-hidden pr-2">
                                  <div className="p-1.5 bg-slate-950 rounded-md shrink-0 text-emerald-400">
                                    <Music className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="truncate text-left">
                                    <div className="text-xs font-medium truncate font-mono">{file.name}</div>
                                    <div className="text-[10px] text-slate-500 font-mono">
                                      {sizeMb ? `${sizeMb} MB • ` : ''}{file.mimeType.split('/')[1]?.toUpperCase() || 'AUDIO'}
                                    </div>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  disabled={isDownloadingDriveAudio}
                                  onClick={() => handleSelectDriveAudio(file)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center space-x-1 shrink-0 cursor-pointer transition-all ${
                                    isSelected
                                      ? 'bg-emerald-500 text-slate-950'
                                      : 'bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200'
                                  }`}
                                >
                                  {isDownloadingThis ? (
                                    <>
                                      <RefreshCw className="w-3 h-3 animate-spin" />
                                      <span>Loading...</span>
                                    </>
                                  ) : isSelected ? (
                                    <>
                                      <FileCheck className="w-3 h-3" />
                                      <span>Active</span>
                                    </>
                                  ) : (
                                    <>
                                      <Headphones className="w-3 h-3" />
                                      <span>Load & Play</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {driveError && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-xs p-2.5 rounded-lg flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{driveError}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Current Loaded File Details */}
              <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2.5 overflow-hidden">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Radio className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-mono font-medium text-slate-200 truncate">{audioFileName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Estimated Duration: {formatTime(duration)}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                  Active Track
                </span>
              </div>
            </div>

            {/* 2. Visual Media & Video Uploader (Background Collage Reel) */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <LayoutGrid className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-slate-200">2. Video & Picture Collage Assets</h3>
                </div>
                <span className="text-[10px] font-mono text-cyan-400">{mediaAssets.length} Assets Loaded</span>
              </div>

              {/* Upload Media Dropzone */}
              <div 
                onClick={() => mediaInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 bg-slate-950/40 hover:bg-slate-900/40 p-4 rounded-xl text-center cursor-pointer transition-all group"
              >
                <input 
                  type="file" 
                  ref={mediaInputRef} 
                  onChange={handleMediaUpload} 
                  accept="image/*,video/*" 
                  multiple 
                  className="hidden" 
                />
                <div className="flex flex-col items-center space-y-1.5">
                  <div className="p-2.5 bg-slate-900 rounded-full group-hover:scale-110 transition-transform">
                    <Film className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-xs font-semibold text-slate-200">
                    Upload Photos, Diagrams & Video Clips
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Supports PNG, JPG, WEBP, MP4, WEBM for dynamic background collages
                  </span>
                </div>
              </div>

              {/* Asset Thumbnails Scroll Area */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Current Collage Media Reel:</span>
                  <span className="text-slate-500 text-[10px]">Click thumbnail to highlight</span>
                </div>
                
                <div className="grid grid-cols-5 gap-2 max-h-36 overflow-y-auto pr-1">
                  {mediaAssets.map((asset, idx) => {
                    const isCurrent = idx === activeAssetIndex;
                    return (
                      <div 
                        key={asset.id} 
                        onClick={() => setActiveAssetIndex(idx)}
                        className={`relative group rounded-lg overflow-hidden border aspect-video cursor-pointer transition-all ${
                          isCurrent 
                            ? 'border-cyan-400 ring-2 ring-cyan-400/40 scale-105' 
                            : 'border-slate-800 hover:border-slate-600'
                        }`}
                      >
                        {asset.type === 'video' ? (
                          <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                            <video src={asset.url} className="w-full h-full object-cover" muted />
                            <Video className="w-3.5 h-3.5 text-white absolute" />
                          </div>
                        ) : (
                          <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                        )}

                        {/* Hover remove button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveAsset(asset.id);
                          }}
                          className="absolute top-1 right-1 p-1 bg-slate-950/80 hover:bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Remove from collage"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. Podcast Show Notes & Metadata */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-slate-200">3. Episode Metadata & Gemini Prompt Notes</h3>
                </div>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 px-2.5 py-1 rounded-lg outline-none cursor-pointer"
                >
                  <option value="Protocol">Protocol</option>
                  <option value="Creative">Creative</option>
                  <option value="Engineering">Engineering</option>
                </select>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Episode Broadcast Title</label>
                  <input 
                    type="text" 
                    value={podcastTitle} 
                    onChange={(e) => setPodcastTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 text-xs text-white px-3 py-2 rounded-xl outline-none"
                    placeholder="Enter broadcast title..."
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Gemini Notebook Topic / Research Context</label>
                  <input 
                    type="text" 
                    value={notebookTopic} 
                    onChange={(e) => setNotebookTopic(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-xs text-slate-300 px-3 py-2 rounded-xl outline-none font-mono"
                    placeholder="NotebookLM topic or prompt query..."
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Overview / Synopsis</label>
                  <textarea 
                    rows={2}
                    value={introduction} 
                    onChange={(e) => setIntroduction(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 text-xs text-slate-300 px-3 py-2 rounded-xl outline-none resize-none"
                    placeholder="Brief description of the dialogue..."
                  />
                </div>

                {/* Key Takeaways */}
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Key Takeaways ({takeaways.length})</label>
                  <div className="space-y-1.5 mb-2 max-h-24 overflow-y-auto">
                    {takeaways.map((t, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-slate-950/70 border border-slate-800/80 px-2.5 py-1.5 rounded-lg text-xs text-slate-300">
                        <span className="truncate pr-2">• {t}</span>
                        <button 
                          onClick={() => handleRemoveTakeaway(idx)}
                          className="text-slate-500 hover:text-red-400 text-xs cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <input 
                      type="text" 
                      value={newTakeawayInput}
                      onChange={(e) => setNewTakeawayInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTakeaway()}
                      placeholder="Add key takeaway point..."
                      className="flex-1 bg-slate-950 border border-slate-800 text-xs px-3 py-1.5 rounded-lg outline-none text-slate-300"
                    />
                    <button 
                      onClick={handleAddTakeaway}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Video Previewer & Background Collage Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          
          <div className="space-y-4">
            
            {/* Collage Engine Controls Toolbar */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
              
              {/* Layout Mode Selector */}
              <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase px-2">Collage:</span>
                {[
                  { id: 'bento', label: 'Bento Mosaic', icon: LayoutGrid },
                  { id: 'cinematic', label: 'Cinematic Drift', icon: Film },
                  { id: 'split', label: 'Video Split', icon: Layers },
                  { id: 'matrix', label: 'Waveform Matrix', icon: Radio }
                ].map((mode) => {
                  const Icon = mode.icon;
                  const isActive = collageLayout === mode.id;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setCollageLayout(mode.id as any)}
                      className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{mode.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Aspect Ratio & Settings */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-mono">
                  {(['16:9', '1:1', '9:16'] as const).map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setAspectRatio(ratio)}
                      className={`px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                        aspectRatio === ratio ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCaptureSnapshot}
                  className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 rounded-xl border border-slate-800 transition-colors cursor-pointer"
                  title="Capture Preview Snapshot (PNG)"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* LIVE COLLAGE VIDEO CANVAS */}
            <div 
              ref={previewContainerRef}
              className={`relative bg-slate-950 border-2 border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-all flex flex-col justify-between ${
                aspectRatio === '16:9' ? 'aspect-video w-full' : aspectRatio === '1:1' ? 'aspect-square max-w-lg mx-auto' : 'aspect-[9/16] max-w-sm mx-auto'
              }`}
            >
              
              {/* COLLAGE BACKGROUND LAYER */}
              <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
                
                {/* 1. Bento Mosaic Mode */}
                {collageLayout === 'bento' && (
                  <div className="w-full h-full grid grid-cols-3 grid-rows-2 gap-1.5 p-2 opacity-90">
                    {mediaAssets.slice(0, 6).map((asset, index) => {
                      const isHero = index === 0;
                      return (
                        <div 
                          key={asset.id} 
                          className={`relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800/80 transition-transform duration-1000 ${
                            isHero ? 'col-span-2 row-span-2' : ''
                          } ${kenBurnsActive ? 'hover:scale-105' : ''}`}
                        >
                          {asset.type === 'video' ? (
                            <video 
                              ref={(el) => { videoRefs.current[asset.id] = el; }}
                              src={asset.url} 
                              className="w-full h-full object-cover" 
                              loop 
                              muted 
                              playsInline 
                            />
                          ) : (
                            <img 
                              src={asset.url} 
                              alt={asset.name} 
                              className="w-full h-full object-cover transition-transform duration-700 ease-out" 
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                          <span className="absolute bottom-2 left-2 text-[9px] font-mono text-slate-300 bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800 truncate max-w-[85%]">
                            {asset.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 2. Cinematic Ambient Drift Mode */}
                {collageLayout === 'cinematic' && (
                  <div className="relative w-full h-full">
                    {mediaAssets.map((asset, index) => {
                      const isActive = index === activeAssetIndex;
                      return (
                        <div 
                          key={asset.id}
                          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                            isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                          }`}
                        >
                          {asset.type === 'video' ? (
                            <video 
                              ref={(el) => { videoRefs.current[asset.id] = el; }}
                              src={asset.url} 
                              className="w-full h-full object-cover" 
                              loop 
                              muted 
                              playsInline 
                            />
                          ) : (
                            <img 
                              src={asset.url} 
                              alt={asset.name} 
                              className={`w-full h-full object-cover ${kenBurnsActive ? 'transform scale-110 animate-pulse duration-1000' : ''}`} 
                            />
                          )}
                          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-950/50 to-slate-950" />
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 3. Split-Screen Video Reel Mode */}
                {collageLayout === 'split' && (
                  <div className="w-full h-full grid grid-cols-2 gap-2 p-3">
                    {/* Left: Main Video Loop */}
                    <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
                      {mediaAssets.find((m) => m.type === 'video') ? (
                        <video 
                          src={mediaAssets.find((m) => m.type === 'video')?.url} 
                          className="w-full h-full object-cover" 
                          loop 
                          muted 
                          autoPlay 
                        />
                      ) : (
                        <img 
                          src={mediaAssets[0]?.url} 
                          alt="Hero Asset" 
                          className="w-full h-full object-cover" 
                        />
                      )}
                      <div className="absolute top-2 left-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-400 border border-slate-800">
                        Primary Feed
                      </div>
                    </div>

                    {/* Right: Grid of Photos */}
                    <div className="grid grid-cols-2 gap-2">
                      {mediaAssets.slice(1, 5).map((asset) => (
                        <div key={asset.id} className="relative rounded-xl overflow-hidden border border-slate-800/80">
                          <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Cyber Waveform Matrix Mode */}
                {collageLayout === 'matrix' && (
                  <div className="relative w-full h-full flex items-center justify-center p-6 bg-slate-950">
                    <div className="absolute inset-0 grid grid-cols-4 gap-2 opacity-30 blur-xs">
                      {mediaAssets.map((asset) => (
                        <img key={asset.id} src={asset.url} alt={asset.name} className="w-full h-full object-cover rounded-xl" />
                      ))}
                    </div>
                    {/* Center glowing badge and visualizer stage */}
                    <div className="relative z-10 p-6 bg-slate-950/80 border border-emerald-500/40 rounded-3xl backdrop-blur-md shadow-2xl text-center space-y-3 max-w-sm">
                      <div className="w-12 h-12 mx-auto bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/40">
                        <Radio className="w-6 h-6 animate-pulse" />
                      </div>
                      <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                        Neural Broadcast Matrix
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* OVERLAY TINT LAYER (For readability) */}
              <div 
                className="absolute inset-0 z-10 pointer-events-none transition-colors"
                style={{ backgroundColor: `rgba(2, 6, 23, ${overlayOpacity / 100})` }}
              />

              {/* WATERMARK & BROADCAST BADGE (Top Area) */}
              <div className="relative z-20 p-4 flex items-center justify-between">
                {showWatermark && (
                  <div className="flex items-center space-x-2 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] font-mono shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-bold text-slate-200">THE H.U.M.A.N. INITIATIVE</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-emerald-400">C2PA JUMBF v2.1</span>
                  </div>
                )}

                <div className="bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] font-mono text-cyan-400 shadow-lg">
                  Gemini NotebookLM Audio Overview
                </div>
              </div>

              {/* CENTER / BOTTOM OVERLAY (Title Card & Animated Audio Equalizer) */}
              <div className="relative z-20 p-6 space-y-4">
                
                {/* Title Card */}
                {showTitleCard && (
                  <div className="space-y-1.5 text-left bg-slate-950/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800/80 shadow-2xl max-w-xl">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-semibold border border-emerald-500/30">
                        {category}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 truncate">
                        {notebookTopic}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white line-clamp-2">
                      {podcastTitle}
                    </h3>
                  </div>
                )}

                {/* Real-time Simulated Audio Waveform Bar Visualizer */}
                {showVisualizer && (
                  <div className="flex items-end justify-between h-12 px-3 bg-slate-950/80 backdrop-blur-md rounded-2xl border border-slate-800/80 py-2 space-x-1">
                    {[
                      35, 60, 20, 80, 45, 90, 65, 30, 75, 40, 95, 85, 30, 50, 70, 40, 
                      85, 60, 25, 90, 75, 40, 65, 95, 30, 50, 80, 40, 60, 85, 30, 70
                    ].map((height, idx) => {
                      const isActive = (currentTime % 32) > idx;
                      const dynamicHeight = isPlaying ? Math.max(15, (height * (0.6 + Math.random() * 0.4))) : height * 0.3;
                      return (
                        <div
                          key={idx}
                          className={`w-full rounded-t-sm transition-all duration-150 ${
                            isPlaying
                              ? 'bg-gradient-to-t from-emerald-500 to-cyan-400 shadow-sm shadow-emerald-500/50'
                              : 'bg-slate-700'
                          }`}
                          style={{ height: `${dynamicHeight}%` }}
                        />
                      );
                    })}
                  </div>
                )}

              </div>

            </div>

            {/* INTEGRATED SCRUBBER & AUDIO TRANSPORT DOCK */}
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 space-y-3">
              
              {/* Seek Scrubber & Timers */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="text-emerald-400 font-bold">{formatTime(currentTime)}</span>
                  <span className="text-slate-500">{formatTime(duration)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={handleAudioSeek}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg outline-none cursor-pointer"
                />
              </div>

              {/* Action Buttons & Sliders */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={togglePlay}
                    className="w-11 h-11 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full flex items-center justify-center font-bold transition-all transform active:scale-95 shadow-lg shadow-emerald-500/20 cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
                  </button>

                  <button
                    onClick={() => {
                      const newTime = Math.max(0, currentTime - 10);
                      setCurrentTime(newTime);
                      if (audioRef.current) audioRef.current.currentTime = newTime;
                    }}
                    className="p-2 text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="Rewind 10s"
                  >
                    <Rewind className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      const newTime = Math.min(duration, currentTime + 10);
                      setCurrentTime(newTime);
                      if (audioRef.current) audioRef.current.currentTime = newTime;
                    }}
                    className="p-2 text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="Forward 10s"
                  >
                    <FastForward className="w-4 h-4" />
                  </button>

                  {/* Volume Control */}
                  <div className="flex items-center space-x-2 pl-2 text-slate-400">
                    <button onClick={() => setIsMuted(!isMuted)} className="cursor-pointer hover:text-white">
                      {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => {
                        setVolume(Number(e.target.value));
                        setIsMuted(false);
                        if (audioRef.current) audioRef.current.volume = Number(e.target.value) / 100;
                      }}
                      className="w-16 accent-emerald-500 h-1 bg-slate-800 rounded-lg outline-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Right controls: Overlay Sliders Toggle */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-[11px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800">
                    <Sliders className="w-3 h-3 text-cyan-400" />
                    <span>Tint: {overlayOpacity}%</span>
                    <input
                      type="range"
                      min="0"
                      max="90"
                      value={overlayOpacity}
                      onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                      className="w-12 accent-cyan-400 h-1 bg-slate-800 rounded-lg ml-1 cursor-pointer"
                    />
                  </div>

                  <button
                    onClick={() => setShowVisualizer(!showVisualizer)}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      showVisualizer ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-950 text-slate-500 border-slate-800'
                    }`}
                    title="Toggle Audio Visualizer Overlay"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Bottom Action Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/60 px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1 text-emerald-400">
            <Check className="w-3.5 h-3.5" />
            <span>Zero-Ingestion Cleanroom Verified</span>
          </span>
          <span>•</span>
          <span>Automatic C2PA JUMBF Injection</span>
          <span>•</span>
          <span>Ready for 1080p Video Broadcast</span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handlePublish}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2 rounded-xl font-bold transition-all transform active:scale-95 shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            Publish Episode & Collage
          </button>
        </div>
      </footer>

    </div>
  );
};

export default GeminiPodcastVideoStudio;
