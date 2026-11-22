import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';
import { ActivityLogItem, WasteCategory } from '../../types';
import {
  FileText,
  Search,
  Filter,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Layers
} from 'lucide-react';

export const ActivityLog: React.FC = () => {
  const { logs, clearLogs } = useSystem();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredLogs = logs.filter((item) => {
    const matchesSearch =
      item.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus =
      statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = 'ID,Timestamp,Event Name,Category,Details,Bin ID,Confidence,Status\n';
    const rows = logs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.eventName}","${l.category}","${l.details.replace(
            /"/g,
            '""'
          )}","${l.binId || ''}","${l.confidence || ''}","${l.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `smart_waste_activity_log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-emerald-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
              AUDIT TRAIL & TELEMETRY RECORDER
            </span>
            <span className="text-xs text-slate-400 font-mono">
              CYCLIC BUFFER // NON-VOLATILE LOGGING
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-heading text-white mt-1">
            Real-Time Engineering Activity Log
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Cryptographically timestamped telemetry events for academic evaluation and exhibition audits
          </p>
        </div>

        {/* Global Log Actions */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-slate-200 border border-emerald-500/30 text-xs font-mono font-semibold flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={clearLogs}
            className="px-3.5 py-2 rounded-xl bg-forest-900 hover:bg-red-950/60 text-red-400 border border-red-500/30 text-xs font-mono font-semibold flex items-center gap-1.5 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Logs</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel p-4 rounded-xl border border-emerald-500/20 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs font-mono">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, items, or actuator actions..."
            className="w-full bg-forest-950 border border-forest-800 rounded-lg pl-9 pr-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-forest-950 border border-forest-800 text-slate-300 rounded-lg px-2.5 py-2 focus:outline-none focus:border-emerald-500 uppercase"
          >
            <option value="all">All Streams</option>
            <option value="organic">Organic</option>
            <option value="plastic">Plastic</option>
            <option value="paper">Paper</option>
            <option value="metal">Metal</option>
            <option value="dry">Dry</option>
            <option value="system">System Core</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-forest-950 border border-forest-800 text-slate-300 rounded-lg px-2.5 py-2 focus:outline-none focus:border-emerald-500 uppercase"
          >
            <option value="all">All Statuses</option>
            <option value="success">Success</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>
      </div>

      {/* Logs Table / Stream */}
      <div className="glass-panel rounded-2xl border border-emerald-500/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-forest-900/90 text-slate-400 border-b border-forest-800">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Event Description</th>
                <th className="py-3 px-4">Stream / Category</th>
                <th className="py-3 px-4">Target Bin</th>
                <th className="py-3 px-4">Details & Actuator Telemetry</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-900">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No activity logs found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-forest-900/50 transition-colors"
                    >
                      <td className="py-3 px-4 whitespace-nowrap text-slate-400">
                        {log.timestamp}
                      </td>
                      <td className="py-3 px-4 font-semibold text-white whitespace-nowrap">
                        {log.eventName}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-forest-950 border border-forest-800 uppercase text-emerald-400 text-[10px]">
                          {log.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap uppercase text-slate-300">
                        {log.binId ? `${log.binId} Bin` : '—'}
                      </td>
                      <td className="py-3 px-4 text-slate-300 max-w-md">
                        {log.details}
                        {log.confidence && (
                          <span className="text-emerald-400 font-bold ml-1.5">
                            ({log.confidence}% Conf)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            log.status === 'success'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : log.status === 'warning'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : log.status === 'error'
                              ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
