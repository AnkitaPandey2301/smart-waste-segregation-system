import React from 'react';
import { useSystem } from '../../context/SystemContext';
import { SAMPLE_WASTE_ITEMS, HOURLY_COLLECTION_DATA } from '../../data/mockData';
import {
  Activity,
  Layers,
  Recycle,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Cpu,
  Gauge,
  Leaf,
  Wind,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  Zap,
  Play
} from 'lucide-react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const MainDashboard: React.FC = () => {
  const {
    stats,
    bins,
    systemStatus,
    operationalMode,
    telemetry,
    startSimulation,
    setActiveTab,
    toggleAutoDemo,
    isAutoDemoActive
  } = useSystem();

  // Category Colors
  const CATEGORY_COLORS: Record<string, string> = {
    organic: '#10b981', // emerald
    plastic: '#f59e0b', // amber
    paper: '#3b82f6',   // blue
    metal: '#06b6d4',   // cyan
    dry: '#a855f7',     // purple
  };

  const pieData = [
    { name: 'Organic / Wet', value: stats.categoryCounts.organic || 1, color: CATEGORY_COLORS.organic },
    { name: 'Plastic', value: stats.categoryCounts.plastic || 1, color: CATEGORY_COLORS.plastic },
    { name: 'Paper & Pulp', value: stats.categoryCounts.paper || 1, color: CATEGORY_COLORS.paper },
    { name: 'Metal', value: stats.categoryCounts.metal || 1, color: CATEGORY_COLORS.metal },
    { name: 'General Dry', value: stats.categoryCounts.dry || 1, color: CATEGORY_COLORS.dry },
  ];

  // Quick dispatch helper
  const handleQuickDispatch = (sampleIndex = 0) => {
    const item = SAMPLE_WASTE_ITEMS[sampleIndex % SAMPLE_WASTE_ITEMS.length];
    startSimulation(item);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Status & Quick Controls */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-emerald-500/25 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center space-x-4 z-10">
          <div className="relative">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${
                systemStatus === 'running'
                  ? 'bg-emerald-950/80 border-emerald-400 text-emerald-400 shadow-neon-glow'
                  : systemStatus === 'emergency_stop'
                  ? 'bg-red-950/80 border-red-500 text-red-500 shadow-danger-glow'
                  : 'bg-forest-900 border-amber-500/50 text-amber-400'
              }`}
            >
              <Cpu className="w-7 h-7" />
            </div>
            <span
              className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-forest-950 ${
                systemStatus === 'running' ? 'bg-emerald-400 animate-ping' : 'bg-red-500'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-mono tracking-widest text-emerald-400">
                SCADA TELEMETRY GATEWAY
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  systemStatus === 'running'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-red-500/20 text-red-300 border border-red-500/40'
                }`}
              >
                {systemStatus.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold font-heading text-white">
              Autonomous Sorting Station // Core Cluster Alpha
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Protocol: MQTT v5.0 | Edge AI: MobileNetV2 Quantized | MCU: ESP32-WROOM-32D Dual-Core
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5 z-10 w-full md:w-auto">
          <button
            onClick={() => handleQuickDispatch(0)}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-semibold text-xs flex items-center justify-center gap-2 shadow-neon-glow transition"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Simulate Waste Feed</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-forest-900/90 hover:bg-forest-800 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Open Digital Twin</span>
          </button>

          <button
            onClick={toggleAutoDemo}
            className={`px-3 py-2.5 rounded-xl text-xs font-mono font-semibold border flex items-center justify-center gap-1.5 transition ${
              isAutoDemoActive
                ? 'bg-teal-950/80 border-teal-400 text-teal-300 shadow-neon-glow'
                : 'bg-forest-900/60 border-forest-700 text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Demo Mode</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Grid (Animated Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Waste Processed */}
        <div className="glass-panel p-4 rounded-xl border border-emerald-500/20 relative overflow-hidden group hover:border-emerald-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Processed Items</span>
            <div className="p-2 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl lg:text-3xl font-extrabold font-heading text-white tracking-tight">
              {stats.totalProcessedToday}
              <span className="text-xs font-normal text-emerald-400 ml-1.5 font-mono">items</span>
            </div>
            <p className="text-[11px] text-emerald-400/90 flex items-center gap-1 mt-1 font-mono">
              <TrendingUp className="w-3 h-3" />
              +14% vs daily target
            </p>
          </div>
        </div>

        {/* Metric 2: Total Segregated Weight */}
        <div className="glass-panel p-4 rounded-xl border border-teal-500/20 relative overflow-hidden group hover:border-teal-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Total Mass Sorted</span>
            <div className="p-2 rounded-lg bg-teal-950/60 text-teal-400 border border-teal-800/40">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl lg:text-3xl font-extrabold font-heading text-white tracking-tight">
              {stats.totalSegregatedKg.toFixed(1)}
              <span className="text-xs font-normal text-teal-400 ml-1.5 font-mono">kg</span>
            </div>
            <p className="text-[11px] text-teal-400/90 flex items-center gap-1 mt-1 font-mono">
              <CheckCircle2 className="w-3 h-3" />
              Zero cross-contamination
            </p>
          </div>
        </div>

        {/* Metric 3: Segregation Accuracy */}
        <div className="glass-panel p-4 rounded-xl border border-cyan-500/20 relative overflow-hidden group hover:border-cyan-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">AI Accuracy</span>
            <div className="p-2 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl lg:text-3xl font-extrabold font-heading text-white tracking-tight">
              {stats.segregationAccuracy}%
            </div>
            <div className="w-full bg-forest-900 h-1.5 rounded-full mt-2 overflow-hidden border border-cyan-900/40">
              <div
                className="bg-gradient-to-r from-teal-400 to-cyan-400 h-full rounded-full"
                style={{ width: `${stats.segregationAccuracy}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metric 4: Recycling Efficiency */}
        <div className="glass-panel p-4 rounded-xl border border-lime-500/20 relative overflow-hidden group hover:border-lime-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Recovery Ratio</span>
            <div className="p-2 rounded-lg bg-lime-950/60 text-lime-400 border border-lime-800/40">
              <Recycle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl lg:text-3xl font-extrabold font-heading text-white tracking-tight">
              {stats.recyclingEfficiency}%
            </div>
            <p className="text-[11px] text-lime-400 flex items-center gap-1 mt-1 font-mono">
              <Leaf className="w-3 h-3" />
              Industrial Grade A
            </p>
          </div>
        </div>
      </div>

      {/* Middle Section: Live Sensor Strip + Quick Bins Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Sensor Telemetry Strip */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <h3 className="font-heading font-semibold text-white text-sm">
                  Live IoT Sensor Readings
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('sensors')}
                className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5"
              >
                <span>Full Telemetry</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {/* Ultrasonic Intake */}
              <div className="p-2.5 rounded-lg bg-forest-900/70 border border-emerald-950 flex items-center justify-between">
                <span className="text-slate-400">Intake Ultrasonic Distance:</span>
                <span className="font-bold text-emerald-300">
                  {telemetry.ultrasonicDistanceCm.toFixed(1)} cm
                </span>
              </div>

              {/* IR Optical Barrier */}
              <div className="p-2.5 rounded-lg bg-forest-900/70 border border-emerald-950 flex items-center justify-between">
                <span className="text-slate-400">Sharp IR Barrier:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                    telemetry.irSensorActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                      : 'bg-emerald-950 text-emerald-400'
                  }`}
                >
                  {telemetry.irSensorActive ? 'BEAM BROKEN' : 'BEAM CLEAR'}
                </span>
              </div>

              {/* Capacitive Moisture Sensor */}
              <div className="p-2.5 rounded-lg bg-forest-900/70 border border-emerald-950 flex items-center justify-between">
                <span className="text-slate-400">Moisture Sensor (Capacitive):</span>
                <span className="font-bold text-teal-300">{telemetry.moistureValue}%</span>
              </div>

              {/* Inductive Metal Proximity */}
              <div className="p-2.5 rounded-lg bg-forest-900/70 border border-emerald-950 flex items-center justify-between">
                <span className="text-slate-400">Inductive Metal Probe (LJ12A3):</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                    telemetry.metalSensorActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-forest-950 text-slate-400'
                  }`}
                >
                  {telemetry.metalSensorActive ? 'METAL DETECTED' : 'NON-FERROUS'}
                </span>
              </div>

              {/* High-Torque Servo Flap Angle */}
              <div className="p-2.5 rounded-lg bg-forest-900/70 border border-emerald-950 flex items-center justify-between">
                <span className="text-slate-400">MG996R Servo Angle:</span>
                <span className="font-bold text-lime-300">{telemetry.servoAngle}°</span>
              </div>

              {/* Conveyor Motor Speed */}
              <div className="p-2.5 rounded-lg bg-forest-900/70 border border-emerald-950 flex items-center justify-between">
                <span className="text-slate-400">Conveyor DC Motor:</span>
                <span className="font-bold text-emerald-300">
                  {telemetry.conveyorRunning ? `${telemetry.conveyorSpeedRpm} RPM` : 'HALTED'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-forest-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Sampling: 50Hz (SPI/I2C)</span>
            <span className="text-emerald-400">CRC-32 Checksum OK</span>
          </div>
        </div>

        {/* 5 Smart Bins Real-Time Fill Snapshot */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-emerald-500/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading font-semibold text-white text-sm">
                Smart Storage Bins Telemetry (5x Multi-Chute)
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Ultrasonic HC-SR04 depth measurement calibrated to 60cm container depth
              </p>
            </div>
            <button
              onClick={() => setActiveTab('bins')}
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5"
            >
              <span>Manage Bins</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {bins.map((bin) => {
              const isWarning = bin.fillPercentage >= 80;
              const isFull = bin.fillPercentage >= 100;
              return (
                <div
                  key={bin.id}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all relative overflow-hidden ${
                    isFull
                      ? 'bg-red-950/40 border-red-500/60 shadow-danger-glow'
                      : isWarning
                      ? 'bg-amber-950/40 border-amber-500/50'
                      : 'bg-forest-900/60 border-forest-700 hover:border-emerald-500/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold font-mono uppercase text-slate-300 truncate">
                        {bin.name.split(' ')[0]}
                      </span>
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: bin.accentHex }}
                      />
                    </div>
                    <div className="text-lg font-bold font-heading text-white mt-1">
                      {bin.fillPercentage}%
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {bin.currentDistanceCm} cm left
                    </span>
                  </div>

                  {/* Visual Fill Gauge */}
                  <div className="my-2.5 w-full bg-forest-950 rounded-full h-2.5 border border-forest-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${bin.fillPercentage}%`,
                        backgroundColor: isFull ? '#ef4444' : isWarning ? '#f59e0b' : bin.accentHex,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>{bin.currentWeightKg.toFixed(1)} kg</span>
                    <span
                      className={`font-bold ${
                        isFull
                          ? 'text-red-400 animate-pulse'
                          : isWarning
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {isFull ? 'FULL' : isWarning ? 'WARN' : 'NOMINAL'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Test Samples Dispatch Tray */}
          <div className="mt-5 pt-4 border-t border-forest-800">
            <span className="text-xs font-mono uppercase text-slate-400 block mb-2.5">
              Quick Test Injection Tray (Click any waste item to simulate instant sorting):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
              {SAMPLE_WASTE_ITEMS.slice(0, 8).map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => handleQuickDispatch(idx)}
                  className="p-2 rounded-lg bg-forest-900/80 hover:bg-emerald-950/80 border border-forest-700 hover:border-emerald-400 text-left transition group flex flex-col items-center text-center"
                  title={`Inject ${item.name} into hopper`}
                >
                  <img
                    src={item.sampleImageUrl}
                    alt={item.name}
                    className="w-8 h-8 rounded mb-1 object-contain group-hover:scale-110 transition"
                  />
                  <span className="text-[10px] font-semibold text-slate-300 truncate w-full">
                    {item.name}
                  </span>
                  <span className="text-[9px] font-mono text-emerald-400 uppercase">
                    {item.category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Real-Time Environmental Impact + Category Breakdown Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Environmental Impact Statistics */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                <Leaf className="w-4 h-4" />
              </div>
              <h3 className="font-heading font-semibold text-white text-sm">
                Eco-Impact & Sustainability
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
              ISO 14001 VERIFIED
            </span>
          </div>

          <div className="space-y-4">
            {/* Metric 1 */}
            <div className="p-3 rounded-xl bg-forest-900/60 border border-emerald-950 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-mono">CO₂ Emissions Abated</span>
                <div className="text-xl font-bold font-heading text-emerald-300">
                  {stats.co2SavedKg.toFixed(1)} <span className="text-xs font-mono">kg CO₂e</span>
                </div>
              </div>
              <Wind className="w-6 h-6 text-emerald-400/70" />
            </div>

            {/* Metric 2 */}
            <div className="p-3 rounded-xl bg-forest-900/60 border border-emerald-950 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-mono">Plastic Diverted from Oceans</span>
                <div className="text-xl font-bold font-heading text-amber-300">
                  {stats.plasticDivertedKg.toFixed(1)} <span className="text-xs font-mono">kg</span>
                </div>
              </div>
              <Recycle className="w-6 h-6 text-amber-400/70" />
            </div>

            {/* Metric 3 */}
            <div className="p-3 rounded-xl bg-forest-900/60 border border-emerald-950 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-mono">Estimated Trees Saved Equivalent</span>
                <div className="text-xl font-bold font-heading text-teal-300">
                  {(stats.co2SavedKg * 0.045).toFixed(2)}{' '}
                  <span className="text-xs font-mono">mature trees</span>
                </div>
              </div>
              <Leaf className="w-6 h-6 text-teal-400/70" />
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300/90 font-mono leading-relaxed">
            🌿 Each 1 kg of sorted aluminum saves 95% of bauxite smelting electricity. Plastic segregation prevents microplastic leaching.
          </div>
        </div>

        {/* Hourly Collection Trend (Recharts AreaChart) */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-heading font-semibold text-white text-sm">
                Hourly Waste Throughput (kg/hr)
              </h3>
              <p className="text-xs text-slate-400 font-mono">Telemetry log over last 7 hours</p>
            </div>
            <span className="text-xs font-mono text-slate-400">Peak: 14:00</span>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY_COLLECTION_DATA}>
                <defs>
                  <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPlastic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#475569" fontSize={11} tickLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#06150d',
                    borderColor: '#10b981',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="organic"
                  name="Organic (kg)"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorOrganic)"
                />
                <Area
                  type="monotone"
                  dataKey="plastic"
                  name="Plastic (kg)"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPlastic)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs font-mono pt-2 border-t border-forest-900">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Organic Stream</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Plastic Polymers</span>
            </div>
          </div>
        </div>

        {/* Waste Composition Donut Chart */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-heading font-semibold text-white text-sm">
                Segregated Category Share
              </h3>
              <p className="text-xs text-slate-400 font-mono">Total segregated items by category</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              {stats.totalProcessedToday} Total
            </span>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#030a06" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#06150d',
                    borderColor: '#10b981',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Donut Legend */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] font-mono pt-2 border-t border-forest-900">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="truncate">{d.name}</span>
                </span>
                <span className="font-bold text-white">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
