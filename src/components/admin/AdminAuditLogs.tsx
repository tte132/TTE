import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, Filter, Download, Terminal, Clock, RefreshCw } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { AuditLog } from '../../types/admin';

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>(adminService.getAuditLogs());
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLogs(adminService.getAuditLogs());
    const unsub = adminService.subscribeToAuditLogs((newLog) => {
      setLogs((prev) => [newLog, ...prev]);
    });
    return unsub;
  }, []);

  const filteredLogs = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.target.toLowerCase().includes(search.toLowerCase()) ||
      l.adminEmail.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportCSV = () => {
    const headers = 'ID,Timestamp,AdminEmail,Action,Target,PreviousValue,NewValue,IP\n';
    const rows = logs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.adminEmail}","${l.action}","${l.target}","${(l.previousValue || '').replace(/"/g, '""')}","${(l.newValue || '').replace(/"/g, '""')}","${l.ipAddress || ''}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tte_audit_logs_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-black text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <span>Immutable Security Audit Logs</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tamper-proof append-only registry recording administrative logins, balance actions, and settings alterations
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Trail (CSV)</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-[#080f21] rounded-2xl border border-slate-800 p-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action type, target entity, or admin email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#040814] border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-[#080f21] rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#040814] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Admin</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Record</th>
                <th className="py-3 px-4">Recorded Change</th>
                <th className="py-3 px-4">Source IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/40">
                  <td className="py-3 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-amber-300 font-medium">
                    {log.adminEmail}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-white font-sans font-semibold">
                    {log.target}
                  </td>
                  <td className="py-3 px-4 text-slate-300 text-[11px] max-w-xs truncate font-sans">
                    {log.newValue || log.previousValue || '—'}
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">
                    {log.ipAddress || '127.0.0.1'}
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
