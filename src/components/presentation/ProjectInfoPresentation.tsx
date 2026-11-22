import React, { useState } from 'react';
import {
  GraduationCap,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Zap,
  Radio,
  FileCode,
  Sparkles,
  Award
} from 'lucide-react';

export const ProjectInfoPresentation: React.FC = () => {
  const [activeVivaIndex, setActiveVivaIndex] = useState<number | null>(0);

  const vivaQuestions = [
    {
      q: 'How does the system cross-validate AI optical classification with physical sensors?',
      a: 'The system uses Sensor Fusion. While the MobileNetV2 vision model achieves ~98% image accuracy, optical reflection alone cannot reliably distinguish between clear PET plastic and clear glass, or painted aluminum vs painted plastic. By polling the LJ12A3 Inductive Proximity Sensor (measuring eddy currents for metals) and the Capacitive Moisture Probe (measuring dielectric constant for water content), the microcontroller cross-validates the AI prediction before commanding the servo actuator.',
    },
    {
      q: 'Why use an ESP32 instead of an Arduino Uno for this prototype?',
      a: 'The ESP32 features a dual-core Xtensa 32-bit processor running at 240MHz with built-in Wi-Fi and Bluetooth. Core 0 handles low-latency 50Hz sensor polling and FreeRTOS task scheduling, while Core 1 manages MQTT packet telemetry and Edge AI inference communication. An Arduino Uno (ATmega328P @ 16MHz) lacks the RAM and computational bandwidth for neural network quantized tensors or native TCP/IP networking.',
    },
    {
      q: 'How is the bin fill percentage calculated from ultrasonic readings?',
      a: 'The ultrasonic sensor HC-SR04 measures the Time-of-Flight (ToF) of a 40kHz sound burst. Formula: Distance = (Time × 0.0343) / 2 cm. Since container depth is fixed (60 cm), Fill% = ((60 - Distance) / 60) × 100. When Distance <= 12 cm (80%), a warning alert is fired. When Distance <= 5 cm (100%), the physical servo interlock locks the chute flapper to prevent overflow.',
    },
    {
      q: 'What is the mechanical actuation response time of the MG996R servo?',
      a: 'The MG996R metal-gear servo operates at 0.17s / 60° at 6V with 11 kg·cm stall torque. Homing the sorting chute across our ±45° range takes approximately 180ms to 240ms, well within the 1200ms conveyor transit window between the AI inspection chamber and the drop chute.',
    },
    {
      q: 'What are the environmental and economic benefits of decentralized AI waste sorting?',
      a: 'Manual sorting exposes workers to hazardous pathogens and cuts. Decentralized sorting at source eliminates contamination of recyclables—wet organic waste ruins dry paper pulp if co-mingled. Furthermore, recycling 1 kg of aluminum saves 95% of virgin bauxite smelting energy and prevents 4.8 kg of CO₂ equivalent emissions.',
    },
  ];

  const hardwareList = [
    {
      name: 'ESP32-WROOM-32D Dual-Core MCU',
      role: 'Master Controller',
      specs: '240MHz, 520KB SRAM, FreeRTOS, Integrated 802.11b/g/n Wi-Fi & BLE',
    },
    {
      name: 'ESP32-CAM AI Vision Module',
      role: 'Optical Inspection',
      specs: 'OV2640 2MP Camera, 4MB PSRAM, TensorFlow Lite Micro Edge Runtime',
    },
    {
      name: 'Sharp GP2Y0A21YK IR Sensor',
      role: 'Intake Trigger',
      specs: '10cm to 80cm Analog/Digital Beam Interrupt for Conveyor Synchronization',
    },
    {
      name: 'LJ12A3-4-Z/BX Inductive Proximity Probe',
      role: 'Metal Detection',
      specs: '4mm sensing distance, Eddy current oscillation detection (NPN Normal Open)',
    },
    {
      name: 'Capacitive Moisture Sensor v1.2',
      role: 'Organic/Wet Discrimination',
      specs: 'Corrosion-resistant capacitive dielectric probe, 0-3.3V analog output',
    },
    {
      name: 'HC-SR04 Ultrasonic Sensor Array (x5)',
      role: 'Bin Fill Monitoring',
      specs: '40kHz sonar burst, 2cm to 400cm range with 3mm precision',
    },
    {
      name: 'MG996R High-Torque Metal Gear Servo',
      role: 'Chute Sorting Actuator',
      specs: '11 kg·cm torque @ 6V, 0.17s/60° rapid positioning, PWM control',
    },
    {
      name: '12V DC Geared Motor + L298N Dual H-Bridge',
      role: 'Conveyor Drive',
      specs: '150 RPM high-torque motor with PWM speed regulation & optical encoder',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-emerald-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
              B.TECH CAPSTONE DOCUMENTATION
            </span>
            <span className="text-xs text-slate-400 font-mono">
              DEPARTMENT OF ELECTRONICS & COMPUTER ENGINEERING
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-heading text-white mt-1">
            Academic Project Overview & Exhibition Guide
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Complete technical specification, system block architecture, and Viva Voce defense preparation
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-forest-900 border border-emerald-500/40 text-xs font-mono text-emerald-300">
          <Award className="w-4 h-4 text-emerald-400" />
          <span>Exhibition Ready Prototype</span>
        </div>
      </div>

      {/* Project Abstract, Problem & Solution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20">
          <span className="text-xs font-mono font-bold uppercase text-red-400 block mb-1">
            01 // The Problem
          </span>
          <h3 className="font-heading font-bold text-white text-base mb-2">
            Municipal Waste Crisis
          </h3>
          <p className="text-xs text-slate-300 font-mono leading-relaxed">
            Over 2.01 billion tons of municipal solid waste is generated globally per year. Over 70% ends up in open landfills due to lack of source segregation. Manual hand-sorting is hazardous, slow, and leads to cross-contamination of recyclable materials.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20">
          <span className="text-xs font-mono font-bold uppercase text-emerald-400 block mb-1">
            02 // Proposed Solution
          </span>
          <h3 className="font-heading font-bold text-white text-base mb-2">
            AIoT Multi-Modal Sorter
          </h3>
          <p className="text-xs text-slate-300 font-mono leading-relaxed">
            An automated smart segregation station integrating computer vision (MobileNetV2) with capacitive moisture and inductive metal sensors on an automated conveyor. Real-time telemetry is streamed via MQTT to a central SCADA industrial dashboard.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20">
          <span className="text-xs font-mono font-bold uppercase text-teal-400 block mb-1">
            03 // Project Objectives
          </span>
          <h3 className="font-heading font-bold text-white text-base mb-2">
            High Accuracy & Throughput
          </h3>
          <p className="text-xs text-slate-300 font-mono leading-relaxed">
            1. Achieve &gt;95% segregation accuracy across 5 distinct waste streams.<br />
            2. Eliminate manual physical contact with hazardous municipal waste.<br />
            3. Provide live IoT ultrasonic capacity tracking with automated overflow interlocks.
          </p>
        </div>
      </div>

      {/* SYSTEM ARCHITECTURE INTERACTIVE FLOW DIAGRAM (Section 11 Requirement) */}
      <div className="glass-panel-glow p-6 rounded-3xl border border-emerald-500/30">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-forest-800">
          <div>
            <h3 className="font-heading font-bold text-white text-lg flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <span>End-to-End System Architecture Flow Diagram</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Signal routing from physical intake hopper through edge AI inference to multi-chute containment
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-1 rounded border border-emerald-500/30">
            Hardware Bus Architecture
          </span>
        </div>

        {/* Visual Flow Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2 items-center text-center font-mono">
          {/* Node 1 */}
          <div className="p-3 rounded-xl bg-forest-900 border border-emerald-500/40">
            <span className="text-[10px] text-slate-400 block">STAGE 1</span>
            <strong className="text-xs text-white block mt-1">Waste Input</strong>
            <span className="text-[9px] text-emerald-400">IR Hopper Sensor</span>
          </div>

          <div className="hidden md:flex justify-center text-emerald-400">
            <ArrowRight className="w-5 h-5" />
          </div>

          {/* Node 2 */}
          <div className="p-3 rounded-xl bg-forest-900 border border-teal-500/40">
            <span className="text-[10px] text-slate-400 block">STAGE 2</span>
            <strong className="text-xs text-white block mt-1">Camera & Sensors</strong>
            <span className="text-[9px] text-teal-400">Moisture & Metal</span>
          </div>

          <div className="hidden md:flex justify-center text-emerald-400">
            <ArrowRight className="w-5 h-5" />
          </div>

          {/* Node 3 */}
          <div className="p-3 rounded-xl bg-forest-900 border border-cyan-500/40">
            <span className="text-[10px] text-slate-400 block">STAGE 3</span>
            <strong className="text-xs text-white block mt-1">AI Inference</strong>
            <span className="text-[9px] text-cyan-400">MobileNetV2 Edge</span>
          </div>

          <div className="hidden md:flex justify-center text-emerald-400">
            <ArrowRight className="w-5 h-5" />
          </div>

          {/* Node 4 */}
          <div className="p-3 rounded-xl bg-forest-900 border border-lime-500/40">
            <span className="text-[10px] text-slate-400 block">STAGE 4</span>
            <strong className="text-xs text-white block mt-1">Microcontroller</strong>
            <span className="text-[9px] text-lime-400">ESP32 Dual-Core</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center text-center font-mono mt-4 pt-4 border-t border-forest-800">
          <div className="hidden md:block col-span-1" />

          {/* Node 5 */}
          <div className="p-3 rounded-xl bg-forest-900 border border-amber-500/40">
            <span className="text-[10px] text-slate-400 block">STAGE 5</span>
            <strong className="text-xs text-white block mt-1">Servo Mechanism</strong>
            <span className="text-[9px] text-amber-400">MG996R Angle Align</span>
          </div>

          <div className="hidden md:flex justify-center text-emerald-400">
            <ArrowRight className="w-5 h-5" />
          </div>

          {/* Node 6 */}
          <div className="p-3 rounded-xl bg-forest-900 border border-emerald-500/40">
            <span className="text-[10px] text-slate-400 block">STAGE 6</span>
            <strong className="text-xs text-white block mt-1">Smart Bins Array</strong>
            <span className="text-[9px] text-emerald-400">Ultrasonic HC-SR04</span>
          </div>

          <div className="hidden md:block col-span-1" />
        </div>
      </div>

      {/* Hardware Components Table */}
      <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20">
        <h3 className="font-heading font-bold text-white text-base mb-3 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>Detailed Hardware Component Bill of Materials (BOM)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
          {hardwareList.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-forest-900/60 border border-forest-800 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{item.name}</span>
                <span className="text-[10px] text-emerald-400 bg-forest-950 px-2 py-0.5 rounded border border-forest-800">
                  {item.role}
                </span>
              </div>
              <p className="text-slate-400 text-[11px] mt-1">{item.specs}</p>
            </div>
          ))}
        </div>
      </div>

      {/* College Exhibition Viva Voce Defense Prep */}
      <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400">
              <GraduationCap className="w-4 h-4" />
            </span>
            <h3 className="font-heading font-bold text-white text-base">
              Faculty Viva Voce & Evaluation Defense Questions
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400">
            Click any question to view the technical answer
          </span>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {vivaQuestions.map((v, idx) => {
            const isOpen = activeVivaIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-forest-800 bg-forest-900/50 overflow-hidden"
              >
                <button
                  onClick={() => setActiveVivaIndex(isOpen ? null : idx)}
                  className="w-full p-3.5 text-left flex items-center justify-between hover:bg-forest-900 transition"
                >
                  <span className="font-bold text-slate-200 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      Q{idx + 1}: {v.q}
                    </span>
                  </span>
                  <span className="text-emerald-400 font-bold ml-2">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div className="p-3.5 bg-forest-950/90 border-t border-forest-800 text-slate-300 leading-relaxed">
                    <strong className="text-emerald-400 block mb-1">Recommended Response:</strong>
                    {v.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
