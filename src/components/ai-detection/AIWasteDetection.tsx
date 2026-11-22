import React, { useState, useRef } from 'react';
import { useSystem } from '../../context/SystemContext';
import { WasteCategory, WasteItem, BinId } from '../../types';
import { SAMPLE_WASTE_ITEMS } from '../../data/mockData';
import {
  Upload,
  Camera,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Play,
  Sparkles,
  Info,
  RefreshCw,
  Search,
  Zap,
  ArrowRight
} from 'lucide-react';
import { playLaserScanSound, playSuccessChime } from '../../utils/audio';

export const AIWasteDetection: React.FC = () => {
  const { startSimulation, setActiveTab } = useSystem();

  const [previewImage, setPreviewImage] = useState<string>(SAMPLE_WASTE_ITEMS[2].sampleImageUrl);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [detectedResult, setDetectedResult] = useState<WasteItem | null>(SAMPLE_WASTE_ITEMS[2]);
  const [customUploaded, setCustomUploaded] = useState<boolean>(false);
  const [customFileName, setCustomFileName] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewImage(event.target.result as string);
          setCustomUploaded(true);
          setCustomFileName(file.name);
          setDetectedResult(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Run AI analysis
  const handleAnalyze = async () => {
    setAnalyzing(true);
    playLaserScanSound();

    await new Promise((r) => setTimeout(r, 1200));

    // If custom image, intelligently determine category from file name or pick plastic/dry
    let matchedItem: WasteItem;
    if (customUploaded && customFileName) {
      const lower = customFileName.toLowerCase();
      if (lower.includes('banana') || lower.includes('food') || lower.includes('apple') || lower.includes('fruit') || lower.includes('veg')) {
        matchedItem = SAMPLE_WASTE_ITEMS[0];
      } else if (lower.includes('bottle') || lower.includes('plastic') || lower.includes('cup')) {
        matchedItem = SAMPLE_WASTE_ITEMS[2];
      } else if (lower.includes('can') || lower.includes('metal') || lower.includes('tin') || lower.includes('aluminum')) {
        matchedItem = SAMPLE_WASTE_ITEMS[3];
      } else if (lower.includes('paper') || lower.includes('news') || lower.includes('book')) {
        matchedItem = SAMPLE_WASTE_ITEMS[4];
      } else if (lower.includes('battery') || lower.includes('hazard') || lower.includes('cell')) {
        matchedItem = SAMPLE_WASTE_ITEMS[6];
      } else {
        matchedItem = SAMPLE_WASTE_ITEMS[7];
      }
    } else {
      matchedItem = detectedResult || SAMPLE_WASTE_ITEMS[2];
    }

    setDetectedResult(matchedItem);
    setAnalyzing(false);
    playSuccessChime();
  };

  // Select sample from gallery
  const handleSelectSample = (item: WasteItem) => {
    setPreviewImage(item.sampleImageUrl);
    setDetectedResult(item);
    setCustomUploaded(false);
    setCustomFileName('');
  };

  // Route to simulator
  const handleDispatchToSorter = () => {
    if (detectedResult) {
      setActiveTab('simulator');
      startSimulation(detectedResult);
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-emerald-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
              EDGE VISION SUITE
            </span>
            <span className="text-xs text-slate-400 font-mono">
              TENSORFLOW LITE / MOBILENET-V2 SIMULATED RUNTIME
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-heading text-white mt-1">
            Autonomous AI Waste Classifier & Multi-Sensor Fusion
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Real-time inference combining visual feature vectors with physical capacitive & inductive verification
          </p>
        </div>

        {/* Academic Simulation Disclosure Badge */}
        <div className="px-3 py-1.5 rounded-lg bg-forest-900 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-emerald-400" />
          <span>Academic Evaluation Mode: Simulated Inference Engine</span>
        </div>
      </div>

      {/* Main Classifier Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Upload & Inspection Chamber (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-2xl border border-emerald-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-semibold text-white text-sm flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>Optical Inspection Viewport</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                1080p RGB SENSOR
              </span>
            </div>

            {/* Image Preview Canvas with Laser Scan Line */}
            <div className="relative w-full h-64 rounded-xl bg-forest-950 border-2 border-emerald-500/30 flex items-center justify-center overflow-hidden group shadow-inner">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Waste to inspect"
                  className="w-40 h-40 object-contain transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="text-center p-4">
                  <Upload className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-50" />
                  <p className="text-xs text-slate-400 font-mono">Upload an image or select a sample</p>
                </div>
              )}

              {/* Dynamic Scan Laser */}
              {analyzing && <div className="cyber-scan-laser" />}

              {/* Optical Reticle Crosshairs */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />

              {/* Status Overlay */}
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono bg-forest-950/80 px-2 py-1 rounded border border-forest-800">
                <span className="text-slate-400">FPS: 30.0</span>
                <span className="text-emerald-400">
                  {analyzing ? 'CONVOLUTION IN PROGRESS' : 'FRAME LOCKED'}
                </span>
              </div>
            </div>

            {/* Upload Button & Hidden Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-slate-200 border border-forest-700 text-xs font-mono flex items-center justify-center gap-2 transition"
              >
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>Upload Photo</span>
              </button>

              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-neon-glow transition disabled:opacity-50"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Analyze Waste</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-forest-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Model: MobileNetV2-Quantized</span>
            <span className="text-emerald-400">Latency: 18.2 ms</span>
          </div>
        </div>

        {/* Right Column: Classification Results & Multi-Sensor Fusion (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {detectedResult ? (
            <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-forest-800">
                <div className="flex items-center space-x-2">
                  <span className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                    <Cpu className="w-4 h-4" />
                  </span>
                  <h3 className="font-heading font-semibold text-white text-base">
                    AI Classification Telemetry Matrix
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
                  {detectedResult.confidence}% CONFIDENCE
                </span>
              </div>

              {/* Result Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                {/* Waste Category */}
                <div className="p-3.5 rounded-xl bg-forest-900/80 border border-emerald-950">
                  <span className="text-xs font-mono text-slate-400 uppercase block">
                    Predicted Category
                  </span>
                  <div className="text-xl font-bold font-heading text-emerald-300 mt-1 capitalize">
                    {detectedResult.category} Waste
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 mt-0.5 block">
                    Decomposition: {detectedResult.decompositionTime}
                  </span>
                </div>

                {/* Recommended Bin */}
                <div className="p-3.5 rounded-xl bg-forest-900/80 border border-emerald-950">
                  <span className="text-xs font-mono text-slate-400 uppercase block">
                    Recommended Disposal Bin
                  </span>
                  <div className="text-xl font-bold font-heading text-lime-300 mt-1 uppercase">
                    {detectedResult.targetBin} Bin
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 mt-0.5 block">
                    Actuator Chute Angle: {detectedResult.servoTargetAngle}°
                  </span>
                </div>
              </div>

              {/* Physical Sensor Cross-Check Breakdown */}
              <div className="p-4 rounded-xl bg-forest-950/80 border border-emerald-900/60 my-4">
                <span className="text-xs font-mono font-bold uppercase text-emerald-400 block mb-2">
                  Multi-Sensor Physical Verification Cross-Check:
                </span>
                <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-2 rounded bg-forest-900 border border-forest-800">
                    <span className="text-slate-400 block text-[10px]">Capacitive Moisture</span>
                    <strong className="text-teal-300 text-sm">
                      {detectedResult.sensors.moisturePercent}%
                    </strong>
                  </div>
                  <div className="p-2 rounded bg-forest-900 border border-forest-800">
                    <span className="text-slate-400 block text-[10px]">Inductive Metal</span>
                    <strong
                      className={`text-sm ${
                        detectedResult.sensors.inductiveMetal ? 'text-cyan-300' : 'text-slate-400'
                      }`}
                    >
                      {detectedResult.sensors.inductiveMetal ? 'ACTIVE (Metal)' : 'INACTIVE'}
                    </strong>
                  </div>
                  <div className="p-2 rounded bg-forest-900 border border-forest-800">
                    <span className="text-slate-400 block text-[10px]">Sharp IR Barrier</span>
                    <strong className="text-emerald-300 text-sm">DETECTED</strong>
                  </div>
                </div>
              </div>

              {/* Engineering Reasoning Explanation */}
              <div className="p-3.5 rounded-xl bg-forest-900/70 border border-emerald-500/20 text-xs font-mono text-slate-300 leading-relaxed mb-4">
                <strong className="text-emerald-400 block mb-1">Classification Rationale:</strong>
                {detectedResult.whyExplanation}
              </div>

              {/* Direct Action: Dispatch to Sorter */}
              <button
                onClick={handleDispatchToSorter}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-lime-400 hover:from-emerald-400 hover:to-lime-300 text-black font-bold font-mono text-xs flex items-center justify-center gap-2 shadow-neon-glow transition"
              >
                <span>Dispatch Item to Automated Sorter Mechanism</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-2xl border border-emerald-500/20 text-center flex flex-col items-center justify-center min-h-[320px]">
              <Search className="w-12 h-12 text-emerald-400/50 mb-3" />
              <h4 className="text-base font-semibold text-white">Awaiting Classification</h4>
              <p className="text-xs text-slate-400 font-mono mt-1 max-w-sm">
                Click "Analyze Waste" or choose an item from the academic test gallery below to evaluate neural network performance.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Gallery of Sample Waste Items for Exhibition Demonstrations */}
      <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-heading font-semibold text-white text-base">
              Academic Test Samples Gallery (8 Categories)
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Click any sample item to load into the AI inspection viewport and inspect simulated telemetry
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-1 rounded border border-emerald-500/30">
            Exhibition Quick-Test Dataset
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {SAMPLE_WASTE_ITEMS.map((item) => {
            const isCurrent = detectedResult?.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectSample(item)}
                className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all group ${
                  isCurrent
                    ? 'bg-emerald-950/90 border-emerald-400 ring-2 ring-emerald-500/40 shadow-neon-glow'
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
                  Conf: {item.confidence}%
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
