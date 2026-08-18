import React, { useState } from 'react';
import { 
  MessageSquareQuote, 
  Filter, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Send, 
  Plus, 
  Sparkles, 
  User, 
  Tag,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FeedbackItem, AppName, FeedbackCategory, FeedbackSeverity, FeedbackStatus } from '../types';
import { FeedbackService } from '../services/api';

interface FeedbackPortalProps {
  feedbackList: FeedbackItem[];
  onRefresh: () => void;
}

export const FeedbackPortal: React.FC<FeedbackPortalProps> = ({ feedbackList, onRefresh }) => {
  const [selectedApp, setSelectedApp] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<FeedbackItem | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // New feedback form states
  const [newTesterName, setNewTesterName] = useState('Cody Germain');
  const [newTesterEmail, setNewTesterEmail] = useState('codygermain032@gmail.com');
  const [newApp, setNewApp] = useState<AppName>('ShareShop Pro');
  const [newCategory, setNewCategory] = useState<FeedbackCategory>('Bug');
  const [newSeverity, setNewSeverity] = useState<FeedbackSeverity>('Medium');
  const [newSubject, setNewSubject] = useState('');
  const [newContent, setNewContent] = useState('');

  const allApps: AppName[] = ['ShareShop Pro', 'Lyria Studio', 'CodeSynthesizer', 'ReForgeOS Engine', 'ArtisanPay API'];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleSendReply = async (feedbackId: string) => {
    if (!replyText.trim()) return;

    try {
      const updated = await FeedbackService.addReply(feedbackId, replyText.trim(), 'Cody Germain (Admin)');
      setSelectedItem(updated);
      setReplyText('');
      showToast('Reply dispatched to tester!');
      onRefresh();
    } catch (err: any) {
      alert('Failed to send reply: ' + err.message);
    }
  };

  const handleUpdateStatus = async (feedbackId: string, status: FeedbackStatus) => {
    try {
      const updated = await FeedbackService.updateFeedbackStatus(feedbackId, status);
      setSelectedItem(updated);
      showToast(`Status updated to ${status}`);
      onRefresh();
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleCreateFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newContent.trim()) {
      alert('Please fill out the subject and content.');
      return;
    }

    try {
      await FeedbackService.addFeedback({
        tester_id: 'tst_user',
        tester_name: newTesterName,
        tester_email: newTesterEmail,
        app_name: newApp,
        category: newCategory,
        severity: newSeverity,
        subject: newSubject.trim(),
        content: newContent.trim(),
      });

      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10B981', '#34D399'],
      });

      showToast(`Feedback logged under ${newApp}!`);
      setIsAddingNew(false);
      setNewSubject('');
      setNewContent('');
      onRefresh();
    } catch (err: any) {
      alert('Failed to log feedback: ' + err.message);
    }
  };

  const filteredFeedback = feedbackList.filter(item => {
    const matchesSearch = 
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tester_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesApp = selectedApp === 'All' || item.app_name === selectedApp;
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;

    return matchesSearch && matchesApp && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6 text-[#2D2926]">
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border border-[#5A5A40]/40 bg-[#FFFFFF] text-[#2D2926] shadow-xl backdrop-blur-md">
          <CheckCircle2 className="w-5 h-5 text-[#5A5A40]" />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="rounded-2xl border border-[#E5E0D8] bg-[#F4EFEA] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#FFFFFF] border border-[#DCD5CA] text-[11px] font-mono text-[#5A5A40] shadow-2xs">
            <MessageSquareQuote className="w-3.5 h-3.5 text-[#5A5A40]" />
            <span>Categorized by Application Cohort</span>
          </div>
          <h2 className="text-2xl font-black text-[#2D2926] tracking-tight">
            Incoming Beta Tester Feedback Portal
          </h2>
          <p className="text-sm text-[#6A655C] leading-relaxed">
            Monitor bug reports, feature requests, and micro-royalty queries streamed by beta testers across ShareShop Pro, Lyria Studio, CodeSynthesizer, and ReForgeOS.
          </p>
        </div>

        <button
          onClick={() => setIsAddingNew(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D67D5C] hover:bg-[#C4704F] text-white font-semibold text-xs shadow-sm transition-all active:scale-95 whitespace-nowrap cursor-pointer"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Submit Tester Feedback</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E5E0D8] bg-[#FFFFFF] p-4 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative w-56">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#8C857B]" />
            <input
              type="text"
              placeholder="Search feedback..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#F9F7F2] border border-[#DCD5CA] text-xs text-[#2D2926] placeholder-[#8C857B] focus:outline-none focus:border-[#5A5A40]"
            />
          </div>

          {/* App Filter */}
          <select
            value={selectedApp}
            onChange={(e) => setSelectedApp(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#F9F7F2] border border-[#DCD5CA] text-xs text-[#2D2926] focus:outline-none focus:border-[#5A5A40]"
          >
            <option value="All">All Apps ({feedbackList.length})</option>
            {allApps.map(app => (
              <option key={app} value={app}>
                {app} ({feedbackList.filter(f => f.app_name === app).length})
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#F9F7F2] border border-[#DCD5CA] text-xs text-[#2D2926] focus:outline-none focus:border-[#5A5A40]"
          >
            <option value="All">All Categories</option>
            <option value="Bug">Bugs</option>
            <option value="Feature Request">Feature Requests</option>
            <option value="Royalty Dispute">Royalty Disputes</option>
            <option value="UX & Flow">UX & Flow</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#F9F7F2] border border-[#DCD5CA] text-xs text-[#2D2926] focus:outline-none focus:border-[#5A5A40]"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="In Review">In Review</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div className="text-xs font-mono text-[#6A655C]">
          Showing <strong>{filteredFeedback.length}</strong> items
        </div>
      </div>

      {/* Main Feedback Grid / Master-Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Feedback List */}
        <div className="lg:col-span-6 space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin">
          {filteredFeedback.length === 0 ? (
            <div className="rounded-xl border border-[#E5E0D8] bg-[#FFFFFF] p-8 text-center text-[#8C857B] space-y-2 shadow-2xs">
              <MessageSquareQuote className="w-8 h-8 mx-auto opacity-40" />
              <p className="text-sm font-medium">No feedback items match your filters.</p>
            </div>
          ) : (
            filteredFeedback.map((item) => {
              const isSelected = selectedItem?.id === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`rounded-xl border p-4 space-y-2.5 cursor-pointer transition-all shadow-2xs ${
                    isSelected
                      ? 'bg-[#F4EFEA] border-[#5A5A40] shadow-sm'
                      : 'bg-[#FFFFFF] border-[#E5E0D8] hover:border-[#DCD5CA]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-[#5A5A40] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E5E0D8]">
                          {item.app_name}
                        </span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          item.severity === 'Critical'
                            ? 'bg-[#FDF2F2] text-[#9B2C2C] border border-[#FEB2B2]'
                            : item.severity === 'High'
                            ? 'bg-[#FAF0EC] text-[#D67D5C] border border-[#EECDBC]'
                            : 'bg-[#F0F2EB] text-[#5A5A40] border border-[#C9D1BE]'
                        }`}>
                          {item.severity}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[#2D2926] pt-1">{item.subject}</h4>
                    </div>

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded whitespace-nowrap ${
                      item.status === 'Resolved'
                        ? 'bg-[#F0F2EB] text-[#5A5A40] border border-[#C9D1BE]'
                        : item.status === 'In Review'
                        ? 'bg-[#FAF0EC] text-[#D67D5C] border border-[#EECDBC]'
                        : 'bg-[#FAF8F5] text-[#6A655C] border border-[#E5E0D8]'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#6A655C] line-clamp-2 leading-relaxed">
                    {item.content}
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-mono text-[#8C857B] pt-1 border-t border-[#F2ECE4]">
                    <span>From {item.tester_name}</span>
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Feedback Details & Reply Thread */}
        <div className="lg:col-span-6">
          {selectedItem ? (
            <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 space-y-5 shadow-2xs">
              <div className="flex items-start justify-between border-b border-[#E5E0D8] pb-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#5A5A40] mb-1">
                    <span className="bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E5E0D8]">
                      {selectedItem.app_name}
                    </span>
                    <span>• {selectedItem.category}</span>
                  </div>
                  <h3 className="font-bold text-base text-[#2D2926]">{selectedItem.subject}</h3>
                </div>

                <div className="flex items-center gap-1">
                  {(['New', 'In Review', 'Resolved'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(selectedItem.id, st)}
                      className={`text-[10px] font-mono px-2 py-1 rounded transition-colors cursor-pointer ${
                        selectedItem.status === st
                          ? 'bg-[#5A5A40] text-white font-bold'
                          : 'bg-[#FAF8F5] text-[#6A655C] hover:bg-[#F2ECE4] border border-[#E5E0D8]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Author & Message Body */}
              <div className="rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#5A5A40] font-mono">
                  <span><strong>Reporter:</strong> {selectedItem.tester_name} ({selectedItem.tester_email})</span>
                  <span>{new Date(selectedItem.created_at).toLocaleTimeString()}</span>
                </div>
                <div className="text-[#2D2926] text-sm font-sans leading-relaxed pt-1">
                  {selectedItem.content}
                </div>
              </div>

              {/* Reply Thread */}
              <div className="space-y-3">
                <h5 className="text-xs font-mono uppercase text-[#5A5A40] font-bold">
                  Communication Thread ({selectedItem.reply_history?.length || 0})
                </h5>

                <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                  {selectedItem.reply_history && selectedItem.reply_history.length > 0 ? (
                    selectedItem.reply_history.map((reply, idx) => (
                      <div key={idx} className="rounded-lg bg-[#FAF8F5] border border-[#E5E0D8] p-3 text-xs space-y-1">
                        <div className="flex justify-between font-mono text-[10px] text-[#5A5A40]">
                          <strong>{reply.sender}</strong>
                          <span>{new Date(reply.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-[#2D2926]">{reply.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-[#8C857B] italic">No replies recorded yet.</div>
                  )}
                </div>

                {/* Reply Input */}
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Type an official response to the tester..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSendReply(selectedItem.id); }}
                    className="flex-1 px-3 py-2 rounded-lg bg-[#F9F7F2] border border-[#DCD5CA] text-xs text-[#2D2926] placeholder-[#8C857B] focus:outline-none focus:border-[#5A5A40]"
                  />
                  <button
                    onClick={() => handleSendReply(selectedItem.id)}
                    className="px-4 py-2 rounded-lg bg-[#D67D5C] hover:bg-[#C4704F] text-white font-semibold text-xs flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5 text-white" />
                    <span>Reply</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-12 text-center text-[#8C857B] space-y-2 shadow-2xs">
              <MessageSquareQuote className="w-10 h-10 mx-auto opacity-30" />
              <h4 className="text-sm font-semibold text-[#5A5A40]">Select a Feedback Item</h4>
              <p className="text-xs text-[#6A655C]">
                Click any feedback ticket on the left to read details, update status, and message the beta tester.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add New Feedback Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D2926]/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 shadow-2xl space-y-4 my-8 animate-scale-up text-[#2D2926]">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <h3 className="font-bold text-[#2D2926]">Log Beta Tester Feedback Ticket</h3>
              <button onClick={() => setIsAddingNew(false)} className="text-[#8C857B] hover:text-[#2D2926] cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateFeedback} className="space-y-3 text-xs text-[#2D2926]">
              <div>
                <label className="block font-mono uppercase text-[#5A5A40] mb-1 font-semibold">Target Application</label>
                <select
                  value={newApp}
                  onChange={(e) => setNewApp(e.target.value as AppName)}
                  className="w-full px-3 py-2 rounded-lg bg-[#F9F7F2] border border-[#DCD5CA] text-xs text-[#2D2926] focus:outline-none focus:border-[#5A5A40]"
                >
                  {allApps.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-mono uppercase text-[#5A5A40] mb-1 font-semibold">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as FeedbackCategory)}
                    className="w-full px-3 py-2 rounded-lg bg-[#F9F7F2] border border-[#DCD5CA] text-xs text-[#2D2926] focus:outline-none focus:border-[#5A5A40]"
                  >
                    <option value="Bug">Bug</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Royalty Dispute">Royalty Dispute</option>
                    <option value="UX & Flow">UX & Flow</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono uppercase text-[#5A5A40] mb-1 font-semibold">Severity</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as FeedbackSeverity)}
                    className="w-full px-3 py-2 rounded-lg bg-[#F9F7F2] border border-[#DCD5CA] text-xs text-[#2D2926] focus:outline-none focus:border-[#5A5A40]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono uppercase text-[#5A5A40] mb-1 font-semibold">Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Issue with Stripe Sandbox micro-royalty routing"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#F9F7F2] border border-[#DCD5CA] text-xs text-[#2D2926] placeholder-[#8C857B] focus:outline-none focus:border-[#5A5A40]"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-[#5A5A40] mb-1 font-semibold">Feedback Content *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe the steps, expected behavior, or suggestion..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#F9F7F2] border border-[#DCD5CA] text-xs text-[#2D2926] placeholder-[#8C857B] focus:outline-none focus:border-[#5A5A40] font-mono text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E0D8]">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-3 py-1.5 rounded-lg text-[#6A655C] hover:bg-[#F5F1EB] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#D67D5C] hover:bg-[#C4704F] text-white font-semibold cursor-pointer shadow-sm"
                >
                  Save & Log Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
