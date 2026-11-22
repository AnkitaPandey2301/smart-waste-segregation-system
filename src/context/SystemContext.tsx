import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  SmartBin,
  WasteItem,
  SimulatorStep,
  IoTTelemetry,
  SystemAlert,
  ActivityLogItem,
  SystemStats,
  BinId,
  WasteCategory
} from '../types';
import {
  INITIAL_BINS,
  SAMPLE_WASTE_ITEMS,
  INITIAL_ALERTS,
  INITIAL_ACTIVITY_LOGS,
} from '../data/mockData';
import {
  playLaserScanSound,
  playServoSound,
  playSuccessChime,
  playAlertSound,
  playBinDropSound,
  playTone,
  setSoundEnabled,
  getSoundEnabled
} from '../utils/audio';

export type SystemStatus = 'running' | 'idle' | 'stopped' | 'emergency_stop' | 'calibrating';
export type OperationalMode = 'auto' | 'manual';

interface SystemContextType {
  // State
  bins: SmartBin[];
  systemStatus: SystemStatus;
  operationalMode: OperationalMode;
  isAutoDemoActive: boolean;
  currentSimulatorStep: SimulatorStep;
  activeItem: WasteItem | null;
  telemetry: IoTTelemetry;
  alerts: SystemAlert[];
  logs: ActivityLogItem[];
  stats: SystemStats;
  soundEnabled: boolean;
  activeTab: string;
  stepProgress: number; // 0-100% within current step

