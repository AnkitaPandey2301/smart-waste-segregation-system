import React from 'react';
import { useSystem } from '../../context/SystemContext';
import {
  Activity,
  AlertTriangle,
  Play,
  Square,
  RotateCcw,
  Volume2,
  VolumeX,
  Wifi,
  Cpu,
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    systemStatus,
    operationalMode,
    isAutoDemoActive,
    soundEnabled,
    alerts,
    telemetry,
    toggleSound,
    toggleAutoDemo,
    startSystem,
    stopSystem,
    emergencyStop,
    resetSystem,
    setOperationalMode,
  } = useSystem();

  const unreadAlerts = alerts.filter((a) => !a.read).length;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-emerald-500/20 bg-forest-950/90 backdrop-blur-xl px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Project Metadata */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-700 flex items-center justify-center shadow-neon-glow">
              <Zap className="w-6 h-6 text-black fill-current animate-pulse" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-forest-950 animate-ping" />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-forest-950" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-heading tracking-wider bg-gradient-to-r from-emerald-400 via-teal-300 to-lime-300 bg-clip-text text-transparent">
                ECO-SORT AIoT
              </h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                v2.4 PROTOTYPE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono tracking-tight hidden sm:block">
              SMART WASTE SEGREGATION SYSTEM USING IoT & AUTOMATION // B.TECH CAPSTONE
            </p>
          </div>
        </div>

        {/* Live System Diagnostics Quick Bar */}
        <div className="hidden lg:flex items-center space-x-4 px-3 py-1.5 rounded-lg bg-forest-900/80 border border-emerald-900/60 font-mono text-xs">
          <div className="flex items-center space-x-1.5 text-emerald-400">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span>ESP32 Wi-Fi:</span>
            <span className="font-semibold text-slate-200">{telemetry.wifiRssi} dBm</span>
          </div>
          <span className="text-emerald-900">|</span>
          <div className="flex items-center space-x-1.5 text-teal-400">
            <Cpu className="w-3.5 h-3.5 text-teal-400" />
            <span>Core Temp:</span>
            <span className="font-semibold text-slate-200">{telemetry.esp32TempC}°C</span>
          </div>
          <span className="text-emerald-900">|</span>
          <div className="flex items-center space-x-1.5 text-cyan-400">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>MQTT Rate:</span>
            <span className="font-semibold text-slate-200">{telemetry.mqttPacketsSec} msg/s</span>
          </div>
        </div>

        {/* Global Controls & Mode Switch */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Mode Pill Toggle */}
          <div className="flex items-center p-1 rounded-lg bg-forest-900/90 border border-emerald-500/20 text-xs font-mono">
            <button
              onClick={() => setOperationalMode('auto')}
              className={`px-2.5 py-1 rounded transition-all font-semibold ${
                operationalMode === 'auto'
                  ? 'bg-emerald-500 text-black shadow-neon-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              AUTO
            </button>
            <button
              onClick={() => setOperationalMode('manual')}
              className={`px-2.5 py-1 rounded transition-all font-semibold ${
                operationalMode === 'manual'
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              MANUAL
            </button>
          </div>

          {/* Exhibition Auto Demo Mode Button */}
          <button
            onClick={toggleAutoDemo}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all border ${
              isAutoDemoActive
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white border-emerald-300 shadow-neon-glow animate-pulse'
                : 'bg-forest-900/80 hover:bg-forest-800 text-emerald-400 border-emerald-500/30'
            }`}
            title="Auto-runs segregation loop with random waste items for college exhibition demonstration"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAutoDemoActive ? 'DEMO RUNNING' : 'START DEMO'}</span>
          </button>

          {/* Audio Synthesizer Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-lg bg-forest-900 border border-emerald-500/30 text-emerald-400 hover:bg-forest-800 transition"
            title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Emergency Stop / System Controls */}
          {systemStatus === 'emergency_stop' ? (
            <button
              onClick={resetSystem}
              className="px-3 py-1.5 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-bold font-mono text-xs flex items-center gap-1.5 shadow-lg shadow-yellow-500/30 animate-bounce"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              RESET E-STOP
            </button>
          ) : (
            <button
              onClick={emergencyStop}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold font-mono text-xs flex items-center gap-1.5 shadow-danger-glow border border-red-400/50"
              title="Kill power to all conveyor motors and servos instantly"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              E-STOP
            </button>
          )}

          {/* System Power Toggle */}
          {systemStatus === 'running' ? (
            <button
              onClick={stopSystem}
              className="p-2 rounded-lg bg-forest-900 hover:bg-red-950/60 text-red-400 border border-red-500/30 transition"
              title="Pause System"
            >
              <Square className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={startSystem}
              className="p-2 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 text-emerald-400 border border-emerald-500/40 transition"
              title="Start System"
            >
              <Play className="w-4 h-4 fill-current" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
