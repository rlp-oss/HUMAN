import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Shield, 
  RefreshCw, 
  Key, 
  Mail, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  Github, 
  ChevronRight, 
  Sparkles,
  Layers,
  Send,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Tester, AppName, SubscriptionStatus } from '../types';
import { TesterService } from '../services/api';

interface TesterConsoleProps {
  testers: Tester[];
  onRefresh: () => void;
  onOpenOnboardModal: () => void;
  onOpenBroadcastWithCohort?: (app: AppName) => void;
}

export const TesterConsole: React.FC<TesterConsoleProps> = ({
  testers,
  onRefresh,
  onOpenOnboardModal,
  onOpenBroadcastWithCohort,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppFilter, setSelectedAppFilter] = useState<string>('All');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('All');
  const [selectedTester, setSelectedTester] = useState<Tester | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [emailModalTester, setEmailModalTester] = useState<Tester | null>(null);
  const [grantAccessModalTester, setGrantAccessModalTester] = useState<Tester | null>(null);
  const [selectedAppToGrant, setSelectedAppToGrant] = useState<AppName>('Tome Crafter');

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleGrantAccess = async (tester: Tester, appName: AppName) => {
    setActionLoadingId(`grant_${tester.id}_${appName}`);
    try {
      const result = await TesterService.grantAccess(tester.id, appName, 'Enterprise Beta');
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10B981', '#34D399', '#059669'],
      });
      showToast(`Access granted for ${appName}! License: ${result.licenseKey}`, 'success');
      onRefresh();
      setGrantAccessModalTester(null);
    } catch (err: any) {
      showToast(`Failed to grant access: ${err.message}`, 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleResetStripeSandbox = async (tester: Tester) => {
    setActionLoadingId(`reset_${tester.id}`);
    try {
      const result = await TesterService.resetStripeSandbox(tester.id, tester.email);
      showToast(`Stripe Sandbox reset for ${tester.name}. Test tokens refreshed.`, 'info');
      onRefresh();
    } catch (err: any) {
      showToast(`Failed to reset Stripe Sandbox: ${err.message}`, 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleResendWelcomeEmail = (tester: Tester) => {
    setEmailModalTester(tester);
  };

  const handleExportCSV = (cohortOnly: boolean = false) => {
    const exportData = cohortOnly ? filteredTesters : testers;
    if (exportData.length === 0) {
      showToast('No testers found to export.', 'info');
      return;
    }

    const headers = [
      'Tester ID',
      'Full Name',
      'Email Address',
      'GitHub Handle',
      'Role',
      'App Access List',
      'Subscription Status',
      'Stripe Account ID',
      'Total Royalties Received (USD)',
      'Joined Date',
      'Last Active',
      'Welcome Email Sent',
      'Notes'
    ];

    const escapeCSV = (val: any): string => {
      if (val === null || val === undefined) return '""';
      const stringVal = String(val).replace(/"/g, '""');
      return `"${stringVal}"`;
    };

    const rows = exportData.map(t => [
      escapeCSV(t.id),
      escapeCSV(t.name),
      escapeCSV(t.email),
      escapeCSV(t.github_handle || ''),
      escapeCSV(t.role),
      escapeCSV(t.app_access_list ? t.app_access_list.join('; ') : ''),
      escapeCSV(t.current_subscription_status),
      escapeCSV(t.stripe_account_id || ''),
      escapeCSV(typeof t.total_royalties_received === 'number' ? t.total_royalties_received.toFixed(2) : '0.00'),
      escapeCSV(t.joined_at || ''),
      escapeCSV(t.last_active || ''),
      escapeCSV(t.email_welcomed ? 'Yes' : 'No'),
      escapeCSV(t.notes || '')
    ].join(','));

    const csvString = [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    const cohortSlug = cohortOnly && selectedAppFilter !== 'All' 
      ? `${selectedAppFilter.toLowerCase().replace(/\s+/g, '_')}_` 
      : '';
    
    link.setAttribute('href', url);
    link.setAttribute('download', `human_testers_${cohortSlug}${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Exported ${exportData.length} tester record(s) to CSV`, 'success');
  };

  // Filter logic
  const filteredTesters = testers.filter(tester => {
    const matchesSearch = 
      tester.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tester.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tester.github_handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tester.stripe_account_id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesApp = 
      selectedAppFilter === 'All' || 
      tester.app_access_list.includes(selectedAppFilter as AppName);

    const matchesRole = 
      selectedRoleFilter === 'All' || 
      tester.role === selectedRoleFilter;

    return matchesSearch && matchesApp && matchesRole;
  });

  const allApps: AppName[] = ['Tome Crafter', 'RLM Pro Studio', 'ForgeOS App Builder', 'RL Easy Flow'];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-xl backdrop-blur-md animate-fade-in ${
          toastMessage.type === 'success'
            ? 'bg-[#FFFFFF] text-[#2D2926] border-[#5A5A40]/40 shadow-sm'
            : toastMessage.type === 'info'
            ? 'bg-[#FFFFFF] text-[#2D2926] border-[#D67D5C]/40 shadow-sm'
            : 'bg-[#FFFFFF] text-[#2D2926] border-red-300 shadow-sm'
        }`}>
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-[#5A5A40]" />
          ) : (
            <AlertCircle className="w-5 h-5 text-[#D67D5C]" />
          )}
          <span className="text-sm font-medium">{toastMessage.text}</span>
        </div>
      )}

      {/* Top Banner & Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#E5E0D8] bg-[#FFFFFF] p-4.5 relative overflow-hidden shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#5A5A40] font-mono mb-1">
            <span>TOTAL TESTERS</span>
            <Users className="w-4 h-4 text-[#5A5A40]" />
          </div>
          <div className="text-2xl font-bold text-[#2D2926]">{testers.length} Active</div>
          <div className="text-[11px] text-[#6A655C] mt-1 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5A5A40] inline-block"></span>
            Powering Ethical AI apps, And Paying the People
          </div>
        </div>

        <div className="rounded-xl border border-[#E5E0D8] bg-[#FFFFFF] p-4.5 relative overflow-hidden shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#D67D5C] font-mono mb-1">
            <span>STRIPE SANDBOX ACTIVE</span>
            <RefreshCw className="w-4 h-4 text-[#D67D5C]" />
          </div>
          <div className="text-2xl font-bold text-[#2D2926]">
            {testers.filter(t => t.current_subscription_status.includes('Stripe')).length}
          </div>
          <div className="text-[11px] text-[#6A655C] mt-1">
            Sandbox & Connect Payout channels
          </div>
        </div>

        <div className="rounded-xl border border-[#E5E0D8] bg-[#FFFFFF] p-4.5 relative overflow-hidden shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#5A5A40] font-mono mb-1">
            <span>APP COHORTS</span>
            <Layers className="w-4 h-4 text-[#5A5A40]" />
          </div>
          <div className="text-2xl font-bold text-[#2D2926]">4 Software Suites</div>
          <div className="text-[11px] text-[#6A655C] mt-1">
            Tome Crafter, RLM Pro, ForgeOS, Easy Flow
          </div>
        </div>

        <div className="rounded-xl border border-[#E5E0D8] bg-[#FFFFFF] p-4.5 relative overflow-hidden shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#D67D5C] font-mono mb-1">
            <span>PATRONAGE ACCUMULATED</span>
            <DollarSign className="w-4 h-4 text-[#D67D5C]" />
          </div>
          <div className="text-2xl font-bold text-[#D67D5C]">
            ${testers.reduce((acc, t) => acc + (t.total_royalties_received || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[#6A655C] mt-1">
            Streamed directly to tester accounts
          </div>
        </div>
      </div>

      {/* Control Header & Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-xl border border-[#E5E0D8] bg-[#FFFFFF] p-4 shadow-2xs">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#8C857B]" />
            <input
              type="text"
              placeholder="Search tester, email, GitHub..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#F9F7F2] border border-[#DCD5CA] text-sm text-[#2D2926] placeholder-[#8C857B] focus:outline-none focus:border-[#5A5A40] transition-colors"
            />
          </div>

          {/* App Access Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#5A5A40]" />
            <select
              value={selectedAppFilter}
              onChange={(e) => setSelectedAppFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-[#F9F7F2] border border-[#DCD5CA] text-xs text-[#2D2926] focus:outline-none focus:border-[#5A5A40]"
            >
              <option value="All">All Apps</option>
              {allApps.map(app => (
                <option key={app} value={app}>{app}</option>
              ))}
            </select>
          </div>

          {/* Role Filter */}
          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#F9F7F2] border border-[#DCD5CA] text-xs text-[#2D2926] focus:outline-none focus:border-[#5A5A40]"
          >
            <option value="All">All Roles</option>
            <option value="App Creator">App Creator</option>
            <option value="OSS Maintainer">OSS Maintainer</option>
            <option value="Artisan Author">Artisan Author</option>
            <option value="Musician">Musician</option>
            <option value="Beta Tester">Beta Tester</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
          {selectedAppFilter !== 'All' && onOpenBroadcastWithCohort && (
            <button
              onClick={() => onOpenBroadcastWithCohort(selectedAppFilter as AppName)}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-[#F2ECE4] hover:bg-[#EBE5DC] text-[#5A5A40] border border-[#DCD5CA] transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>Broadcast to {selectedAppFilter}</span>
            </button>
          )}

          {/* Export CSV Buttons */}
          <button
            onClick={() => handleExportCSV(false)}
            title="Export all testers as a CSV file"
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-[#FFFFFF] hover:bg-[#F9F7F2] text-[#2D2926] border border-[#DCD5CA] shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#5A5A40]" />
            <span>Export CSV</span>
          </button>

          {filteredTesters.length < testers.length && (
            <button
              onClick={() => handleExportCSV(true)}
              title="Export only currently filtered testers as CSV"
              className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-[#F5F1EB] hover:bg-[#EBE5DC] text-[#5A5A40] border border-[#DCD5CA] shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>Export Filtered ({filteredTesters.length})</span>
            </button>
          )}

          <button
            onClick={onOpenOnboardModal}
            className="flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-lg bg-[#D67D5C] hover:bg-[#C4704F] text-white shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
            <span>Onboard Tester</span>
          </button>
        </div>
      </div>

      {/* Main Tester Data Table */}
      <div className="rounded-xl border border-[#E5E0D8] bg-[#FFFFFF] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#2D2926]">
            <thead className="border-b border-[#E5E0D8] bg-[#F5F1EB] text-[11px] font-mono uppercase text-[#5A5A40]">
              <tr>
                <th className="px-4 py-3">Tester & Identity</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">App Access List</th>
                <th className="px-4 py-3">Stripe Status</th>
                <th className="px-4 py-3">
                  <span className="block">Royalties (Sample)</span>
                  <span className="text-[9px] text-[#8C857B] font-sans lowercase font-normal">*testing only</span>
                </th>
                <th className="px-4 py-3 text-right">Status Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE4]">
              {filteredTesters.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-[#8C857B]">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#8C857B]" />
                    <p className="text-sm font-medium">No testers found matching your filter criteria.</p>
                    <button 
                      onClick={() => { setSearchQuery(''); setSelectedAppFilter('All'); setSelectedRoleFilter('All'); }}
                      className="mt-2 text-xs text-[#5A5A40] hover:underline"
                    >
                      Clear filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredTesters.map((tester) => {
                  const isResetting = actionLoadingId === `reset_${tester.id}`;

                  return (
                    <tr 
                      key={tester.id}
                      className="hover:bg-[#FAF8F5] transition-colors group cursor-pointer"
                      onClick={() => setSelectedTester(tester)}
                    >
                      {/* Name & Email */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#EAE5DC] flex items-center justify-center text-xs font-bold text-[#5A5A40] border border-[#D4CCC1]">
                            {tester.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-[#2D2926] flex items-center gap-1.5">
                              {tester.name}
                              {tester.github_handle && (
                                <span className="text-[11px] font-mono text-[#8C857B] flex items-center gap-0.5">
                                  <Github className="w-3 h-3 inline text-[#8C857B]" />
                                  {tester.github_handle}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-[#6A655C] font-mono">{tester.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono border ${
                          tester.role === 'App Creator'
                            ? 'bg-[#F0F2EB] text-[#5A5A40] border-[#C9D1BE]'
                            : tester.role === 'OSS Maintainer'
                            ? 'bg-[#FAF0EC] text-[#D67D5C] border-[#EECDBC]'
                            : tester.role === 'Musician'
                            ? 'bg-[#F5EFF8] text-[#7A4E82] border-[#E0D0E5]'
                            : 'bg-[#F2ECE4] text-[#6A655C] border-[#DCD5CA]'
                        }`}>
                          {tester.role}
                        </span>
                      </td>

                      {/* App Access List */}
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {tester.app_access_list.map((app) => (
                            <span 
                              key={app}
                              className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#F5F1EB] text-[#5A5A40] border border-[#DCD5CA]"
                            >
                              {app}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Stripe Subscription Status */}
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col">
                          <span className={`inline-flex items-center gap-1 text-xs font-mono font-medium ${
                            tester.current_subscription_status === 'Stripe Connect Active'
                              ? 'text-[#5A5A40]'
                              : tester.current_subscription_status === 'Stripe Sandbox'
                              ? 'text-[#D67D5C]'
                              : 'text-[#9C7536]'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              tester.current_subscription_status === 'Stripe Connect Active'
                                ? 'bg-[#5A5A40]'
                                : 'bg-[#D67D5C]'
                            }`} />
                            {tester.current_subscription_status}
                          </span>
                          <span className="text-[10px] font-mono text-[#8C857B] truncate max-w-[130px]">
                            {tester.stripe_account_id}
                          </span>
                        </div>
                      </td>

                      {/* Royalties */}
                      <td className="px-4 py-3.5">
                        <div className="font-mono font-semibold text-[#2D2926]">
                          ${tester.total_royalties_received.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-[#8C857B] font-mono">
                          Active: {tester.last_active}
                        </div>
                      </td>

                      {/* Status Controls */}
                      <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Grant Access Button */}
                          <button
                            onClick={() => {
                              setGrantAccessModalTester(tester);
                            }}
                            className="px-2.5 py-1 rounded text-xs font-medium bg-[#F5F1EB] hover:bg-[#EBE5DC] text-[#5A5A40] border border-[#DCD5CA] transition-colors flex items-center gap-1 cursor-pointer"
                            title="Grant access to another app or tier"
                          >
                            <Key className="w-3 h-3 text-[#5A5A40]" />
                            <span>Grant Access</span>
                          </button>

                          {/* Reset Stripe Sandbox Button */}
                          <button
                            onClick={() => handleResetStripeSandbox(tester)}
                            disabled={isResetting}
                            className="px-2.5 py-1 rounded text-xs font-medium bg-[#FAF0EC] hover:bg-[#F5E6DF] text-[#D67D5C] border border-[#EECDBC] transition-colors flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                            title="Reset Stripe Sandbox tokens and refresh customer account"
                          >
                            <RefreshCw className={`w-3 h-3 text-[#D67D5C] ${isResetting ? 'animate-spin' : ''}`} />
                            <span>Reset Sandbox</span>
                          </button>

                          {/* Welcome Email Preview */}
                          <button
                            onClick={() => handleResendWelcomeEmail(tester)}
                            className="p-1 rounded text-[#6A655C] hover:text-[#2D2926] hover:bg-[#F5F1EB] transition-colors cursor-pointer"
                            title="View / Dispatch Welcome Email"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setSelectedTester(tester)}
                            className="p-1 rounded text-[#8C857B] hover:text-[#2D2926] hover:bg-[#F5F1EB] transition-colors cursor-pointer"
                            title="View Tester Details"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Summary & CSV Download Link */}
        <div className="px-4 py-3 bg-[#FAF8F5] border-t border-[#E5E0D8] flex flex-wrap items-center justify-between text-xs text-[#6A655C] gap-3">
          <div>
            Showing <strong className="text-[#2D2926] font-semibold">{filteredTesters.length}</strong> of <strong className="text-[#2D2926] font-semibold">{testers.length}</strong> testers
            {selectedAppFilter !== 'All' && <span> in <span className="font-mono text-[#5A5A40]">{selectedAppFilter}</span></span>}
            {selectedRoleFilter !== 'All' && <span> • <span className="font-mono text-[#5A5A40]">{selectedRoleFilter}</span></span>}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleExportCSV(false)}
              className="inline-flex items-center gap-1.5 text-[#5A5A40] hover:text-[#2D2926] font-medium transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>Download CSV (All {testers.length})</span>
            </button>

            {filteredTesters.length < testers.length && filteredTesters.length > 0 && (
              <button
                onClick={() => handleExportCSV(true)}
                className="inline-flex items-center gap-1.5 text-[#D67D5C] hover:text-[#C4704F] font-medium transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#D67D5C]" />
                <span>Download Filtered ({filteredTesters.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grant Access Modal */}
      {grantAccessModalTester && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D2926]/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 shadow-xl space-y-4 animate-scale-up text-[#2D2926]">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-[#5A5A40]" />
                <h3 className="font-semibold text-[#2D2926]">Grant App Access & License</h3>
              </div>
              <button 
                onClick={() => setGrantAccessModalTester(null)}
                className="text-[#8C857B] hover:text-[#2D2926] text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-sm text-[#6A655C] space-y-3">
              <p>Assign access and trigger webhook license dispatch for <strong className="text-[#2D2926]">{grantAccessModalTester.name}</strong> ({grantAccessModalTester.email}).</p>
              
              <div>
                <label className="block text-xs font-mono uppercase text-[#5A5A40] mb-1 font-semibold">Select Target Software Suite</label>
                <select
                  value={selectedAppToGrant}
                  onChange={(e) => setSelectedAppToGrant(e.target.value as AppName)}
                  className="w-full px-3 py-2 rounded-lg bg-[#F9F7F2] border border-[#DCD5CA] text-sm text-[#2D2926] focus:outline-none focus:border-[#5A5A40]"
                >
                  {allApps.map(app => (
                    <option key={app} value={app} disabled={grantAccessModalTester.app_access_list.includes(app)}>
                      {app} {grantAccessModalTester.app_access_list.includes(app) ? '(Already Granted)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-lg bg-[#F5F1EB] p-3 border border-[#E5E0D8] text-xs font-mono text-[#5A5A40]">
                <span className="text-[#2D2926] font-bold block mb-1">Security & Webhook Automation:</span>
                • Generates cryptographically signed H.U.M.A.N. Protocol License Key<br/>
                • Sets up Stripe Connect micro-patronage routing<br/>
                • Dispatches welcome credential email
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E0D8]">
              <button
                onClick={() => setGrantAccessModalTester(null)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-[#6A655C] hover:bg-[#F5F1EB] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleGrantAccess(grantAccessModalTester, selectedAppToGrant)}
                disabled={actionLoadingId !== null}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#D67D5C] hover:bg-[#C4704F] text-white shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Key className="w-3.5 h-3.5 text-white" />
                <span>Confirm & Grant Access</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Email Preview Modal */}
      {emailModalTester && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D2926]/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-xl border border-[#E5E0D8] bg-[#FFFFFF] p-6 shadow-xl space-y-4 animate-scale-up text-[#2D2926]">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#5A5A40]" />
                <h3 className="font-semibold text-[#2D2926]">Welcome Email Template Preview</h3>
              </div>
              <button 
                onClick={() => setEmailModalTester(null)}
                className="text-[#8C857B] hover:text-[#2D2926] text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Email Container */}
            <div className="rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] p-5 font-mono text-xs text-[#2D2926] space-y-3">
              <div className="border-b border-[#E5E0D8] pb-2 space-y-1 text-[#6A655C]">
                <div><strong>To:</strong> {emailModalTester.name} &lt;{emailModalTester.email}&gt;</div>
                <div><strong>From:</strong> H.U.M.A.N. Protocol Onboarding &lt;access@human-network.org&gt;</div>
                <div><strong>Subject:</strong> Welcome to H.U.M.A.N. — Powering Ethical AI apps, And Paying the People</div>
              </div>

              <div className="space-y-3 font-sans text-sm text-[#2D2926]">
                <p>Hello <strong>{emailModalTester.name}</strong>,</p>
                <p className="text-[#5A5A40] leading-relaxed">
                  You have been successfully registered as a <strong>{emailModalTester.role}</strong> on the H.U.M.A.N. network (Powering Ethical AI apps, And Paying the People). Every time AI synthesizes code, music, art, or content utilizing open-source craft, 40% subscription royalties and micro-payments are streamed directly to your Stripe Connect account.
                </p>
                
                <div className="rounded-lg bg-[#FFFFFF] p-3.5 border border-[#E5E0D8] font-mono text-xs text-[#2D2926] space-y-1.5 shadow-2xs">
                  <div className="text-[#5A5A40] font-bold">Your Software Access Credentials:</div>
                  {emailModalTester.app_access_list.map(app => (
                    <div key={app} className="flex justify-between py-1 border-b border-[#F2ECE4]">
                      <span className="text-[#6A655C]">• {app}:</span>
                      <span className="text-[#2D2926] font-bold">{emailModalTester.license_keys?.[app] || 'HUMAN-GEN-ACTIVE-99'}</span>
                    </div>
                  ))}
                  <div className="pt-1 text-[#D67D5C]">
                    Stripe Sandbox ID: <strong>{emailModalTester.stripe_account_id}</strong>
                  </div>
                </div>

                <p className="text-xs text-[#6A655C]">
                  Ready to test? Embed our official H.U.M.A.N. Ethical Badge on your site to link the automated royalty negotiator.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-[#8C857B] font-mono">Automated trigger upon tester creation</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEmailModalTester(null)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-[#6A655C] hover:bg-[#F5F1EB] cursor-pointer"
                >
                  Close Preview
                </button>
                <button
                  onClick={() => {
                    showToast(`Dispatched test welcome email to ${emailModalTester.email}`, 'success');
                    setEmailModalTester(null);
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#D67D5C] hover:bg-[#C4704F] text-white flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                  <span>Send Live Email</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tester Detail Drawer */}
      {selectedTester && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-[#2D2926]/40 backdrop-blur-xs">
          <div className="w-full max-w-lg h-full bg-[#FFFFFF] border-l border-[#E5E0D8] p-6 overflow-y-auto space-y-6 shadow-2xl animate-slide-left text-[#2D2926]">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#EAE5DC] flex items-center justify-center text-sm font-bold text-[#5A5A40] border border-[#D4CCC1]">
                  {selectedTester.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-[#2D2926] text-base">{selectedTester.name}</h3>
                  <p className="text-xs text-[#6A655C] font-mono">{selectedTester.email}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedTester(null)}
                className="text-[#8C857B] hover:text-[#2D2926] text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Overview Card */}
            <div className="rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] p-4 space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#6A655C]">PLATFORM ROLE</span>
                <span className="px-2 py-0.5 rounded bg-[#F0F2EB] text-[#5A5A40] border border-[#C9D1BE]">
                  {selectedTester.role}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#6A655C]">STRIPE STATUS</span>
                <span className="text-[#5A5A40] font-bold">{selectedTester.current_subscription_status}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#6A655C]">STRIPE ACCOUNT</span>
                <span className="text-[#D67D5C] font-mono text-[11px]">{selectedTester.stripe_account_id}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#6A655C]">ROYALTIES (SAMPLE)</span>
                <span className="text-[#2D2926] font-bold text-sm">
                  ${selectedTester.total_royalties_received.toFixed(2)}
                  <span className="text-[10px] text-[#8C857B] font-normal ml-1">(test data)</span>
                </span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#6A655C]">JOINED DATE</span>
                <span className="text-[#2D2926]">{new Date(selectedTester.joined_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Active App Licenses */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase text-[#5A5A40] font-bold flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#5A5A40]" />
                Active Software Licenses & Tokens
              </h4>
              <div className="space-y-2">
                {selectedTester.app_access_list.map(app => (
                  <div key={app} className="rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-[#2D2926]">{app}</span>
                      <span className="text-[10px] font-mono text-[#5A5A40] bg-[#F0F2EB] px-1.5 py-0.5 rounded border border-[#C9D1BE]">
                        Active License
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-[#5A5A40] break-all bg-[#FFFFFF] p-1.5 rounded border border-[#E5E0D8]">
                      {selectedTester.license_keys?.[app] || `HUMAN-${app.substring(0,3).toUpperCase()}-9982-A`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Developer Notes */}
            {selectedTester.notes && (
              <div className="space-y-1">
                <h4 className="text-xs font-mono uppercase text-[#5A5A40] font-bold">Admin Notes</h4>
                <div className="rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] p-3 text-xs text-[#6A655C]">
                  {selectedTester.notes}
                </div>
              </div>
            )}

            {/* Action Bar inside Drawer */}
            <div className="pt-4 border-t border-[#E5E0D8] flex flex-col gap-2">
              <button
                onClick={() => {
                  setGrantAccessModalTester(selectedTester);
                }}
                className="w-full py-2.5 rounded-lg text-xs font-semibold bg-[#D67D5C] hover:bg-[#C4704F] text-white flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Grant Additional App Access</span>
              </button>

              <button
                onClick={() => handleResetStripeSandbox(selectedTester)}
                className="w-full py-2.5 rounded-lg text-xs font-medium bg-[#F5F1EB] hover:bg-[#EBE5DC] text-[#5A5A40] border border-[#DCD5CA] flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Stripe Sandbox Customer</span>
              </button>

              <button
                onClick={() => handleResendWelcomeEmail(selectedTester)}
                className="w-full py-2 rounded-lg text-xs font-medium text-[#6A655C] hover:text-[#2D2926] hover:bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Resend Credentials Email</span>
              </button>

              <button
                onClick={() => {
                  const headers = ['Tester ID', 'Full Name', 'Email Address', 'GitHub Handle', 'Role', 'App Access List', 'Subscription Status', 'Stripe Account ID', 'Total Royalties Received (USD)', 'Joined Date', 'Last Active', 'Welcome Email Sent', 'Notes'];
                  const escapeCSV = (val: any) => `"${String(val ?? '').replace(/"/g, '""')}"`;
                  const row = [
                    escapeCSV(selectedTester.id),
                    escapeCSV(selectedTester.name),
                    escapeCSV(selectedTester.email),
                    escapeCSV(selectedTester.github_handle || ''),
                    escapeCSV(selectedTester.role),
                    escapeCSV(selectedTester.app_access_list ? selectedTester.app_access_list.join('; ') : ''),
                    escapeCSV(selectedTester.current_subscription_status),
                    escapeCSV(selectedTester.stripe_account_id || ''),
                    escapeCSV(typeof selectedTester.total_royalties_received === 'number' ? selectedTester.total_royalties_received.toFixed(2) : '0.00'),
                    escapeCSV(selectedTester.joined_at || ''),
                    escapeCSV(selectedTester.last_active || ''),
                    escapeCSV(selectedTester.email_welcomed ? 'Yes' : 'No'),
                    escapeCSV(selectedTester.notes || '')
                  ].join(',');
                  const csv = [headers.join(','), row].join('\r\n');
                  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `tester_${selectedTester.name.toLowerCase().replace(/\s+/g, '_')}_record.csv`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                  showToast(`Exported ${selectedTester.name}'s record to CSV`, 'success');
                }}
                className="w-full py-2 rounded-lg text-xs font-medium text-[#5A5A40] hover:text-[#2D2926] hover:bg-[#F5F1EB] border border-[#DCD5CA] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#5A5A40]" />
                <span>Export This Tester (CSV)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
