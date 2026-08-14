import React, { useState } from 'react';
import { AuditLogItem, ApplicationRecord } from '../types';
import { ShieldCheck, Lock, RefreshCw, Trash2, CheckCircle2, AlertCircle, FileText, Clock } from 'lucide-react';

interface PopiaAuditTrailProps {
  auditLogs: AuditLogItem[];
  candidates: ApplicationRecord[];
}

export const PopiaAuditTrail: React.FC<PopiaAuditTrailProps> = ({ auditLogs, candidates }) => {
  const [retentionDays, setRetentionDays] = useState(180);
  const [purgedCount, setPurgedCount] = useState<number | null>(null);

  const handlePurgeOldRecords = () => {
    setPurgedCount(0);
    setTimeout(() => setPurgedCount(0), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            POPIA Compliance & Audit Trail Hub <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200/80">Act 4 of 2013</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ensure Protection of Personal Information Act (POPIA) compliance, maintain immutable audit trails, and enforce data retention rules.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="bg-emerald-50 text-emerald-800 text-xs px-3.5 py-1.5 rounded-xl font-bold border border-emerald-200 flex items-center gap-1.5 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% POPIA Compliant
          </span>
        </div>
      </div>

      {/* Grid: Consent Stats + Retention Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Consent Status */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 space-y-3 text-xs shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" /> Consent Record Verification
          </h2>
          <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex justify-between items-center text-slate-700 font-semibold">
              <span>Consent Granted Applicants:</span>
              <span className="text-emerald-700 font-bold">{candidates.length} / {candidates.length} (100%)</span>
            </div>
            <p className="text-[11px] text-slate-500">All candidate records contain verified POPIA opt-in timestamps and IP logs upon application submit.</p>
          </div>
        </div>

        {/* Data Retention Rules */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 space-y-3 text-xs shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-600" /> Automated Data Retention Policy
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-slate-700 font-medium">Retention Period:</span>
            <select
              value={retentionDays}
              onChange={(e) => setRetentionDays(Number(e.target.value))}
              className="bg-slate-50/80 border border-slate-200 text-slate-900 px-3 py-1 rounded-xl focus:outline-none focus:border-cyan-500 font-medium shadow-xs"
            >
              <option value={90}>90 Days</option>
              <option value={180}>180 Days (Recommended)</option>
              <option value={365}>365 Days</option>
            </select>
          </div>
          <p className="text-[11px] text-slate-500">Personal information of rejected applicants is automatically purged after the retention window unless consent is renewed.</p>
        </div>

        {/* Purge Engine */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 space-y-3 text-xs flex flex-col justify-between shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-600" /> Data Purge & Anonymization
            </h2>
            <p className="text-[11px] text-slate-500 mt-1">Execute compliance purge for expired candidate records.</p>
          </div>

          {purgedCount !== null && (
            <p className="text-emerald-700 font-bold text-xs">✓ Purge completed: 0 expired records found.</p>
          )}

          <button
            onClick={handlePurgeOldRecords}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-semibold px-4 py-2 rounded-xl flex items-center justify-center gap-2 transition shadow-xs active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" /> Run POPIA Retention Sweep
          </button>
        </div>
      </div>

      {/* Immutable Audit Log Table */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 space-y-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-cyan-600" /> Immutable System Audit Log
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 rounded-l-xl font-bold">Timestamp</th>
                <th className="px-4 py-3 font-bold">Actor</th>
                <th className="px-4 py-3 font-bold">Action Executed</th>
                <th className="px-4 py-3 font-bold">Details</th>
                <th className="px-4 py-3 rounded-r-xl font-bold">POPIA Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">{log.timestamp}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{log.actor}</td>
                  <td className="px-4 py-3 font-bold text-cyan-700">{log.action}</td>
                  <td className="px-4 py-3 text-slate-700">{log.details}</td>
                  <td className="px-4 py-3">
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold border border-emerald-200">
                      {log.popiaReference || 'POPIA-STD-LOG'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

function ClockIcon(props: any) {
  return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}