  // Setters & Actions
  setActiveTab: (tab: string) => void;
  setOperationalMode: (mode: OperationalMode) => void;
  toggleSound: () => void;
  toggleAutoDemo: () => void;
  startSystem: () => void;
  stopSystem: () => void;
  emergencyStop: () => void;
  resetSystem: () => void;
  emptyBin: (id: BinId) => void;
  startSimulation: (customItem?: WasteItem) => Promise<boolean>;
  manualChuteSort: (targetBin: BinId, angle: number) => void;
  testSensor: (sensorName: string) => void;
  addAlert: (alert: Omit<SystemAlert, 'id' | 'timestamp'>) => void;
  clearAlerts: () => void;
  addLog: (log: Omit<ActivityLogItem, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'ECO_SORT_AIOT_STATE_V1';

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistent Bins
  const [bins, setBins] = useState<SmartBin[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_BINS`);
      return saved ? JSON.parse(saved) : INITIAL_BINS;
    } catch {
      return INITIAL_BINS;
    }
  });

  // System status
  const [systemStatus, setSystemStatus] = useState<SystemStatus>('running');
  const [operationalMode, setOperationalMode] = useState<OperationalMode>('auto');
  const [isAutoDemoActive, setIsAutoDemoActive] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [soundActive, setSoundActive] = useState<boolean>(true);

  // Simulation state
  const [currentSimulatorStep, setCurrentSimulatorStep] = useState<SimulatorStep>(SimulatorStep.IDLE);
  const [stepProgress, setStepProgress] = useState<number>(0);
  const [activeItem, setActiveItem] = useState<WasteItem | null>(null);

  // Real-time dynamic IoT Telemetry
  const [telemetry, setTelemetry] = useState<IoTTelemetry>({
    ultrasonicDistanceCm: 45.2,
    irSensorActive: false,
    moistureValue: 5.4,
    metalSensorActive: false,
    servoAngle: 0,
    conveyorSpeedRpm: 120,
    conveyorRunning: true,
    esp32TempC: 38.6,
    ambientTempC: 25.4,
    humidityPercent: 52.0,
    wifiRssi: -58,
    mqttPacketsSec: 24,
    systemLoad: 34,
  });

  // Alerts & Logs
  const [alerts, setAlerts] = useState<SystemAlert[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_ALERTS`);
      return saved ? JSON.parse(saved) : INITIAL_ALERTS;
    } catch {
      return INITIAL_ALERTS;
    }
  });

  const [logs, setLogs] = useState<ActivityLogItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_LOGS`);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
    } catch {
      return INITIAL_ACTIVITY_LOGS;
    }
  });

  // Overall Stats
  const [stats, setStats] = useState<SystemStats>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_STATS`);
      return saved
        ? JSON.parse(saved)
        : {
            totalProcessedToday: 281,
            totalSegregatedKg: 65.2,
            segregationAccuracy: 98.6,
            recyclingEfficiency: 94.2,
            co2SavedKg: 112.4,
            plasticDivertedKg: 18.9,
            totalEnergyKwh: 3.42,
            categoryCounts: {
              organic: 42,
              plastic: 88,
              paper: 56,
              metal: 31,
              dry: 64,
              hazardous: 0,
            },
          };
    } catch {
      return {
        totalProcessedToday: 281,
        totalSegregatedKg: 65.2,
        segregationAccuracy: 98.6,
        recyclingEfficiency: 94.2,
        co2SavedKg: 112.4,
        plasticDivertedKg: 18.9,
        totalEnergyKwh: 3.42,
        categoryCounts: {
          organic: 42,
          plastic: 88,
          paper: 56,
          metal: 31,
          dry: 64,
          hazardous: 0,
        },
      };
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_BINS`, JSON.stringify(bins));
    } catch {}
  }, [bins]);

  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_ALERTS`, JSON.stringify(alerts));
    } catch {}
  }, [alerts]);

  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_LOGS`, JSON.stringify(logs));
    } catch {}
  }, [logs]);

  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_STATS`, JSON.stringify(stats));
    } catch {}
  }, [stats]);

  // Audio mute sync
  const toggleSound = () => {
    const next = !soundActive;
    setSoundActive(next);
    setSoundEnabled(next);
    if (next) playTone(800, 'sine', 0.1, 0.05);
  };

  // Helper to add alerts
  const addAlert = useCallback((alertData: Omit<SystemAlert, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newAlert: SystemAlert = {
      ...alertData,
      id: `alt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: timeStr,
      read: false,
    };
    setAlerts((prev) => [newAlert, ...prev.slice(0, 49)]);
    if (alertData.level === 'critical' || alertData.level === 'warning') {
      playAlertSound();
    }
  }, []);

  // Helper to add logs
  const addLog = useCallback((logData: Omit<ActivityLogItem, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newLog: ActivityLogItem = {
      ...logData,
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: timeStr,
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 99)]);
  }, []);

  // Dynamic telemetry background updates (jittering realistic sensor values)
  useEffect(() => {
    const timer = setInterval(() => {
      if (systemStatus === 'stopped' || systemStatus === 'emergency_stop') return;

      setTelemetry((prev) => {
        const jitter = (Math.random() - 0.5) * 0.4;
        const tempJitter = (Math.random() - 0.5) * 0.2;
        const packetJitter = Math.floor(Math.random() * 5) - 2;

        return {
          ...prev,
          esp32TempC: Number((Math.min(48, Math.max(34, prev.esp32TempC + tempJitter))).toFixed(1)),
          ambientTempC: Number((Math.min(30, Math.max(22, prev.ambientTempC + tempJitter * 0.5))).toFixed(1)),
          humidityPercent: Number((Math.min(65, Math.max(45, prev.humidityPercent + jitter))).toFixed(1)),
          wifiRssi: Math.min(-45, Math.max(-75, prev.wifiRssi + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0))),
          mqttPacketsSec: Math.max(12, Math.min(35, prev.mqttPacketsSec + packetJitter)),
          systemLoad: currentSimulatorStep !== SimulatorStep.IDLE ? 65 + Math.floor(Math.random() * 15) : 28 + Math.floor(Math.random() * 8),
          conveyorRunning: systemStatus === 'running',
          conveyorSpeedRpm: systemStatus === 'running' ? (currentSimulatorStep !== SimulatorStep.IDLE ? 140 : 120) : 0,
        };
      });
    }, 1500);

    return () => clearInterval(timer);
  }, [systemStatus, currentSimulatorStep]);

  // Simulation execution lock ref
  const isSimulatingRef = useRef(false);

  // Automated Segregation Execution Logic
  const startSimulation = useCallback(
    async (customItem?: WasteItem): Promise<boolean> => {
      if (isSimulatingRef.current) return false;
      if (systemStatus === 'emergency_stop' || systemStatus === 'stopped') {
        addAlert({
          level: 'critical',
          title: 'System Offline / E-Stop Active',
          message: 'Cannot inject waste while system is halted. Please reset or start system first.',
          source: 'Safety Interlock',
        });
        return false;
      }

      // Pick item
      const item =
        customItem ||
        SAMPLE_WASTE_ITEMS[Math.floor(Math.random() * SAMPLE_WASTE_ITEMS.length)];

      // Check if target bin is full (100%)
      const targetBin = bins.find((b) => b.id === item.targetBin);
      if (targetBin && targetBin.fillPercentage >= 100) {
        addAlert({
          level: 'critical',
          title: `${targetBin.name} Full (100%)`,
          message: `Segregation halted: Destination ${targetBin.name} is at maximum capacity. Empty the bin to resume.`,
          source: 'Ultrasonic Interlock',
        });
        playAlertSound();
        return false;
      }

      isSimulatingRef.current = true;
      setActiveItem(item);

      // STEP 1: Waste Detected at Intake Hopper (IR Proximity Sensor)
      setCurrentSimulatorStep(SimulatorStep.WASTE_DETECTED);
      setStepProgress(20);
      setTelemetry((prev) => ({
        ...prev,
        irSensorActive: true,
        ultrasonicDistanceCm: 12.5, // Item present in hopper
      }));
      playTone(550, 'square', 0.1, 0.06);
      addLog({
        eventName: 'Waste Detected at Hopper',
        category: item.category,
        details: `IR Sensor beam broken by incoming item: ${item.name} (~${item.weightGrams}g).`,
        status: 'info',
      });
      await new Promise((r) => setTimeout(r, 900));

      // STEP 2: Camera scans waste (Dual spectrum RGB + Edge illumination)
      setCurrentSimulatorStep(SimulatorStep.CAMERA_SCANNING);
      setStepProgress(40);
      playLaserScanSound();
      addLog({
        eventName: 'Optical Inspection Triggered',
        category: item.category,
        details: `High-res frame capture initialized on ${item.name}. Multi-spectrum lighting active.`,
        status: 'info',
      });
      await new Promise((r) => setTimeout(r, 1100));

      // STEP 3: AI Classification (MobileNetV2 Edge Model)
      setCurrentSimulatorStep(SimulatorStep.AI_CLASSIFYING);
      setStepProgress(60);
      playTone(880, 'sine', 0.08, 0.07);
      addLog({
        eventName: 'AI Classification Completed',
        category: item.category,
        details: `Model classified item as ${item.category.toUpperCase()} with ${item.confidence}% confidence.`,
        confidence: item.confidence,
        status: 'success',
      });
      await new Promise((r) => setTimeout(r, 1000));

      // STEP 4: Sensor Verification (Capacitive Moisture & Inductive Metal)
      setCurrentSimulatorStep(SimulatorStep.SENSOR_VERIFICATION);
      setStepProgress(75);
      setTelemetry((prev) => ({
        ...prev,
        moistureValue: item.sensors.moisturePercent,
        metalSensorActive: item.sensors.inductiveMetal,
      }));
      playTone(item.sensors.inductiveMetal ? 720 : 440, 'triangle', 0.15, 0.08);
      addLog({
        eventName: 'Dual Sensor Cross-Check',
        category: item.category,
        details: `Moisture: ${item.sensors.moisturePercent}% | Metal Probe: ${item.sensors.inductiveMetal ? 'ACTIVE (Conductive)' : 'INACTIVE (Non-ferrous)'}. Cross-validation passed!`,
        status: 'success',
      });
      await new Promise((r) => setTimeout(r, 1100));

      // STEP 5: Actuator Mechanism Engaged (MG996R Servo Gate Angle Rotation)
      setCurrentSimulatorStep(SimulatorStep.ACTUATOR_ENGAGED);
      setStepProgress(90);
      setTelemetry((prev) => ({
        ...prev,
        servoAngle: item.servoTargetAngle,
      }));
      playServoSound();
      addLog({
        eventName: 'Actuator Alignment',
        category: item.category,
        details: `High-torque servo rotated to ${item.servoTargetAngle}° aligning chute to ${item.targetBin.toUpperCase()} bin.`,
        binId: item.targetBin,
        status: 'info',
      });
      await new Promise((r) => setTimeout(r, 900));

      // STEP 6: Conveyor Dispatch & Chute Drop
      setCurrentSimulatorStep(SimulatorStep.CONVEYOR_DISPATCH);
      setStepProgress(100);
      playBinDropSound();
      await new Promise((r) => setTimeout(r, 800));

      // STEP 7: Completed & Dashboard Updates
      setCurrentSimulatorStep(SimulatorStep.COMPLETED);
      playSuccessChime();

      // Update Bin Capacity & Fill
      setBins((prevBins) =>
        prevBins.map((bin) => {
          if (bin.id === item.targetBin) {
            const addedWeightKg = item.weightGrams / 1000;
            const newWeight = Number((bin.currentWeightKg + addedWeightKg).toFixed(2));
            const fillDelta = Math.max(3, Math.min(8, Math.round((addedWeightKg / bin.capacityKg) * 100) || 4));
            const newFill = Math.min(100, bin.fillPercentage + fillDelta);
            // ultrasonic distance reduces as bin fills
            const newDistance = Number(
              Math.max(2, (bin.maxDepthCm * (1 - newFill / 100))).toFixed(1)
            );
            const newStatus =
              newFill >= 100 ? 'full' : newFill >= 80 ? 'filling' : 'normal';

            return {
              ...bin,
              currentWeightKg: newWeight,
              fillPercentage: newFill,
              currentDistanceCm: newDistance,
              status: newStatus,
              totalItemsCount: bin.totalItemsCount + 1,
            };
          }
          return bin;
        })
      );

      // Update Overall Statistics
      setStats((prev) => {
        const addedWeight = item.weightGrams / 1000;
        const isRecyclable = item.category === 'plastic' || item.category === 'metal' || item.category === 'paper';
        const co2Reduction =
          item.category === 'plastic' ? addedWeight * 2.1 :
          item.category === 'metal' ? addedWeight * 4.8 :
          item.category === 'paper' ? addedWeight * 1.3 :
          addedWeight * 0.4;

        return {
          ...prev,
          totalProcessedToday: prev.totalProcessedToday + 1,
          totalSegregatedKg: Number((prev.totalSegregatedKg + addedWeight).toFixed(2)),
          plasticDivertedKg:
            item.category === 'plastic'
              ? Number((prev.plasticDivertedKg + addedWeight).toFixed(2))
              : prev.plasticDivertedKg,
          co2SavedKg: Number((prev.co2SavedKg + co2Reduction).toFixed(2)),
          totalEnergyKwh: Number((prev.totalEnergyKwh + 0.008).toFixed(3)),
          categoryCounts: {
            ...prev.categoryCounts,
            [item.category]: (prev.categoryCounts[item.category] || 0) + 1,
          },
        };
      });

      addLog({
        eventName: 'Segregation Completed Successfully',
        category: item.category,
        details: `${item.name} successfully deposited into ${targetBin?.name || item.targetBin} with 100% telemetry verification.`,
        binId: item.targetBin,
        confidence: item.confidence,
        status: 'success',
      });

      // Check for 80% or 100% alerts on updated bin
      const nextFill = (targetBin?.fillPercentage || 0) + 4;
      if (nextFill >= 100) {
        addAlert({
          level: 'critical',
          title: `CRITICAL: ${targetBin?.name} Reached 100%`,
          message: `${targetBin?.name} is full. Ultrasonic distance < 5cm. Automated routing temporarily locked for this bin.`,
          source: 'Capacity Manager',
        });
      } else if (nextFill >= 80 && (targetBin?.fillPercentage || 0) < 80) {
        addAlert({
          level: 'warning',
          title: `WARNING: ${targetBin?.name} at 80% Fill`,
          message: `${targetBin?.name} has exceeded the 80% threshold. Compaction or collection advised soon.`,
          source: 'Capacity Manager',
        });
      }

      // Reset Telemetry sensors to baseline
      setTimeout(() => {
        setTelemetry((prev) => ({
          ...prev,
          irSensorActive: false,
          moistureValue: 4.8,
          metalSensorActive: false,
          servoAngle: 0,
          ultrasonicDistanceCm: 48.0,
        }));
        setCurrentSimulatorStep(SimulatorStep.IDLE);
        setStepProgress(0);
        isSimulatingRef.current = false;
      }, 1500);

      return true;
    },
    [bins, systemStatus, addAlert, addLog]
  );

  // Auto Demo Loop (when Demo Mode is toggled ON)
  useEffect(() => {
    let demoInterval: NodeJS.Timeout | null = null;
    if (isAutoDemoActive && systemStatus === 'running') {
      demoInterval = setInterval(() => {
        if (!isSimulatingRef.current) {
          startSimulation();
        }
      }, 7000);
    }
    return () => {
      if (demoInterval) clearInterval(demoInterval);
    };
  }, [isAutoDemoActive, systemStatus, startSimulation]);

  // Empty Bin Action
  const emptyBin = useCallback(
    (binId: BinId) => {
      setBins((prev) =>
        prev.map((b) => {
          if (b.id === binId) {
            return {
              ...b,
              currentWeightKg: 0,
              fillPercentage: 0,
              currentDistanceCm: b.maxDepthCm,
              status: 'normal',
              totalItemsCount: 0,
              lastEmptied: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Just Now',
            };
          }
          return b;
        })
      );
      playSuccessChime();
      addLog({
        eventName: 'Bin Emptied & Ultrasonic Sensor Re-Zeroed',
        category: 'system',
        details: `${binId.toUpperCase()} bin emptied and cleared by maintenance operator. Capacity reset to 0%.`,
        binId,
        status: 'success',
      });
      addAlert({
        level: 'info',
        title: `${binId.toUpperCase()} Bin Emptied`,
        message: `Ultrasonic sensor re-calibrated to distance ${60}cm (0% fill level). Routing unlocked.`,
        source: 'Bin Monitor',
      });
    },
    [addAlert, addLog]
  );

  // Manual Chute Sort
  const manualChuteSort = useCallback(
    (targetBin: BinId, angle: number) => {
      setTelemetry((prev) => ({
        ...prev,
        servoAngle: angle,
      }));
      playServoSound();
      addLog({
        eventName: 'Manual Chute Override Actuated',
        category: 'system',
        details: `Manual servo override commanded angle ${angle}° towards ${targetBin} bin.`,
        binId: targetBin,
        status: 'warning',
      });
    },
    [addLog]
  );

  // Sensor Diagnostic Testing
  const testSensor = useCallback(
    (sensorName: string) => {
      playTone(650, 'sine', 0.12, 0.08);
      if (sensorName === 'ir') {
        setTelemetry((prev) => ({ ...prev, irSensorActive: !prev.irSensorActive }));
      } else if (sensorName === 'metal') {
        setTelemetry((prev) => ({ ...prev, metalSensorActive: !prev.metalSensorActive }));
      } else if (sensorName === 'moisture') {
        setTelemetry((prev) => ({
          ...prev,
          moistureValue: Math.floor(Math.random() * 85) + 5,
        }));
      } else if (sensorName === 'ultrasonic') {
        setTelemetry((prev) => ({
          ...prev,
          ultrasonicDistanceCm: Math.floor(Math.random() * 45) + 5,
        }));
      }
      addLog({
        eventName: `Manual Sensor Test: ${sensorName.toUpperCase()}`,
        category: 'system',
        details: `Engineer initiated diagnostic ping on ${sensorName} hardware line. ACK 200 OK.`,
        status: 'info',
      });
    },
    [addLog]
  );

  // System Controls
  const startSystem = () => {
    setSystemStatus('running');
    playTone(800, 'sine', 0.15, 0.08);
    addAlert({
      level: 'success',
      title: 'System Online',
      message: 'Conveyor DC driver enabled, AI edge camera operational, safety loop closed.',
      source: 'SCADA Master',
    });
    addLog({
      eventName: 'System Started',
      category: 'system',
      details: 'All subsystems brought to operational state.',
      status: 'success',
    });
  };

  const stopSystem = () => {
    setSystemStatus('stopped');
    setIsAutoDemoActive(false);
    playTone(400, 'sine', 0.2, 0.08);
    addAlert({
      level: 'warning',
      title: 'System Stopped',
      message: 'Conveyor motor halted, sorting mechanism put on standby.',
      source: 'SCADA Master',
    });
    addLog({
      eventName: 'System Stopped',
      category: 'system',
      details: 'Conveyor and servos parked safely.',
      status: 'warning',
    });
  };

  const emergencyStop = () => {
    setSystemStatus('emergency_stop');
    setIsAutoDemoActive(false);
    playAlertSound();
    addAlert({
      level: 'critical',
      title: 'EMERGENCY STOP (E-STOP) ACTIVATED',
      message: 'Physical interlock triggered. All actuator power cut off instantly. Requires manual reset.',
      source: 'Hardware E-Stop Line',
    });
    addLog({
      eventName: 'EMERGENCY STOP ACTIVATED',
      category: 'system',
      details: 'Emergency stop circuit broken. Motors killed immediately.',
      status: 'error',
    });
  };

  const resetSystem = () => {
    setSystemStatus('running');
    setCurrentSimulatorStep(SimulatorStep.IDLE);
    isSimulatingRef.current = false;
    setTelemetry((prev) => ({
      ...prev,
      servoAngle: 0,
      irSensorActive: false,
      metalSensorActive: false,
      conveyorRunning: true,
      conveyorSpeedRpm: 120,
    }));
    playTone(600, 'sine', 0.15, 0.08);
    addAlert({
      level: 'info',
      title: 'System Reset Completed',
      message: 'Interlocks cleared, actuators homed to 0° reference position.',
      source: 'SCADA Master',
    });
    addLog({
      eventName: 'System Reset',
      category: 'system',
      details: 'System interlocks reset to nominal parameters.',
      status: 'info',
    });
  };

  const toggleAutoDemo = () => {
    const next = !isAutoDemoActive;
    setIsAutoDemoActive(next);
    if (next) {
      if (systemStatus !== 'running') setSystemStatus('running');
      playTone(900, 'sine', 0.12, 0.08);
      addAlert({
        level: 'info',
        title: 'Exhibition Demo Mode Enabled',
        message: 'System will autonomously feed and sort waste samples continuously for exhibition display.',
        source: 'Demo Engine',
      });
    } else {
      addAlert({
        level: 'info',
        title: 'Exhibition Demo Mode Paused',
        message: 'Continuous simulation halted.',
        source: 'Demo Engine',
      });
    }
  };

  const clearAlerts = () => setAlerts([]);
  const clearLogs = () => setLogs([]);

  return (
    <SystemContext.Provider
      value={{
        bins,
        systemStatus,
        operationalMode,
        isAutoDemoActive,
        currentSimulatorStep,
        activeItem,
        telemetry,
        alerts,
        logs,
        stats,
        soundEnabled: soundActive,
        activeTab,
        stepProgress,
        setActiveTab,
        setOperationalMode,
        toggleSound,
        toggleAutoDemo,
        startSystem,
        stopSystem,
        emergencyStop,
        resetSystem,
        emptyBin,
        startSimulation,
        manualChuteSort,
        testSensor,
        addAlert,
        clearAlerts,
        addLog,
        clearLogs,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
};
