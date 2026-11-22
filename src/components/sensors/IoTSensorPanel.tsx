import React from 'react';
import { useSystem } from '../../context/SystemContext';
import {
  Radio,
  Cpu,
  Wifi,
  Activity,
  Sliders,
  Thermometer,
  Gauge,
  Zap,
  CheckCircle2,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export const IoTSensorPanel: React.FC = () => {
  const { telemetry, testSensor, systemStatus } = useSystem();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-emerald-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
              HARDWARE TELEMETRY BUS
            </span>
            <span className="text-xs text-slate-400 font-mono">
              I2C (0x3C) // SPI // GPIO INTERRUPTS // ADC 12-BIT
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-heading text-white mt-1">
            Real-Time IoT Sensor Array & Microcontroller Telemetry
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Synchronized live values transmitted from ESP32 edge microcontroller via MQTT broker
          </p>
        </div>

        {/* Live Stream Status */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-forest-900 border border-emerald-500/40 text-xs font-mono">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-emerald-400 font-bold">50 HZ TELEMETRY STREAM</span>
        </div>
      </div>

      {/* Main Sensor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sensor 1: Sharp IR Optical Barrier */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400">IR Proximity Sensor</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-forest-950 px-2 py-0.5 rounded border border-forest-800">
                GPIO 18
              </span>
            </div>
            <h3 className="font-heading font-bold text-white text-base mt-1">
              Sharp GP2Y0A21YK
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Intake Hopper Waste Detection
            </p>

            <div className="my-4 p-3 rounded-xl bg-forest-950/80 border border-forest-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Beam Status:</span>
              <span
                className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                  telemetry.irSensorActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                    : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}
              >
                {telemetry.irSensorActive ? 'ACTIVE (ITEM INTAKE)' : 'UNBLOCKED (CLEAR)'}
              </span>
            </div>
          </div>

          <button
            onClick={() => testSensor('ir')}
            className="w-full py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-slate-200 border border-forest-700 text-xs font-mono flex items-center justify-center gap-1.5 transition"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Simulate IR Beam Trigger</span>
          </button>
        </div>

        {/* Sensor 2: Capacitive Moisture Sensor v1.2 */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400">Capacitive Moisture</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-forest-950 px-2 py-0.5 rounded border border-forest-800">
                ADC1 CH0 (GPIO 36)
              </span>
            </div>
            <h3 className="font-heading font-bold text-white text-base mt-1">
              Analog Soil/Waste Probe
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Organic vs Dry Discrimination
            </p>

            <div className="my-4 p-3 rounded-xl bg-forest-950/80 border border-forest-800">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Water Content:</span>
                <span className="text-lg font-bold text-teal-300">{telemetry.moistureValue}%</span>
              </div>
              <div className="w-full bg-forest-900 h-2 rounded-full overflow-hidden mt-2 border border-forest-800">
                <div
                  className="bg-teal-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, telemetry.moistureValue)}%` }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => testSensor('moisture')}
            className="w-full py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-slate-200 border border-forest-700 text-xs font-mono flex items-center justify-center gap-1.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-teal-400" />
            <span>Simulate Moisture Jitter</span>
          </button>
        </div>

        {/* Sensor 3: LJ12A3 Inductive Proximity Metal Sensor */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400">Inductive Proximity</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-forest-950 px-2 py-0.5 rounded border border-forest-800">
                GPIO 23 (NPN)
              </span>
            </div>
            <h3 className="font-heading font-bold text-white text-base mt-1">
              LJ12A3-4-Z/BX Metal Probe
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Ferrous / Non-Ferrous Eddy Probe
            </p>

            <div className="my-4 p-3 rounded-xl bg-forest-950/80 border border-forest-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Eddy Field:</span>
              <span
                className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                  telemetry.metalSensorActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse'
                    : 'bg-forest-900 text-slate-400'
                }`}
              >
                {telemetry.metalSensorActive ? 'METAL DETECTED' : 'NON-METALLIC'}
              </span>
            </div>
          </div>

          <button
            onClick={() => testSensor('metal')}
            className="w-full py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-slate-200 border border-forest-700 text-xs font-mono flex items-center justify-center gap-1.5 transition"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Toggle Metal Proximity</span>
          </button>
        </div>

        {/* Sensor 4: MG996R High-Torque Servo Motor */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400">PWM Actuator Servo</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-forest-950 px-2 py-0.5 rounded border border-forest-800">
                LEDC CH1 (GPIO 19)
              </span>
            </div>
            <h3 className="font-heading font-bold text-white text-base mt-1">
              MG996R Metal Gear Servo
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Chute Diverter Gate Angle
            </p>

            <div className="my-4 p-3 rounded-xl bg-forest-950/80 border border-forest-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Current Position:</span>
              <span className="font-mono text-lg font-bold text-lime-300">
                {telemetry.servoAngle}°
              </span>
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-400 text-center py-1 bg-forest-950 rounded-lg border border-forest-800">
            PWM Range: 500µs - 2500µs (50Hz)
          </div>
        </div>
      </div>

      {/* Secondary Hardware Health & Environment Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Core Temperature */}
        <div className="p-4 rounded-xl bg-forest-900/60 border border-emerald-950 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-slate-400">ESP32 Core Temp</span>
            <div className="text-xl font-bold font-heading text-white mt-0.5">
              {telemetry.esp32TempC}°C
            </div>
            <span className="text-[10px] font-mono text-emerald-400">Normal Range (30-65°C)</span>
          </div>
          <Thermometer className="w-8 h-8 text-emerald-400/60" />
        </div>

        {/* Ambient Humidity */}
        <div className="p-4 rounded-xl bg-forest-900/60 border border-emerald-950 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-slate-400">Ambient Chamber Humidity</span>
            <div className="text-xl font-bold font-heading text-white mt-0.5">
              {telemetry.humidityPercent}% RH
            </div>
            <span className="text-[10px] font-mono text-teal-400">DHT22 Digital Sensor</span>
          </div>
          <Gauge className="w-8 h-8 text-teal-400/60" />
        </div>

        {/* Wi-Fi RSSI */}
        <div className="p-4 rounded-xl bg-forest-900/60 border border-emerald-950 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-slate-400">Wi-Fi Signal Strength</span>
            <div className="text-xl font-bold font-heading text-white mt-0.5">
              {telemetry.wifiRssi} dBm
            </div>
            <span className="text-[10px] font-mono text-cyan-400">802.11 b/g/n Excellent</span>
          </div>
          <Wifi className="w-8 h-8 text-cyan-400/60" />
        </div>

        {/* MQTT Transmission Rate */}
        <div className="p-4 rounded-xl bg-forest-900/60 border border-emerald-950 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-slate-400">MQTT Packet Throughput</span>
            <div className="text-xl font-bold font-heading text-white mt-0.5">
              {telemetry.mqttPacketsSec} msgs/s
            </div>
            <span className="text-[10px] font-mono text-lime-400">QoS Level 1 (At Least Once)</span>
          </div>
          <Activity className="w-8 h-8 text-lime-400/60" />
        </div>
      </div>
    </div>
  );
};
