import React from 'react';
import { useSystem } from '../../context/SystemContext';
import {
  HOURLY_COLLECTION_DATA,
  WEEKLY_TREND_DATA,
} from '../../data/mockData';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Leaf,
  Wind,
  Recycle,
  Award,
  TrendingUp,
  CheckCircle2,
  TreeDeciduous,
  Zap,
  Globe2
} from 'lucide-react';

export const AnalyticsEnvironmentalImpact: React.FC = () => {
  const { stats } = useSystem();

  const CATEGORY_COLORS: Record<string, string> = {
    organic: '#10b981',
    plastic: '#f59e0b',
    paper: '#3b82f6',
    metal: '#06b6d4',
    dry: '#a855f7',
  };

  const categoryBarData = [
    { name: 'Organic', count: stats.categoryCounts.organic || 42, fill: CATEGORY_COLORS.organic },
    { name: 'Plastic', count: stats.categoryCounts.plastic || 88, fill: CATEGORY_COLORS.plastic },
    { name: 'Paper', count: stats.categoryCounts.paper || 56, fill: CATEGORY_COLORS.paper },
    { name: 'Metal', count: stats.categoryCounts.metal || 31, fill: CATEGORY_COLORS.metal },
    { name: 'Dry', count: stats.categoryCounts.dry || 64, fill: CATEGORY_COLORS.dry },
  ];

  // Sustainability score calculated from accuracy and recycling ratio
  const sustainabilityScore = Math.min(
    100,
    Math.round((stats.segregationAccuracy * 0.6) + (stats.recyclingEfficiency * 0.4))
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-emerald-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
              CARBON TELEMETRY & ESG AUDIT
            </span>
            <span className="text-xs text-slate-400 font-mono">
              REAL-TIME CIRCULAR ECONOMY EVALUATION
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-heading text-white mt-1">
            Analytics & Environmental Impact Matrix
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Quantifiable carbon offsets, resource conservation metrics, and throughput dynamics
          </p>
        </div>

        {/* Global Eco Score Pill */}
        <div className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-forest-900 border border-emerald-500/40 shadow-neon-glow">
          <Award className="w-5 h-5 text-emerald-400" />
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">
              Green Sustainability Score
            </span>
            <span className="text-lg font-bold font-heading text-emerald-300">
              {sustainabilityScore} / 100 [A+]
            </span>
          </div>
        </div>
      </div>

      {/* Top 4 Eco-KPI Highlight Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="glass-panel p-4 rounded-xl border border-emerald-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">CO₂ Reductions</span>
            <Wind className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl lg:text-3xl font-extrabold font-heading text-white">
              {stats.co2SavedKg.toFixed(1)} <span className="text-xs font-mono text-emerald-400">kg CO₂e</span>
            </div>
            <p className="text-[11px] text-emerald-400 mt-1 font-mono">
              Equivalent to 480 km EV drive
            </p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel p-4 rounded-xl border border-amber-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Plastic Diverted</span>
            <Recycle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl lg:text-3xl font-extrabold font-heading text-white">
              {stats.plasticDivertedKg.toFixed(1)} <span className="text-xs font-mono text-amber-400">kg</span>
            </div>
            <p className="text-[11px] text-amber-400 mt-1 font-mono">
              Zero marine leakage
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel p-4 rounded-xl border border-cyan-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Segregation Accuracy</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl lg:text-3xl font-extrabold font-heading text-white">
              {stats.segregationAccuracy}%
            </div>
            <p className="text-[11px] text-cyan-400 mt-1 font-mono">
              AI + Dual Verification
            </p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel p-4 rounded-xl border border-lime-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Total Sort Operations</span>
            <TrendingUp className="w-4 h-4 text-lime-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl lg:text-3xl font-extrabold font-heading text-white">
              {stats.totalProcessedToday} <span className="text-xs font-mono text-lime-400">cycles</span>
            </div>
            <p className="text-[11px] text-lime-400 mt-1 font-mono">
              100% telemetry recorded
            </p>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Segregated Waste Items By Category (Bar Chart) */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading font-semibold text-white text-base">
                Segregated Items by Category
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Distribution across 5 physical collection streams
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
              Real-time update
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryBarData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#06150d',
                    borderColor: '#10b981',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {categoryBarData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Weekly Trends & Accuracy (Composite Chart) */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading font-semibold text-white text-base">
                Weekly Throughput & Accuracy Dynamics
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Daily total mass (kg) vs AI segregation accuracy (%)
              </p>
            </div>
            <span className="text-xs font-mono text-teal-400">7-Day Log</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={WEEKLY_TREND_DATA}>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#06150d',
                    borderColor: '#10b981',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="totalKg"
                  name="Total Mass (kg)"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#10b981' }}
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  name="Accuracy (%)"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: '#38bdf8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Futuristic Circular Eco-Impact Indicator & Lifecycle Card */}
      <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Left: Circular Impact Score */}
        <div className="flex flex-col items-center text-center p-4 rounded-xl bg-forest-950/80 border border-emerald-950">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="52"
                stroke="#0d2b1c"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="64"
                cy="64"
                r="52"
                stroke="#10b981"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="326.7"
                strokeDashoffset={326.7 - (326.7 * sustainabilityScore) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold font-heading text-white">
                {sustainabilityScore}%
              </span>
              <span className="text-[9px] font-mono text-emerald-400 uppercase">
                SUSTAINABILITY
              </span>
            </div>
          </div>
          <span className="text-xs font-bold font-heading text-white mt-3">
            Circular Economy Rating
          </span>
          <span className="text-[11px] font-mono text-slate-400 mt-0.5">
            Optimal resource reclamation rate
          </span>
        </div>

        {/* Middle & Right: Life Cycle Analysis (LCA) Impact Summary */}
        <div className="md:col-span-2 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-forest-800">
            <span className="text-emerald-400 font-bold uppercase">
              LCA Environmental Equivalency Benchmarks:
            </span>
            <span className="text-slate-400 text-[10px]">UN SDG Goal #11 & #12</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-forest-900/60 border border-forest-800">
              <span className="text-slate-400 block text-[10px]">Landfill Volume Spared</span>
              <strong className="text-sm text-emerald-300">
                {(stats.totalSegregatedKg * 0.0032).toFixed(3)} m³ compacted
              </strong>
            </div>

            <div className="p-3 rounded-lg bg-forest-900/60 border border-forest-800">
              <span className="text-slate-400 block text-[10px]">Methane Generation Prevented</span>
              <strong className="text-sm text-teal-300">
                {(stats.categoryCounts.organic * 0.42).toFixed(1)} kg CH₄ equivalent
              </strong>
            </div>

            <div className="p-3 rounded-lg bg-forest-900/60 border border-forest-800">
              <span className="text-slate-400 block text-[10px]">Virgin Ore Extraction Offset</span>
              <strong className="text-sm text-cyan-300">
                {(stats.categoryCounts.metal * 0.18).toFixed(1)} kg raw bauxite/iron
              </strong>
            </div>

            <div className="p-3 rounded-lg bg-forest-900/60 border border-forest-800">
              <span className="text-slate-400 block text-[10px]">Water Saved in Pulp Recovery</span>
              <strong className="text-sm text-lime-300">
                {(stats.categoryCounts.paper * 12.5).toFixed(0)} Liters H₂O
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
