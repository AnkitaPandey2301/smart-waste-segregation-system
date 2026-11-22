import React from 'react';
import { useSystem } from '../../context/SystemContext';
import { SmartBin, BinId } from '../../types';
import {
  Trash2,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Radio,
  Layers,
  ArrowDownCircle,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export const SmartBinMonitoring: React.FC = () => {
  const { bins, emptyBin, addAlert } = useSystem();

  const handleEmptyAll = () => {
    bins.forEach((b) => emptyBin(b.id));
    addAlert({
      level: 'success',
      title: 'All Bins Emptied',
      message: 'Maintenance team cleared and re-calibrated all 5 smart collection bins.',
      source: 'Bin Operations',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-emerald-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
              CONTAINMENT TELEMETRY
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ULTRASONIC HC-SR04 TIME-OF-FLIGHT ARRAY
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-heading text-white mt-1">
            Smart Waste Bins Real-Time Monitoring & Interlocks
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Automatic overflow protection: 80% trigger activates warning, 100% locks feeder gate
          </p>
        </div>

        {/* Global Action Button */}
        <button
          onClick={handleEmptyAll}
          className="px-4 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-slate-200 border border-emerald-500/30 text-xs font-mono font-semibold flex items-center gap-2 transition"
        >
          <RotateCcw className="w-4 h-4 text-emerald-400" />
          <span>Empty & Calibrate All Bins</span>
        </button>
      </div>

      {/* 5 Smart Bins Detailed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        {bins.map((bin) => {
          const isWarning = bin.fillPercentage >= 80 && bin.fillPercentage < 100;
          const isFull = bin.fillPercentage >= 100;

          return (
            <div
              key={bin.id}
              className={`glass-panel p-5 rounded-2xl border flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                isFull
                  ? 'border-red-500/80 shadow-danger-glow bg-red-950/20'
                  : isWarning
                  ? 'border-amber-500/60 shadow-lg shadow-amber-500/15 bg-amber-950/15'
                  : 'border-emerald-500/25 hover:border-emerald-500/50'
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-slate-400">
                    BIN #{bin.id.toUpperCase()}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                      isFull
                        ? 'bg-red-500 text-white animate-pulse'
                        : isWarning
                        ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}
                  >
                    {isFull ? 'CRITICAL FULL' : isWarning ? '80% WARNING' : 'NORMAL'}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-white text-base mt-1 truncate">
                  {bin.name}
                </h3>

                {/* Ultrasonic Sensor Info */}
                <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-400 mt-1">
                  <Radio className="w-3.5 h-3.5 text-emerald-400" />
                  <span>HC-SR04:</span>
                  <strong className="text-slate-200">{bin.currentDistanceCm} cm</strong>
                </div>
              </div>

              {/* Animated 3D-Styled Bin Level Graphic */}
              <div className="my-5 relative w-full h-44 rounded-xl bg-forest-950 border-2 border-forest-800 p-2 flex flex-col justify-end overflow-hidden shadow-inner">
                {/* Ultrasonic wave animation at the top */}
                <div className="absolute top-2 left-0 right-0 flex justify-center items-center">
                  <span className="text-[9px] font-mono text-emerald-400/80 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Sonar Pulse: {bin.currentDistanceCm}cm to surface
                  </span>
                </div>

                {/* Fill percentage text badge in center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                  <span className="text-3xl font-extrabold font-heading text-white drop-shadow-md">
                    {bin.fillPercentage}%
                  </span>
                  <span className="text-[10px] font-mono text-slate-300 drop-shadow">
                    {bin.currentWeightKg.toFixed(1)} / {bin.capacityKg} kg
                  </span>
                </div>

                {/* Fluid / Solid Fill Level */}
                <div
                  className="w-full rounded-lg transition-all duration-700 ease-out relative"
                  style={{
                    height: `${Math.max(4, bin.fillPercentage)}%`,
                    backgroundColor: isFull ? '#ef4444' : isWarning ? '#f59e0b' : bin.accentHex,
                    opacity: 0.75,
                  }}
                >
                  {/* Subtle surface wave or gloss */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/40 rounded-t" />
                </div>
              </div>

              {/* Bin Telemetry Metrics */}
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Total Items:</span>
                  <span className="font-bold">{bin.totalItemsCount} units</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Net Mass:</span>
                  <span className="font-bold">{bin.currentWeightKg.toFixed(1)} kg</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Last Cleared:</span>
                  <span className="text-slate-400 text-[10px]">{bin.lastEmptied}</span>
                </div>
              </div>

              {/* Action Button: Empty Bin */}
              <button
                onClick={() => emptyBin(bin.id)}
                className={`mt-4 w-full py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition ${
                  isFull
                    ? 'bg-red-500 hover:bg-red-400 text-black shadow-lg shadow-red-500/30 animate-pulse'
                    : isWarning
                    ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                    : 'bg-forest-900 hover:bg-forest-800 text-emerald-400 border border-forest-700'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isFull ? 'Clear Full Bin (Reset)' : 'Empty Bin'}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Ultrasonic Sensor Calculation & Formula Card */}
      <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 text-xs font-mono text-slate-300">
        <h4 className="text-sm font-bold font-heading text-white mb-2 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Ultrasonic Time-of-Flight (ToF) Mathematical Conversion Logic</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          <div className="p-3 rounded-xl bg-forest-950/80 border border-forest-800">
            <span className="text-emerald-400 font-bold block mb-1">
              1. Distance Calculation:
            </span>
            <code>Distance (cm) = (Echo Time in µs × 0.0343) / 2</code>
            <p className="text-slate-400 text-[11px] mt-1">
              Calibrated for dry air at 25°C (speed of sound = 343 m/s).
            </p>
          </div>

          <div className="p-3 rounded-xl bg-forest-950/80 border border-forest-800">
            <span className="text-emerald-400 font-bold block mb-1">
              2. Fill Percentage Formula:
            </span>
            <code>Fill% = ((MaxDepth - Distance) / MaxDepth) × 100</code>
            <p className="text-slate-400 text-[11px] mt-1">
              Container total depth = 60cm. Margin threshold = 5cm.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-forest-950/80 border border-forest-800">
            <span className="text-emerald-400 font-bold block mb-1">
              3. Automatic Safety Interlock:
            </span>
            <code>if (Fill &gt;= 80%) WARN; if (Fill &gt;= 100%) LOCK_SERVO();</code>
            <p className="text-slate-400 text-[11px] mt-1">
              Feeder halts and routes excess waste to secondary overflow bay.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
