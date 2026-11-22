import React from 'react';
import { useSystem } from './context/SystemContext';
import { Header } from './components/common/Header';
import { Navbar } from './components/common/Navbar';
import { MainDashboard } from './components/dashboard/MainDashboard';
import { DigitalTwinSimulator } from './components/simulator/DigitalTwinSimulator';
import { AIWasteDetection } from './components/ai-detection/AIWasteDetection';
import { SmartBinMonitoring } from './components/bins/SmartBinMonitoring';
import { IoTSensorPanel } from './components/sensors/IoTSensorPanel';
import { AutomationControlPanel } from './components/controls/AutomationControlPanel';
import { AnalyticsEnvironmentalImpact } from './components/analytics/AnalyticsEnvironmentalImpact';
import { AlertNotificationCenter } from './components/alerts/AlertNotificationCenter';
import { ActivityLog } from './components/logs/ActivityLog';
import { ProjectInfoPresentation } from './components/presentation/ProjectInfoPresentation';
import { DailyAuditReport } from './components/report/DailyAuditReport';

export const AppContent: React.FC = () => {
  const { activeTab } = useSystem();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MainDashboard />;
      case 'simulator':
        return <DigitalTwinSimulator />;
      case 'ai-detection':
        return <AIWasteDetection />;
      case 'bins':
        return <SmartBinMonitoring />;
      case 'sensors':
        return <IoTSensorPanel />;
      case 'controls':
        return <AutomationControlPanel />;
      case 'analytics':
        return <AnalyticsEnvironmentalImpact />;
      case 'alerts':
        return <AlertNotificationCenter />;
      case 'logs':
        return <ActivityLog />;
      case 'presentation':
        return <ProjectInfoPresentation />;
      case 'report':
        return <DailyAuditReport />;
      default:
        return <MainDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-forest-950 text-slate-100">
      {/* Top Header */}
      <Header />

      {/* Navigation Sub-bar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {renderActiveTab()}
      </main>

      {/* Exhibition Footer */}
      <footer className="w-full border-t border-forest-900 bg-forest-950/90 py-6 px-4 font-mono text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-neon-glow" />
            <span className="text-slate-300 font-semibold font-heading">
              SMART WASTE SEGREGATION SYSTEM USING IoT & AUTOMATION
            </span>
            <span className="text-forest-700">|</span>
            <span className="text-slate-400">B.Tech Engineering Prototype</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <span>ESP32 Core: 240MHz</span>
            <span>•</span>
            <span>Edge AI: MobileNetV2</span>
            <span>•</span>
            <span className="text-emerald-400">Status: Exhibition Verified</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppContent;
