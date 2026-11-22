import React from 'react';
import { useSystem } from '../../context/SystemContext';
import {
  LayoutDashboard,
  Cpu,
  Eye,
  Trash2,
  Radio,
  Sliders,
  BarChart3,
  Bell,
  FileText,
  GraduationCap,
  Download
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, alerts } = useSystem();
  const unreadAlerts = alerts.filter((a) => !a.read).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'simulator', label: 'Digital Twin Sorter', icon: Cpu },
    { id: 'ai-detection', label: 'AI Waste Vision', icon: Eye },
    { id: 'bins', label: 'Smart Bins (5x)', icon: Trash2 },
    { id: 'sensors', label: 'IoT Sensor Telemetry', icon: Radio },
    { id: 'controls', label: 'Automation & Control', icon: Sliders },
    { id: 'analytics', label: 'Analytics & Eco Impact', icon: BarChart3 },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: unreadAlerts },
    { id: 'logs', label: 'Activity Log', icon: FileText },
    { id: 'presentation', label: 'Project Info & Viva', icon: GraduationCap },
    { id: 'report', label: 'Audit Report', icon: Download },
  ];

  return (
    <nav className="w-full bg-forest-950/80 border-b border-emerald-950 px-2 py-2 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto flex items-center space-x-1 min-w-max">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all relative ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-neon-glow font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-forest-900/60 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
              {Boolean(item.badge && item.badge > 0) && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-mono font-bold animate-pulse">
                  {item.badge}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-emerald-400 rounded-full shadow-[0_0_8px_#10b981]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
