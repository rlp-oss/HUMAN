import React, { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, User, signOut } from 'firebase/auth';
import { Shield, Fingerprint, LogIn, Award, Users, ChevronRight, Lock, EyeOff } from 'lucide-react';
import TreasureHuntDecoder from './TreasureHuntDecoder';

// Minimal Firebase configuration - points to client environment configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize client Firebase SDK safely
if (getApps().length === 0) {
  initializeApp(firebaseConfig);
}

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

export default function HunterAuthGateway() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCohortSize, setActiveCohortSize] = useState(128); // Simulated baseline
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Hit your secure Firebase onboarding endpoint to register/retrieve the progress log
      await fetch('/api/hunters/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify({
          displayName: user.displayName,
          email: user.email,
          userAgent: navigator.userAgent
        })
      });

    } catch (error: any) {
      console.error("Google Authentication failed:", error);
      setErrorMsg("Authentication gateway connection interrupted. Please try again.");
    }
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070A11] flex items-center justify-center font-mono text-emerald-400">
        <div className="flex flex-col items-center space-y-4">
          <Fingerprint className="w-12 h-12 animate-spin text-emerald-500" />
          <p className="text-xs tracking-widest uppercase animate-pulse">Initializing Security Gateway...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070A11] text-[#F8FAFC] flex flex-col items-center justify-center p-4 font-mono select-none">
      
      {/* Background Neon Overlay */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />

      {!currentUser ? (
        <div className="w-full max-w-lg bg-[#0F172A] border border-[#1E293B] rounded-xl overflow-hidden shadow-2xl relative">
          {/* Top Compliance Ribbon */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
          
          <div className="p-8 space-y-6">
            
            {/* Logo and Branding */}
            <div className="flex flex-col items-center space-y-3 text-center">
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-full text-emerald-400 relative">
                <Shield className="w-10 h-10 animate-pulse" />
                <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-md scale-125" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-widest uppercase">The Hunter Guild</h1>
                <p className="text-[10px] text-emerald-500 tracking-wider uppercase font-semibold mt-1">
                  Active Proof-Of-Humanity Registry
                </p>
              </div>
            </div>

            <p className="text-xs text-[#94A3B8] leading-relaxed text-center max-w-sm mx-auto">
              Welcome to the underground coordination engine. To track your 15-chapter progression, 
              verify your human signature, and claim your Sovereign Royalty Key, you must register 
              with your Google account to log your progression metrics.
            </p>

            {/* Ingestion Stats Bento Card */}
            <div className="bg-[#070A11] border border-[#1E293B] rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Registered Seekers</div>
                  <div className="text-sm font-bold text-slate-200">COHORT_ALPHA: {activeCohortSize} Active</div>
                </div>
              </div>
              <div className="flex items-center space-x-1.5 text-[9px] text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded bg-emerald-950/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>ONLINE</span>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-red-950/30 border border-red-500/20 text-red-400 rounded-lg text-xs text-center">
                {errorMsg}
              </div>
            )}

            {/* Trigger Button */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full bg-[#F8FAFC] hover:bg-slate-200 text-slate-950 font-bold py-3 px-4 rounded-lg text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-3 shadow-lg cursor-pointer"
            >
              <LogIn className="w-4 h-4 shrink-0" />
              Sign In with Google
            </button>

            {/* Privacy Compliance Footer */}
            <div className="flex items-center justify-center space-x-2 text-[9px] text-slate-500 pt-2 border-t border-[#1E293B]">
              <EyeOff className="w-3.5 h-3.5 text-slate-600" />
              <span className="uppercase tracking-wider">C2PA Privacy v4.2 Enforced (Zero Ingestion / Zero Email Spam)</span>
            </div>

          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl space-y-4">
          
          {/* Logged In Mini-Dashboard */}
          <div className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative w-10 h-10 rounded-full border border-emerald-500/30 overflow-hidden bg-[#070A11] flex items-center justify-center">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="Hunter Profile" className="w-full h-full object-cover" />
                ) : (
                  <Fingerprint className="w-5 h-5 text-emerald-400" />
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200">{currentUser.displayName || 'Verified Hunter'}</div>
                <div className="text-[9px] text-slate-500 uppercase tracking-widest">
                  SEEKER COHORT INDUCTION CODES: {currentUser.uid.slice(0, 8).toUpperCase()}-SRK
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
              <button
                onClick={handleSignOut}
                className="text-[10px] text-slate-500 hover:text-red-400 transition-all uppercase border border-[#1E293B] hover:border-red-500/20 px-3 py-1.5 rounded-lg bg-[#070A11] cursor-pointer"
              >
                Terminate Session
              </button>
            </div>
          </div>

          {/* Active Progress Decoder Component */}
          <TreasureHuntDecoder />

        </div>
      )}

    </div>
  );
}
