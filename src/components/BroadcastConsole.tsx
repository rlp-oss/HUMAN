import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  Users, 
  CheckCircle2, 
  Layers, 
  Clock, 
  AlertCircle, 
  Check, 
  RefreshCw,
  Mail
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BroadcastMessage, Tester, AppName } from '../types';
import { BroadcastService } from '../services/api';

interface BroadcastConsoleProps {
  testers: Tester[];
  broadcasts: BroadcastMessage[];
  initialAppTarget?: AppName;
  onRefresh: () => void;
}

export const BroadcastConsole: React.FC<BroadcastConsoleProps> = ({
  testers,
  broadcasts,
  initialAppTarget,
  onRefresh,
}) => {
  const [targetApp, setTargetApp] = useState<string>(initialAppTarget || 'All Apps');
  const [subject, setSubject] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Professional & Inspiring');
  const [isDraftingWithAI, setIsDraftingWithAI] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const allApps: Array<AppName | 'All Apps'> = [
    'All Apps',
    'ShareShop Pro',
    'Lyria Studio',
    'CodeSynthesizer',
    'ReForgeOS Engine',
    'ArtisanPay API',
  ];

  const targetRecipients = targetApp === 'All Apps'
    ? testers
    : testers.filter(t => t.app_access_list.includes(targetApp as AppName));

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleDraftWithGemini = async () => {
    if (!topic.trim()) {
      alert('Please specify an announcement topic or release highlight.');
      return;
    }

    setIsDraftingWithAI(true);
    try {
      const draft = await BroadcastService.draftWithGemini({
        appTarget: targetApp,
        topic: topic.trim(),
        tone,
        extraContext: 'ReForgeOS micro-royalty sandbox and 5-stage testing guardrails update.',
      });

      if (draft.subject) setSubject(draft.subject);
      if (draft.bodyText) setBodyText(draft.bodyText);
      showToast('Gemini AI successfully crafted announcement draft!');
    } catch (err: any) {
      console.error(err);
      setSubject(`[${targetApp}] Beta Update: New Stripe Connect Micro-Royalty Settlement`);
      setBodyText(
        `Dear ${targetApp} Testers,\n\nWe have deployed our latest beta revision with upgraded 5-stage testing guardrails and real-time micro-patronage streaming.\n\nPlease verify your Stripe Sandbox connection in the developer console.\n\nWarm regards,\nCody Germain & The H.U.M.A.N. Team`
      );
    } finally {
      setIsDraftingWithAI(false);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !bodyText.trim()) {
      alert('Please enter both subject and message body.');
      return;
    }

    setIsSending(true);
    try {
      await BroadcastService.sendBroadcast({
        subject: subject.trim(),
        body_text: bodyText.trim(),
        target_app: targetApp,
        sender_admin: 'Cody Germain (Lead Architect)',
      });

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#34D399', '#064E3B'],
      });

      showToast(`Broadcast sent to ${targetRecipients.length} beta testers assigned to ${targetApp}!`);
      onRefresh();
      setSubject('');
      setBodyText('');
      setTopic('');
    } catch (err: any) {
      alert('Failed to send broadcast: ' + err.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6 text-[#2D2926]">
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border border-[#5A5A40]/40 bg-[#FFFFFF] text-[#2D2926] shadow-xl backdrop-blur-md">
          <CheckCircle2 className="w-5 h-5 text-[#5A5A40]" />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="rounded-2xl border border-[#E5E0D8] bg-[#F4EFEA] p-6 shadow-2xs">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#FFFFFF] border border-[#DCD5CA] text-[11px] font-mono text-[#5A5A40] shadow-2xs">
            <Send className="w-3.5 h-3.5 text-[#5A5A40]" />
            <span>Targeted Cohort Communications</span>
          </div>
          <h2 className="text-2xl font-black text-[#2D2926] tracking-tight">
            Beta Tester & Creator Broadcast Console
          </h2>
          <p className="text-sm text-[#6A655C] leading-relaxed">
            Dispatch announcements, license renewals, and testing missions directly to all testers currently assigned to a specific application cohort.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Compose Broadcast */}
        <div className="lg:col-span-7 rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 space-y-5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
            <div className="flex items-center gap-2 font-bold text-sm text-[#2D2926]">
              <Mail className="w-4 h-4 text-[#5A5A40]" />
              <span>Compose Broadcast Message</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-mono text-[#5A5A40] bg-[#FAF8F5] px-2.5 py-1 rounded border border-[#E5E0D8]">
              <Users className="w-3.5 h-3.5" />
              <span>{targetRecipients.length} Recipients</span>
            </div>
          </div>

          {/* AI Drafting Assistant Bar */}
          <div className="rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#5A5A40] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#D67D5C]" />
                Gemini AI Announcement Generator
              </span>
              <span className="text-[10px] font-mono text-[#8C857B]">Auto-copywriter</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="e.g. New Stripe Sandbox settlement & 5-stage guardrails live"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#DCD5CA] text-xs text-[#2D2926] placeholder-[#8C857B] focus:outline-none focus:border-[#5A5A40]"
                />
              </div>
              <button
                type="button"
                onClick={handleDraftWithGemini}
                disabled={isDraftingWithAI}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#F2ECE4] hover:bg-[#EBE5DC] text-[#5A5A40] border border-[#DCD5CA] flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-[#5A5A40]" />
                <span>{isDraftingWithAI ? 'Crafting...' : 'Generate Draft'}</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4 text-sm text-[#2D2926]">
            {/* Target Cohort App */}
            <div>
              <label className="block text-xs font-mono uppercase text-[#5A5A40] mb-1 font-semibold">
                Target Application Cohort
              </label>
              <select
                value={targetApp}
                onChange={(e) => setTargetApp(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#F9F7F2] border border-[#DCD5CA] text-sm text-[#2D2926] focus:outline-none focus:border-[#5A5A40]"
              >
                {allApps.map(app => (
                  <option key={app} value={app}>
                    {app} ({app === 'All Apps' ? testers.length : testers.filter(t => t.app_access_list.includes(app as AppName)).length} Testers)
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-mono uppercase text-[#5A5A40] mb-1 font-semibold">
                Broadcast Subject Line *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. [ShareShop Pro] Critical Build Update & License Refresh"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#F9F7F2] border border-[#DCD5CA] text-sm text-[#2D2926] placeholder-[#8C857B] focus:outline-none focus:border-[#5A5A40]"
              />
            </div>

            {/* Body */}
            <div>
              <label className="block text-xs font-mono uppercase text-[#5A5A40] mb-1 font-semibold">
                Message Body (Email Content) *
              </label>
              <textarea
                rows={6}
                required
                placeholder="Write your announcement to testers..."
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#F9F7F2] border border-[#DCD5CA] text-sm text-[#2D2926] placeholder-[#8C857B] focus:outline-none focus:border-[#5A5A40] font-mono text-xs"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E5E0D8]">
              <span className="text-[11px] font-mono text-[#8C857B]">
                Dispatches simultaneously via email & in-app notifications
              </span>
              <button
                type="submit"
                disabled={isSending || targetRecipients.length === 0}
                className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-[#D67D5C] hover:bg-[#C4704F] text-white shadow-sm flex items-center gap-2 active:scale-95 disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-4 h-4 text-white" />
                <span>{isSending ? 'Sending...' : `Send Broadcast (${targetRecipients.length})`}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Dispatch History & Recipient Preview */}
        <div className="lg:col-span-5 space-y-4">
          {/* Cohort Tester Roster Preview */}
          <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-2">
              <span className="text-xs font-mono uppercase text-[#5A5A40] font-bold">
                Assigned Testers for {targetApp} ({targetRecipients.length})
              </span>
              <Users className="w-3.5 h-3.5 text-[#8C857B]" />
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin">
              {targetRecipients.map(tester => (
                <div key={tester.id} className="flex items-center justify-between p-2 rounded-lg bg-[#FAF8F5] border border-[#E5E0D8] text-xs">
                  <div>
                    <div className="font-semibold text-[#2D2926]">{tester.name}</div>
                    <div className="text-[10px] text-[#8C857B] font-mono">{tester.email}</div>
                  </div>
                  <span className="text-[10px] font-mono text-[#5A5A40] bg-[#FFFFFF] px-1.5 py-0.5 rounded border border-[#DCD5CA]">
                    {tester.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Broadcast History */}
          <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-2">
              <span className="text-xs font-mono uppercase text-[#5A5A40] font-bold">
                Broadcast Dispatch History ({broadcasts.length})
              </span>
              <Clock className="w-3.5 h-3.5 text-[#8C857B]" />
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto scrollbar-thin">
              {broadcasts.map(bc => (
                <div key={bc.id} className="rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] p-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#2D2926] truncate max-w-[200px]">{bc.subject}</span>
                    <span className="text-[10px] font-mono text-[#5A5A40] bg-[#FFFFFF] px-1.5 py-0.5 rounded border border-[#DCD5CA]">
                      {bc.target_app}
                    </span>
                  </div>
                  <p className="text-xs text-[#6A655C] line-clamp-2 font-mono">
                    {bc.body_text}
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#8C857B] pt-1 border-t border-[#E5E0D8]">
                    <span>{bc.recipients_count} delivered</span>
                    <span>{new Date(bc.sent_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
