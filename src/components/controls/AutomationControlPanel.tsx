import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';
import { BinId } from '../../types';
import {
  Sliders,
  Play,
  Square,
  RotateCcw,
  AlertTriangle,
  Zap,
  Activity,
  Cpu,
  CheckCircle2,
  Settings,
  Radio
} from 'lucide-react';

export const AutomationControlPanel: React.FC = () => {
  const {
    operationalMode,
    setOperationalMode,
    systemStatus,
    telemetry,
    startSystem,
    stopSystem,
    emergencyStop,
    resetSystem,
    manualChuteSort,
    testSensor,
  } = useSystem();

  const [manualTargetBin, setManualTargetBin] = useState<BinId>('plastic');
  const [manualAngle, setManualAngle] = useState<number>(0);

  const binAngleMap: Record<BinId, number> = {
    organic: -45,
    plastic: -20,
    paper: 0,
    metal: 25,
    dry: 45,
  };

  const handleManualBinSelect = (bin: BinId) => {
    setManualTargetBin(bin);
    const angle = binAngleMap[bin];
    setManualAngle(angle);
    manualChuteSort(bin, angle);
  };

  return (
    <div className="space-y-6">
      {/* Control Header */}
      <div className="glass-panel p-5 rounded-2xl border border-emerald-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
              ACTUATOR OVERRIDE CONSOLE
            </span>
            <span className="text-xs text-slate-400 font-mono">
              DIRECT MOTOR H-BRIDGE & SERVO DRIVER INTERFACE
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-heading text-white mt-1">
            Automation & Engineering Control Panel
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Switch between fully autonomous AI orchestration and manual engineering jog commands
          </p>
        </div>

        {/* Mode Selector Pill */}
        <div className="flex items-center p-1 rounded-xl bg-forest-900 border border-emerald-500/30 text-xs font-mono">
          <button
            onClick={() => setOperationalMode('auto')}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              operationalMode === 'auto'
                ? 'bg-emerald-500 text-black shadow-neon-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            AUTO MODE
          </button>
          <button
            onClick={() => setOperationalMode('manual')}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              operationalMode === 'manual'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            MANUAL OVERRIDE
          </button>
        </div>
      </div>

      {/* Main Grid: Machine Safety & Conveyor Motor Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Machine Operational State & Emergency Circuit */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-white text-base flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Machine Power & Interlocks</span>
            </h3>
            <span
              className={`px-2.5 py-0.5 rounded font-mono text-[10px] uppercase font-bold ${
                systemStatus === 'running'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-red-500/20 text-red-300 border border-red-500/40'
              }`}
            >
              STATE: {systemStatus.replace('_', ' ')}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {systemStatus === 'running' ? (
              <button
                onClick={stopSystem}
                className="p-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold flex flex-col items-center justify-center gap-1.5 transition"
              >
                <Square className="w-5 h-5" />
                <span>Pause Conveyor</span>
              </button>
            ) : (
              <button
                onClick={startSystem}
                className="p-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold flex flex-col items-center justify-center gap-1.5 shadow-neon-glow transition"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Start Machine</span>
              </button>
            )}

            <button
              onClick={resetSystem}
              className="p-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-slate-200 border border-forest-700 text-xs font-mono font-bold flex flex-col items-center justify-center gap-1.5 transition"
            >
              <RotateCcw className="w-5 h-5 text-emerald-400" />
              <span>Reset Interlocks</span>
            </button>

            <button
              onClick={emergencyStop}
              className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold flex flex-col items-center justify-center gap-1.5 shadow-danger-glow border border-red-400 transition"
            >
              <AlertTriangle className="w-5 h-5" />
              <span>KILL POWER (E-STOP)</span>
            </button>
          </div>

          <div className="p-3 rounded-xl bg-forest-950/80 border border-forest-800 text-xs font-mono text-slate-400">
            Current Status: Microcontroller main loop executing at 1000Hz (FreeRTOS Dual-Tasking: Core 0 MQTT & Sensor Poll, Core 1 Kinematic Servo Control).
          </div>
        </div>

        {/* Manual Servo Flap Positioner */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-white text-base flex items-center gap-2">
              <Sliders className="w-4 h-4 text-lime-400" />
              <span>Servo Angle Actuation (Chute Positioner)</span>
            </h3>
            <span className="text-xs font-mono font-bold text-lime-300">
              Current: {telemetry.servoAngle}°
            </span>
          </div>

          <p className="text-xs text-slate-400 font-mono">
            Click any target bin to rotate the high-torque servo flap to its calibrated mechanical angle:
          </p>

          <div className="grid grid-cols-5 gap-2">
            {(['organic', 'plastic', 'paper', 'metal', 'dry'] as BinId[]).map((b) => {
              const isSelected = manualTargetBin === b;
              const angle = binAngleMap[b];
              return (
                <button
                  key={b}
                  onClick={() => handleManualBinSelect(b)}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    isSelected
                      ? 'bg-lime-950/80 border-lime-400 ring-2 ring-lime-500/30 text-lime-300'
                      : 'bg-forest-900/60 border-forest-800 text-slate-300 hover:border-emerald-500/40'
                  }`}
                >
                  <span className="text-[10px] font-mono uppercase block font-bold truncate">
                    {b}
                  </span>
                  <span className="text-xs font-mono font-bold mt-1 block">{angle}°</span>
                </button>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-forest-950/80 border border-forest-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Mechanical Angle Range: -45° to +45°</span>
            <span className="text-lime-400">PWM Pulse: 1500µs ± 500µs</span>
          </div>
        </div>
      </div>

      {/* Sensor Calibration & Diagnostic Suite */}
      <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20">
        <h3 className="font-heading font-semibold text-white text-base mb-2 flex items-center gap-2">
          <Radio className="w-4 h-4 text-emerald-400" />
          <span>Hardware Self-Test & Diagnostic Ping Routines</span>
        </h3>
        <p className="text-xs text-slate-400 font-mono mb-4">
          Send diagnostic test pulses to isolated GPIO hardware pins to verify sensor calibration
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => testSensor('ir')}
            className="p-3 rounded-xl bg-forest-900/80 hover:bg-forest-800 border border-forest-700 text-left transition flex items-center justify-between group"
          >
            <div>
              <span className="text-xs font-bold text-white block">Test IR Barrier</span>
              <span className="text-[10px] font-mono text-slate-400">GPIO 18 Interrupt</span>
            </div>
            <Zap className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
          </button>

          <button
            onClick={() => testSensor('metal')}
            className="p-3 rounded-xl bg-forest-900/80 hover:bg-forest-800 border border-forest-700 text-left transition flex items-center justify-between group"
          >
            <div>
              <span className="text-xs font-bold text-white block">Test Inductive Sensor</span>
              <span className="text-[10px] font-mono text-slate-400">GPIO 23 Eddy Probe</span>
            </div>
            <Zap className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
          </button>

          <button
            onClick={() => testSensor('moisture')}
            className="p-3 rounded-xl bg-forest-900/80 hover:bg-forest-800 border border-forest-700 text-left transition flex items-center justify-between group"
          >
            <div>
              <span className="text-xs font-bold text-white block">Test Moisture ADC</span>
              <span className="text-[10px] font-mono text-slate-400">12-bit ADC1 Reading</span>
            </div>
            <Zap className="w-4 h-4 text-teal-400 group-hover:scale-110 transition" />
          </button>

          <button
            onClick={() => testSensor('ultrasonic')}
            className="p-3 rounded-xl bg-forest-900/80 hover:bg-forest-800 border border-forest-700 text-left transition flex items-center justify-between group"
          >
            <div>
              <span className="text-xs font-bold text-white block">Test Sonar Sweep</span>
              <span className="text-[10px] font-mono text-slate-400">HC-SR04 Echo Ping</span>
            </div>
            <Zap className="w-4 h-4 text-lime-400 group-hover:scale-110 transition" />
          </button>
        </div>
      </div>
    </div>
  );
};
