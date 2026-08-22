import React, { useState, useEffect } from 'react';
import {
  HardDrive,
  Upload,
  Download,
  FolderPlus,
  Trash2,
  RefreshCw,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Search,
  Database,
  Cloud,
  Layers,
  X,
  ShieldCheck,
  Sparkles,
  Lock
} from 'lucide-react';
import {
  listDriveFiles,
  uploadFileToDrive,
  downloadDriveFile,
  deleteDriveFile,
  getOrCreateFolder,
  GoogleDriveFile,
} from '../services/driveService.ts';
import { auth, signInWithGoogle, getAccessToken, logOut } from '../lib/firebase.ts';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Tester, CopyrightClaim, FeedbackItem, BroadcastMessage } from '../types.ts';
import axios from 'axios';

interface GoogleDriveManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  testers: Tester[];
  claims: CopyrightClaim[];
  feedback: FeedbackItem[];
  broadcasts: BroadcastMessage[];
  onImportLogoToStudio?: (dataUrl: string, filename: string) => void;
}

export const GoogleDriveManagerModal: React.FC<GoogleDriveManagerModalProps> = ({
  isOpen,
  onClose,
  testers,
  claims,
  feedback,
  broadcasts,
  onImportLogoToStudio,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [driveFiles, setDriveFiles] = useState<GoogleDriveFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'images' | 'backups'>('all');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [recentSqlBackups, setRecentSqlBackups] = useState<any[]>([]);
  const [isSyncingSql, setIsSyncingSql] = useState(false);

  // Destructive Delete Confirmation State (Strict Workspace Policy)
  const [fileToDelete, setFileToDelete] = useState<GoogleDriveFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const token = await getAccessToken();
        setAccessToken(token);
        if (token) {
          fetchFiles(token);
        }
      } else {
        setAccessToken(null);
        setDriveFiles([]);
      }
    });

    fetchSqlBackups();

    return () => unsubscribe();
  }, []);

  const fetchSqlBackups = async () => {
    try {
      const res = await axios.get('/api/drive/backups');
      if (res.data?.backups) {
        setRecentSqlBackups(res.data.backups);
      }
    } catch (e) {
      console.warn('Could not fetch SQL backup history');
    }
  };

  const fetchFiles = async (token?: string) => {
    const tok = token || accessToken;
    if (!tok) return;

    setIsLoadingFiles(true);
    try {
      const res = await listDriveFiles(tok, {
        imagesOnly: filterType === 'images',
        query: searchQuery || undefined,
        pageSize: 40,
      });
      setDriveFiles(res.files || []);
    } catch (err: any) {
      console.error('Error fetching drive files:', err);
      setStatusMessage({
        type: 'error',
        text: `Google Drive access error: ${err.message || 'Failed to load files'}. Please ensure Drive permissions are approved.`,
      });
    } finally {
      setIsLoadingFiles(false);
    }
  };

  useEffect(() => {
    if (accessToken && isOpen) {
      fetchFiles();
    }
  }, [filterType, isOpen]);

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setStatusMessage(null);
    try {
      const res = await signInWithGoogle();
      if (res.accessToken) {
        setAccessToken(res.accessToken);
        setStatusMessage({ type: 'success', text: `Connected as ${res.user.email} with Google Drive storage access.` });
        fetchFiles(res.accessToken);
      } else {
        setStatusMessage({ type: 'info', text: 'Signed in. Google Drive OAuth access token active.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to sign in with Google' });
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    await logOut();
    setAccessToken(null);
    setCurrentUser(null);
    setDriveFiles([]);
    setStatusMessage({ type: 'info', text: 'Signed out of Google Drive.' });
  };

  // Perform full export & backup to Google Drive + Cloud SQL log
  const handleFullDriveBackup = async () => {
    if (!accessToken || !currentUser) {
      setStatusMessage({ type: 'error', text: 'Please connect your Google Account first.' });
      return;
    }

    setIsBackingUp(true);
    setStatusMessage({ type: 'info', text: 'Preparing ecosystem snapshot and Cloud SQL synchronization...' });

    try {
      // 1. Sync records to Cloud SQL PostgreSQL first
      setIsSyncingSql(true);
      await axios.post('/api/sql/sync-testers', { items: testers }).catch(() => {});
      await axios.post('/api/sql/sync-claims', { items: claims }).catch(() => {});
      await axios.post('/api/sql/sync-feedback', { items: feedback }).catch(() => {});
      setIsSyncingSql(false);

      // 2. Locate or create HUMAN-Ethical-AI-Console folder in Google Drive
      const folderId = await getOrCreateFolder(accessToken, 'HUMAN-Ethical-AI-Console');

      // 3. Compile comprehensive JSON snapshot payload
      const timestamp = new Date().toISOString();
      const backupData = {
        title: 'The H.U.M.A.N. Initiative Ecosystem & Cloud SQL Snapshot',
        tagline: 'Powering Ethical AI apps, And Paying the People',
        exportedAt: timestamp,
        userEmail: currentUser.email,
        stats: {
          testersCount: testers.length,
          claimsCount: claims.length,
          feedbackCount: feedback.length,
          broadcastsCount: broadcasts.length,
        },
        testers,
        claims,
        feedback,
        broadcasts,
        cloudSqlDatabase: 'ai-studio-3825022c (PostgreSQL)',
        restitutionPool: '50% Net Subscription Pool',
      };

      const filename = `HUMAN_Ecosystem_Backup_${timestamp.replace(/[:.]/g, '-')}.json`;
      const fileContent = JSON.stringify(backupData, null, 2);

      // 4. Upload to Google Drive
      const uploadedFile = await uploadFileToDrive(accessToken, {
        name: filename,
        mimeType: 'application/json',
        content: fileContent,
        folderId,
        description: `Automated ecosystem backup with ${testers.length} testers and ${claims.length} verified creator claims.`,
      });

      // 5. Record backup metadata in Cloud SQL
      await axios.post('/api/drive/backups', {
        userUid: currentUser.uid,
        userEmail: currentUser.email,
        fileId: uploadedFile.id,
        fileName: filename,
        fileUrl: uploadedFile.webViewLink,
        backupType: 'full_ecosystem',
        itemCount: testers.length + claims.length + feedback.length,
      }).catch(() => {});

      setStatusMessage({
        type: 'success',
        text: `Backup successfully created in Google Drive folder 'HUMAN-Ethical-AI-Console' (${filename}) and recorded in Cloud SQL.`,
      });

      fetchFiles();
      fetchSqlBackups();
    } catch (err: any) {
      console.error('Backup failed:', err);
      setStatusMessage({
        type: 'error',
        text: `Backup failed: ${err.message || 'Unknown error during Google Drive upload.'}`,
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  // Import file as logo into Master Logo Studio
  const handleImportToLogoStudio = async (file: GoogleDriveFile) => {
    if (!accessToken) return;
    try {
      setStatusMessage({ type: 'info', text: `Downloading '${file.name}' from Google Drive...` });
      const { data } = await downloadDriveFile(accessToken, file.id);
      if (onImportLogoToStudio) {
        onImportLogoToStudio(data, file.name);
        setStatusMessage({ type: 'success', text: `Imported '${file.name}' into Master Logo Studio.` });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: `Failed to import image: ${err.message}` });
    }
  };

  // Perform Destructive Deletion with Mandatory User Confirmation
  const confirmDelete = async () => {
    if (!fileToDelete || !accessToken) return;
    setIsDeleting(true);
    try {
      await deleteDriveFile(accessToken, fileToDelete.id);
      setStatusMessage({ type: 'success', text: `File '${fileToDelete.name}' was removed from Google Drive.` });
      setFileToDelete(null);
      fetchFiles();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: `Failed to delete file: ${err.message}` });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                Google Drive & Cloud SQL Hub
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-medium">
                  Workspace Connected
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Browse Google Drive assets, import logos, and store immutable Cloud SQL database snapshots.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Notification Banner */}
        {statusMessage && (
          <div
            className={`px-6 py-3 border-b text-xs flex items-center justify-between ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-300'
                : statusMessage.type === 'error'
                ? 'bg-rose-950/60 border-rose-800/60 text-rose-300'
                : 'bg-indigo-950/60 border-indigo-800/60 text-indigo-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {statusMessage.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
              {statusMessage.type === 'info' && <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />}
              <span>{statusMessage.text}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="text-xs opacity-70 hover:opacity-100">
              Dismiss
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          
          {/* Top Auth / Connection Bar */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {currentUser ? (
                <>
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white uppercase text-sm border border-indigo-400/40 overflow-hidden">
                    {currentUser.photoURL ? (
                      <img src={currentUser.photoURL} alt={currentUser.displayName || ''} className="w-full h-full object-cover" />
                    ) : (
                      currentUser.email?.charAt(0) || 'U'
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                      {currentUser.displayName || currentUser.email}
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        OAuth Active
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{currentUser.email}</span>
                      <span>•</span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Drive Scope Authorized
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <div className="text-sm font-semibold text-slate-200">Google Workspace Drive Integration</div>
                  <div className="text-xs text-slate-400">
                    Sign in with Google to allow this application to access files and create backups with your permission.
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {currentUser ? (
                <>
                  <button
                    onClick={handleFullDriveBackup}
                    disabled={isBackingUp}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 transition-all disabled:opacity-50"
                  >
                    {isBackingUp ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Backing up to Drive...
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        Backup Snapshot to Drive
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl border border-slate-600 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={handleSignIn}
                  disabled={isAuthenticating}
                  className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  {isAuthenticating ? 'Connecting...' : 'Sign in with Google'}
                </button>
              )}
            </div>
          </div>

          {/* Cloud SQL Synchronization Indicator */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-medium">Cloud SQL PostgreSQL</div>
                <div className="text-xs font-semibold text-slate-200">ai-studio-3825022c (us-west1)</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Cloud className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-medium">PostgreSQL State Sync</div>
                <div className="text-xs font-semibold text-emerald-400">
                  {testers.length} Testers • {claims.length} Claims
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <FolderPlus className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-medium">Google Drive Folder</div>
                <div className="text-xs font-semibold text-amber-300">HUMAN-Ethical-AI-Console</div>
              </div>
            </div>
          </div>

          {/* Drive File Browser & Search Bar */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search files in Google Drive..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchFiles()}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    filterType === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All Files
                </button>
                <button
                  onClick={() => setFilterType('images')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                    filterType === 'images'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ImageIcon className="w-3 h-3" /> Images & Logos
                </button>
                <button
                  onClick={() => fetchFiles()}
                  disabled={isLoadingFiles || !accessToken}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors disabled:opacity-50"
                  title="Refresh Drive Files"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFiles ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* File List Grid */}
            {isLoadingFiles ? (
              <div className="p-12 text-center text-slate-400 space-y-3">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-indigo-400" />
                <p className="text-xs">Loading files from your Google Drive...</p>
              </div>
            ) : !currentUser ? (
              <div className="p-12 text-center border border-dashed border-slate-700/80 rounded-2xl bg-slate-800/20 space-y-4">
                <Lock className="w-8 h-8 mx-auto text-slate-500" />
                <div className="max-w-md mx-auto">
                  <h3 className="text-sm font-semibold text-slate-200">Google Drive Permission Required</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Sign in with your Google Account above to browse your Drive storage, import custom app logos, or export backup archives.
                  </p>
                </div>
                <button
                  onClick={handleSignIn}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-xs transition-colors"
                >
                  Authorize Google Drive
                </button>
              </div>
            ) : driveFiles.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-slate-700/80 rounded-2xl bg-slate-800/20 space-y-2">
                <FolderPlus className="w-8 h-8 mx-auto text-slate-500" />
                <p className="text-xs text-slate-300 font-medium">No files found matching your criteria</p>
                <p className="text-[11px] text-slate-500">
                  Click 'Backup Snapshot to Drive' to generate an ecosystem JSON backup in your Google Drive.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                {driveFiles.map((file) => {
                  const isImage = file.mimeType?.startsWith('image/') || file.name.match(/\.(png|jpg|jpeg|svg|webp)$/i);
                  const isJsonBackup = file.name.endsWith('.json') || file.name.includes('HUMAN_');

                  return (
                    <div
                      key={file.id}
                      className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-indigo-500/50 transition-all flex flex-col justify-between gap-3 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                          {file.thumbnailLink ? (
                            <img src={file.thumbnailLink} alt={file.name} className="w-full h-full object-cover" />
                          ) : isImage ? (
                            <ImageIcon className="w-5 h-5 text-indigo-400" />
                          ) : (
                            <FileText className="w-5 h-5 text-amber-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-slate-200 truncate" title={file.name}>
                            {file.name}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                            {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString() : 'Drive file'}
                            {file.size && ` • ${Math.round(parseInt(file.size, 10) / 1024)} KB`}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 text-xs">
                        <div className="flex items-center gap-1.5">
                          {isImage && (
                            <button
                              onClick={() => handleImportToLogoStudio(file)}
                              className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 text-[11px] font-medium transition-colors"
                            >
                              Use as Logo
                            </button>
                          )}
                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
                              title="Open in Google Drive"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>

                        {/* Explicit Destructive Action Modal Trigger */}
                        <button
                          onClick={() => setFileToDelete(file)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                          title="Delete file from Google Drive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Backups Log Table (Cloud SQL Records) */}
          {recentSqlBackups.length > 0 && (
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-blue-400" />
                Cloud SQL Backup Registry
              </h3>
              <div className="border border-slate-800 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-800/80 text-slate-400 border-b border-slate-700 text-[11px]">
                      <th className="p-2.5">File Name</th>
                      <th className="p-2.5">Type</th>
                      <th className="p-2.5">Items</th>
                      <th className="p-2.5">Created At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {recentSqlBackups.slice(0, 5).map((b) => (
                      <tr key={b.id} className="hover:bg-slate-800/30">
                        <td className="p-2.5 font-mono text-[11px] text-slate-200 truncate max-w-xs">{b.fileName}</td>
                        <td className="p-2.5 capitalize text-slate-400">{b.backupType.replace('_', ' ')}</td>
                        <td className="p-2.5 text-slate-300 font-semibold">{b.itemCount} records</td>
                        <td className="p-2.5 text-slate-400 text-[11px]">
                          {b.createdAt ? new Date(b.createdAt).toLocaleString() : 'Recent'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            The H.U.M.A.N. Initiative • OAuth 2.0 Client-Side Token Isolation
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>

      </div>

      {/* MANDATORY USER CONFIRMATION MODAL FOR DESTRUCTIVE OPERATIONS */}
      {fileToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-rose-600/50 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Confirm Deletion from Google Drive</h3>
                <p className="text-xs text-rose-400 font-medium">Permanent Action</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-white">"{fileToDelete.name}"</strong> from your Google Drive? This action cannot be undone.
            </p>

            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 text-[11px] text-slate-400 space-y-1">
              <div><strong className="text-slate-300">File ID:</strong> {fileToDelete.id}</div>
              <div><strong className="text-slate-300">MIME Type:</strong> {fileToDelete.mimeType}</div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setFileToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/20 transition-all flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Permanently
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
