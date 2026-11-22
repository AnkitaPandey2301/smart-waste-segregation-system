export type WasteCategory =
  | 'organic'
  | 'plastic'
  | 'paper'
  | 'metal'
  | 'dry'
  | 'hazardous';

export type BinId = 'organic' | 'plastic' | 'paper' | 'metal' | 'dry';

export type BinStatus = 'normal' | 'filling' | 'full' | 'offline';

export interface SmartBin {
  id: BinId;
  name: string;
  category: WasteCategory;
  color: string;
  bgGlow: string;
  accentHex: string;
  capacityKg: number;
  currentWeightKg: number;
  maxDepthCm: number;
  currentDistanceCm: number;
  fillPercentage: number;
  status: BinStatus;
  totalItemsCount: number;
  lastEmptied: string;
}

export interface WasteItem {
  id: string;
  name: string;
  category: WasteCategory;
  targetBin: BinId;
  weightGrams: number;
  confidence: number;
  description: string;
  decompositionTime: string;
  recyclability: string;
  sensors: {
    moisturePercent: number;
    inductiveMetal: boolean;
    irDetected: boolean;
    opticalReflectance: number;
  };
  sampleImageUrl: string;
  whyExplanation: string;
  servoTargetAngle: number; // e.g. -45, -20, 0, 25, 45
}

export enum SimulatorStep {
  IDLE = 0,
  WASTE_DETECTED = 1,
  CAMERA_SCANNING = 2,
  AI_CLASSIFYING = 3,
  SENSOR_VERIFICATION = 4,
  ACTUATOR_ENGAGED = 5,
  CONVEYOR_DISPATCH = 6,
  COMPLETED = 7,
}

export interface IoTTelemetry {
  ultrasonicDistanceCm: number;
  irSensorActive: boolean;
  moistureValue: number; // 0-100%
  metalSensorActive: boolean;
  servoAngle: number; // degrees (-45 to 45)
  conveyorSpeedRpm: number;
  conveyorRunning: boolean;
  esp32TempC: number;
  ambientTempC: number;
  humidityPercent: number;
  wifiRssi: number; // -30 to -90 dBm
  mqttPacketsSec: number;
  systemLoad: number; // 0-100%
}

export interface SystemAlert {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'critical' | 'success';
  title: string;
  message: string;
  source: string;
  read?: boolean;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  eventName: string;
  category: WasteCategory | 'system';
  details: string;
  binId?: BinId;
  confidence?: number;
  status: 'success' | 'warning' | 'error' | 'info';
}

export interface SystemStats {
  totalProcessedToday: number;
  totalSegregatedKg: number;
  segregationAccuracy: number;
  recyclingEfficiency: number;
  co2SavedKg: number;
  plasticDivertedKg: number;
  totalEnergyKwh: number;
  categoryCounts: Record<WasteCategory, number>;
}
