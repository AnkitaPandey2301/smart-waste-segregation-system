import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';
import { SystemAlert } from '../../types';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Info,
  Trash2,
  Filter,
  ShieldAlert,
  Radio,
  Clock,
  Sparkles
} from 'lucide-react';

export const AlertNotificationCenter: React.FC = () => {
  const { alerts, clearAlerts, addAlert } = useSystem();
  const [filterLevel, setFilterLevel] = useState<string>('all');

  const filteredAlerts = alerts.filter((a) => {
    if (filterLevel === 'all') return true;
    return a.level === filterLevel;
  });

  const handleTestAlert = () => {
    addAlert({
      level: 'warning',
      title: 'Manual Diagnostic Alert Triggered',
      message: 'Operator verified acoustic buzzer and telemetry notification pathway.',
      source: 'Control Room Console',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-emerald-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
              SAFETY FAULT INTERLOCKS
            </span>
            <span className="text-xs text-slate-400 font-mono">
              REAL-TIME FAULT DETECTION & DIAGNOSTIC (FDD)
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-heading text-white mt-1">
            Live Alert & Notification Dispatch Center
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Hierarchical priority logging for container levels, motor thermal thresholds, and sensor states
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={handleTestAlert}
            className="px-3.5 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-slate-200 border border-forest-700 text-xs font-mono font-semibold flex items-center gap-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Generate Test Alert</span>
          </button>

          <button
            onClick={clearAlerts}
            className="px-3.5 py-2 rounded-xl bg-forest-900 hover:bg-red-950/60 text-red-400 border border-red-500/30 text-xs font-mono font-semibold flex items-center gap-1.5 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-3.5 rounded-xl border border-emerald-500/20 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 text-xs font-mono">
          <Filter className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400 mr-2">Filter Priority:</span>
          {['all', 'critical', 'warning', 'info', 'success'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-2.5 py-1 rounded text-xs uppercase font-semibold transition ${
                filterLevel === lvl
                  ? 'bg-emerald-500 text-black shadow-neon-glow'
                  : 'text-slate-400 hover:text-white bg-forest-900/60'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-slate-400">
          Showing {filteredAlerts.length} of {alerts.length} alerts
        </span>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="glass-panel p-10 rounded-2xl border border-emerald-500/20 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400/60 mx-auto mb-2" />
            <h4 className="text-base font-semibold text-white">All Subsystems Nominal</h4>
            <p className="text-xs text-slate-400 font-mono mt-1">
              No active alerts matching the selected priority filter.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.level === 'critical';
            const isWarning = alert.level === 'warning';
            const isSuccess = alert.level === 'success';

            return (
              <div
                key={alert.id}
                className={`glass-panel p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all ${
                  isCritical
                    ? 'border-red-500/80 bg-red-950/20 shadow-danger-glow'
                    : isWarning
                    ? 'border-amber-500/60 bg-amber-950/20'
                    : isSuccess
                    ? 'border-emerald-500/40 bg-emerald-950/20'
                    : 'border-cyan-500/30 bg-forest-900/40'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div
                    className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                      isCritical
                        ? 'bg-red-500/20 text-red-400'
                        : isWarning
                        ? 'bg-amber-500/20 text-amber-400'
                        : isSuccess
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-cyan-500/20 text-cyan-400'
                    }`}
                  >
                    {isCritical ? (
                      <ShieldAlert className="w-5 h-5 animate-pulse" />
                    ) : isWarning ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : isSuccess ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Info className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold font-heading text-white">{alert.title}</h4>
                      <span
                        className={`text-[9px] font-mono font-bold uppercase px-2 py-0.2 rounded ${
                          isCritical
                            ? 'bg-red-500 text-black'
                            : isWarning
                            ? 'bg-amber-500 text-black'
                            : isSuccess
                            ? 'bg-emerald-500 text-black'
                            : 'bg-cyan-500 text-black'
                        }`}
                      >
                        {alert.level}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-mono mt-1 leading-relaxed">
                      {alert.message}
                    </p>
                    <div className="flex items-center space-x-3 text-[10px] font-mono text-slate-400 mt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {alert.timestamp}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Radio className="w-3 h-3 text-emerald-400" />
                        Source: {alert.source}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
