import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';
import { SimulatorStep, WasteItem, BinId } from '../../types';
import { SAMPLE_WASTE_ITEMS } from '../../data/mockData';
import {
  Play,
  RotateCcw,
  AlertTriangle,
  Square,
  Sparkles,
  Camera,
  Layers,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Radio,
  CheckCircle2,
  Sliders,
  Maximize2
} from 'lucide-react';

export const DigitalTwinSimulator: React.FC = () => {
  const {
    currentSimulatorStep,
    stepProgress,
    activeItem,
    telemetry,
    bins,
    systemStatus,
    isAutoDemoActive,
    startSimulation,
    startSystem,
    stopSystem,
    emergencyStop,
    resetSystem,
    toggleAutoDemo,
  } = useSystem();

  const [selectedSample, setSelectedSample] = useState<WasteItem>(SAMPLE_WASTE_ITEMS[0]);

  // Steps configuration
  const stepsList = [
    { step: SimulatorStep.WASTE_DETECTED, title: 'Step 1: Waste Detected', desc: 'Hopper IR Beam' },
    { step: SimulatorStep.CAMERA_SCANNING, title: 'Step 2: Camera Scan', desc: 'RGB AI Inspection' },
    { step: SimulatorStep.AI_CLASSIFYING, title: 'Step 3: AI Inference', desc: 'Neural Network Class' },
    { step: SimulatorStep.SENSOR_VERIFICATION, title: 'Step 4: Dual Verification', desc: 'Moisture + Inductive' },
    { step: SimulatorStep.ACTUATOR_ENGAGED, title: 'Step 5: Servo Mechanism', desc: 'Chute Angle Align' },
    { step: SimulatorStep.CONVEYOR_DISPATCH, title: 'Step 6: Bin Dispatch', desc: 'Target Bin Drop' },
    { step: SimulatorStep.COMPLETED, title: 'Step 7: Telemetry Updated', desc: 'Ultrasonic Log' },
  ];

  // Calculate waste item position on conveyor track based on step
  const getItemPositionPercent = () => {
    switch (currentSimulatorStep) {
      case SimulatorStep.IDLE:
        return 5;
      case SimulatorStep.WASTE_DETECTED:
        return 12;
      case SimulatorStep.CAMERA_SCANNING:
        return 38;
      case SimulatorStep.AI_CLASSIFYING:
        return 42;
      case SimulatorStep.SENSOR_VERIFICATION:
        return 58;
      case SimulatorStep.ACTUATOR_ENGAGED:
        return 74;
      case SimulatorStep.CONVEYOR_DISPATCH:
        return 88;
      case SimulatorStep.COMPLETED:
        return 92;
      default:
        return 5;
    }
  };

  const handleLaunchSample = (item: WasteItem) => {
    setSelectedSample(item);
    startSimulation(item);
  };

  return (
    <div className="space-y-6">
      {/* Simulation Header Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-emerald-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
              DIGITAL TWIN 2.0
            </span>
            <span className="text-xs text-slate-400 font-mono">
              REAL-TIME PHYSICAL ACTUATOR & SENSOR VISUALIZATION
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-heading text-white mt-1">
            Autonomous Waste Segregation Machine Simulator
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Physics kinematics simulation synchronized with real ESP32 / Arduino pinouts
          </p>
        </div>

        {/* Global Simulator Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {systemStatus === 'running' ? (
            <button
              onClick={stopSystem}
              className="px-3.5 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-amber-400 border border-amber-500/40 text-xs font-mono font-semibold flex items-center gap-1.5 transition"
            >
              <Square className="w-3.5 h-3.5" />
              <span>Pause Machine</span>
            </button>
          ) : (
            <button
              onClick={startSystem}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-semibold flex items-center gap-1.5 shadow-neon-glow transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Machine</span>
            </button>
          )}

          <button
            onClick={resetSystem}
            className="px-3.5 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-slate-300 border border-forest-700 text-xs font-mono font-semibold flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={toggleAutoDemo}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 border transition ${
              isAutoDemoActive
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white border-emerald-300 shadow-neon-glow animate-pulse'
                : 'bg-forest-900 text-emerald-400 border-emerald-500/30 hover:bg-forest-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAutoDemoActive ? 'Auto Loop Active' : 'Start Auto Loop'}</span>
          </button>

          <button
            onClick={emergencyStop}
            className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-danger-glow border border-red-400"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>E-STOP</span>
          </button>
        </div>
      </div>

      {/* 7-Step Process Progress Indicator Bar */}
      <div className="glass-panel p-4 rounded-xl border border-emerald-500/20 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between min-w-[700px] relative">
          {/* Progress bar line */}
          <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-forest-900 z-0">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-lime-400 transition-all duration-300"
              style={{
                width: `${
                  currentSimulatorStep === SimulatorStep.IDLE
                    ? 0
                    : ((currentSimulatorStep) / 7) * 100
                }%`,
              }}
            />
          </div>

          {stepsList.map((item, idx) => {
            const isPassed = currentSimulatorStep > item.step;
            const isCurrent = currentSimulatorStep === item.step;
            return (
              <div
                key={item.step}
                className="flex flex-col items-center text-center relative z-10 px-2"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-emerald-400 text-black ring-4 ring-emerald-500/30 scale-110 shadow-neon-glow'
                      : isPassed
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/50'
                      : 'bg-forest-900 text-slate-500 border border-forest-800'
                  }`}
                >
                  {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <span
                  className={`text-[11px] font-semibold mt-2 ${
                    isCurrent
                      ? 'text-emerald-300 font-bold'
                      : isPassed
                      ? 'text-slate-300'
                      : 'text-slate-500'
                  }`}
                >
                  {item.title}
                </span>
                <span className="text-[9px] font-mono text-slate-400">{item.desc}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Digital Twin Interactive Visualization Canvas */}
      <div className="glass-panel-glow p-6 rounded-3xl border border-emerald-500/30 relative overflow-hidden bg-forest-950">
        {/* Subtle grid and decorative background */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        {/* Machine Status Overlay Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-forest-800/80 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-3 w-3">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    currentSimulatorStep !== SimulatorStep.IDLE ? 'bg-emerald-400' : 'bg-teal-500'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 ${
                    currentSimulatorStep !== SimulatorStep.IDLE ? 'bg-emerald-500' : 'bg-teal-600'
                  }`}
                />
              </span>
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                {currentSimulatorStep === SimulatorStep.IDLE
                  ? 'STANDBY // READY FOR INTAKE'
                  : `PROCESSING ACTIVE // ${stepsList[currentSimulatorStep - 1]?.title.toUpperCase()}`}
              </span>
            </div>

            {activeItem && currentSimulatorStep !== SimulatorStep.IDLE && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-semibold">
                Item: {activeItem.name} ({activeItem.category.toUpperCase()})
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono">
            <span className="text-slate-400">
              Conveyor Motor:{' '}
              <strong className="text-emerald-400">
                {telemetry.conveyorRunning ? `${telemetry.conveyorSpeedRpm} RPM` : 'STOPPED'}
              </strong>
            </span>
            <span className="text-slate-400">
              Chute Angle: <strong className="text-lime-400">{telemetry.servoAngle}°</strong>
            </span>
          </div>
        </div>

        {/* MACHINE SCHEMATIC DIAGRAM: SVG / Digital Twin */}
        <div className="relative w-full h-[380px] bg-forest-950/90 rounded-2xl border border-emerald-900/50 p-4 overflow-hidden shadow-inner flex flex-col justify-between">
          {/* Top Sensors & Camera Banner */}
          <div className="grid grid-cols-4 gap-2 z-10">
            {/* Zone 1: Intake Hopper Sensor */}
            <div
              className={`p-2.5 rounded-xl border text-center transition-all ${
                currentSimulatorStep === SimulatorStep.WASTE_DETECTED
                  ? 'bg-amber-950/60 border-amber-400 shadow-lg shadow-amber-500/20'
                  : 'bg-forest-900/60 border-forest-800'
              }`}
            >
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                Intake Hopper (IR)
              </span>
              <span className="text-xs font-bold text-amber-300 font-mono">
                {telemetry.irSensorActive ? 'BEAM BROKEN' : 'STANDBY'}
              </span>
            </div>

            {/* Zone 2: AI Inspection Camera */}
            <div
              className={`p-2.5 rounded-xl border text-center transition-all relative ${
                currentSimulatorStep === SimulatorStep.CAMERA_SCANNING ||
                currentSimulatorStep === SimulatorStep.AI_CLASSIFYING
                  ? 'bg-emerald-950/60 border-emerald-400 shadow-neon-glow'
                  : 'bg-forest-900/60 border-forest-800'
              }`}
            >
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                AI Vision Core (ESP32-CAM)
              </span>
              <span className="text-xs font-bold text-emerald-300 font-mono">
                {currentSimulatorStep === SimulatorStep.CAMERA_SCANNING
                  ? 'SCANNING FRAME...'
                  : currentSimulatorStep === SimulatorStep.AI_CLASSIFYING
                  ? 'INFERENCE 98.4%'
                  : 'READY'}
              </span>
              {(currentSimulatorStep === SimulatorStep.CAMERA_SCANNING ||
                currentSimulatorStep === SimulatorStep.AI_CLASSIFYING) && (
                <div className="cyber-scan-laser" />
              )}
            </div>

            {/* Zone 3: Physical Sensor Verification */}
            <div
              className={`p-2.5 rounded-xl border text-center transition-all ${
                currentSimulatorStep === SimulatorStep.SENSOR_VERIFICATION
                  ? 'bg-teal-950/60 border-teal-400 shadow-lg shadow-teal-500/20'
                  : 'bg-forest-900/60 border-forest-800'
              }`}
            >
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                Moisture & Metal Probes
              </span>
              <span className="text-xs font-bold text-teal-300 font-mono">
                {telemetry.moistureValue}% H₂O | {telemetry.metalSensorActive ? 'METAL: YES' : 'METAL: NO'}
              </span>
            </div>

            {/* Zone 4: Servo Sorting Flapper */}
            <div
              className={`p-2.5 rounded-xl border text-center transition-all ${
                currentSimulatorStep === SimulatorStep.ACTUATOR_ENGAGED ||
                currentSimulatorStep === SimulatorStep.CONVEYOR_DISPATCH
                  ? 'bg-lime-950/60 border-lime-400 shadow-lg shadow-lime-500/20'
                  : 'bg-forest-900/60 border-forest-800'
              }`}
            >
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                Actuator Flapper Gate
              </span>
              <span className="text-xs font-bold text-lime-300 font-mono">
                MG996R @ {telemetry.servoAngle}°
              </span>
            </div>
          </div>

          {/* Central Track: Animated Conveyor Belt with Dynamic Item Travel */}
          <div className="relative my-4 h-28 flex items-center justify-center">
            {/* Hopper Chute on the left */}
            <div className="absolute left-2 top-0 bottom-6 w-16 bg-forest-900 border-2 border-emerald-500/30 rounded-lg flex flex-col items-center justify-center text-center z-10 shadow-lg">
              <span className="text-[9px] font-mono uppercase text-emerald-400 font-bold">
                FEED HOPPER
              </span>
              <div className="w-8 h-2 bg-emerald-500/40 rounded mt-1 animate-pulse" />
            </div>

            {/* The Conveyor Belt Structure */}
            <div className="absolute left-16 right-24 h-14 bg-forest-900/90 rounded-xl border border-emerald-500/40 shadow-inner flex items-center px-4 overflow-hidden">
              {/* Conveyor track treads */}
              <div
                className={`absolute inset-0 conveyor-belt-track ${
                  telemetry.conveyorRunning ? 'conveyor-belt-animated' : ''
                } opacity-40`}
              />

              {/* Inspection Chamber Archway */}
              <div className="absolute left-[34%] -top-2 -bottom-2 w-28 bg-emerald-950/80 border-2 border-emerald-400/80 rounded-lg backdrop-blur-md flex flex-col items-center justify-between p-1 z-10 shadow-neon-glow">
                <span className="text-[8px] font-mono text-emerald-300 font-bold tracking-widest">
                  AI SCAN CHAMBER
                </span>
                <Camera className="w-5 h-5 text-emerald-400 animate-pulse" />
                <span className="text-[8px] font-mono text-teal-300">DUAL SPECTRUM</span>
              </div>

              {/* Physical Sensor Check Zone Archway */}
              <div className="absolute left-[62%] -top-2 -bottom-2 w-24 bg-teal-950/80 border-2 border-teal-400/70 rounded-lg backdrop-blur-md flex flex-col items-center justify-between p-1 z-10 shadow-lg">
                <span className="text-[8px] font-mono text-teal-300 font-bold tracking-widest">
                  SENSOR PROBE
                </span>
                <Radio className="w-5 h-5 text-teal-400" />
                <span className="text-[8px] font-mono text-teal-300">MOISTURE/METAL</span>
              </div>

              {/* Moving Waste Item on Conveyor */}
              <div
                className="absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-out z-20 flex flex-col items-center"
                style={{ left: `${getItemPositionPercent()}%` }}
              >
                <div
                  className={`p-2 rounded-xl bg-forest-950 border-2 flex items-center justify-center shadow-xl transition-all ${
                    currentSimulatorStep === SimulatorStep.CAMERA_SCANNING
                      ? 'ring-4 ring-emerald-400 scale-125 border-emerald-300 animate-pulse'
                      : currentSimulatorStep === SimulatorStep.AI_CLASSIFYING
                      ? 'ring-4 ring-lime-400 scale-125 border-lime-300'
                      : currentSimulatorStep === SimulatorStep.SENSOR_VERIFICATION
                      ? 'ring-4 ring-teal-400 scale-125 border-teal-300'
                      : 'border-emerald-500/50 scale-100'
                  }`}
                >
                  <img
                    src={activeItem?.sampleImageUrl || selectedSample.sampleImageUrl}
                    alt="Current Waste"
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <span className="text-[9px] font-mono font-bold bg-forest-950/90 text-white px-1.5 py-0.5 rounded border border-emerald-500/40 mt-1 shadow whitespace-nowrap">
                  {activeItem?.name || selectedSample.name}
                </span>
              </div>
            </div>

            {/* Sorting Flapper Mechanism Gate on the right */}
            <div className="absolute right-2 top-0 bottom-4 w-20 bg-forest-900 border-2 border-emerald-500/40 rounded-xl flex flex-col items-center justify-between p-1.5 z-10 shadow-lg">
              <span className="text-[8px] font-mono uppercase text-lime-400 font-bold">
                SERVO CHUTE
              </span>
              {/* Dynamic Gate Flap with Rotation Transform */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div
                  className="w-10 h-2.5 bg-gradient-to-r from-lime-400 to-emerald-500 rounded-full shadow-neon-glow transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `rotate(${telemetry.servoAngle}deg)`,
                  }}
                />
                <div className="absolute w-3.5 h-3.5 rounded-full bg-forest-950 border-2 border-white" />
              </div>
              <span className="text-[9px] font-mono font-bold text-lime-300">
                {telemetry.servoAngle}°
              </span>
            </div>
          </div>

          {/* Bottom Destination Bins (Target Bins Receiving Item) */}
          <div className="grid grid-cols-5 gap-2 z-10 pt-2 border-t border-forest-800">
            {bins.map((bin) => {
              const isTarget = activeItem?.targetBin === bin.id && currentSimulatorStep >= SimulatorStep.ACTUATOR_ENGAGED;
              return (
                <div
                  key={bin.id}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-between text-center transition-all ${
                    isTarget
                      ? 'bg-emerald-950/90 border-emerald-400 ring-2 ring-emerald-400 shadow-neon-glow scale-105'
                      : 'bg-forest-900/60 border-forest-800'
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: bin.accentHex }}
                    />
                    <span className="text-[10px] font-mono font-bold text-slate-300 uppercase truncate">
                      {bin.name.split(' ')[0]}
                    </span>
                  </div>

                  {/* Bin Fill Bar */}
                  <div className="w-full bg-forest-950 h-2 rounded-full overflow-hidden my-1 border border-forest-800">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${bin.fillPercentage}%`,
                        backgroundColor: bin.accentHex,
                      }}
                    />
                  </div>

                  <span className="text-[9px] font-mono text-slate-400">
                    {bin.fillPercentage}% ({bin.currentDistanceCm}cm)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Step Explanation Card */}
        {activeItem && currentSimulatorStep !== SimulatorStep.IDLE && (
          <div className="mt-4 p-4 rounded-xl bg-forest-900/90 border border-emerald-500/40 font-mono text-xs text-slate-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
            <div>
              <span className="text-emerald-400 font-bold uppercase tracking-wider block mb-1">
                Active Telemetry & Decision Engine Log:
              </span>
              <p className="text-slate-200">{activeItem.whyExplanation}</p>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <span className="px-2 py-1 rounded bg-forest-950 border border-emerald-500/30 text-emerald-300 font-bold">
                Target: {activeItem.targetBin.toUpperCase()}
              </span>
              <span className="px-2 py-1 rounded bg-forest-950 border border-lime-500/30 text-lime-300 font-bold">
                Servo: {activeItem.servoTargetAngle}°
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Manual Waste Injection & Gallery Selector */}
      <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-heading font-semibold text-white text-base">
              Interactive Waste Sample Injector
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Select any standardized waste prototype item to initiate automated classification and sorting sequence
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-1 rounded border border-emerald-500/30">
            {SAMPLE_WASTE_ITEMS.length} Pre-Loaded Academic Test Samples
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {SAMPLE_WASTE_ITEMS.map((item) => {
            const isSelected = selectedSample.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleLaunchSample(item)}
                className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all group ${
                  isSelected
                    ? 'bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-500/40 shadow-neon-glow'
                    : 'bg-forest-900/60 border-forest-800 hover:border-emerald-500/40 hover:bg-forest-900'
                }`}
              >
                <div className="w-12 h-12 rounded-lg bg-forest-950 p-1 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                  <img
                    src={item.sampleImageUrl}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xs font-semibold text-white truncate w-full">
                  {item.name}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 uppercase mt-0.5">
                  {item.category}
                </span>
                <span className="text-[9px] font-mono text-slate-400 mt-1">
                  ~{item.weightGrams}g
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
