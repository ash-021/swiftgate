"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Smartphone,
  MessageSquare,
  Sparkles,
  Camera,
  DoorOpen,
  ArrowRight,
} from "lucide-react";

export default function WorkflowSimulation() {
  // Phase 0: WhatsApp Notification
  // Phase 1: PWA ID Scanning & Masking
  // Phase 2: Live Selfie Liveness
  // Phase 3: Check-in Confirmed
  // Phase 4: Follow-up WhatsApp Pass
  const [phase, setPhase] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase((prev) => (prev + 1) % 5);
    }, 2600); // Transitions every 2.6 seconds (Total loop ~13s)
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-[320px] mx-auto bg-black rounded-[38px] p-3 border-[4px] border-neutral-800 shadow-2xl relative overflow-hidden text-neutral-100 font-sans select-none">
      {/* Phone Notch & Status Bar */}
      <div className="flex justify-between items-center px-4 pt-1 pb-2 text-[10px] font-mono text-neutral-400">
        <span>18:30</span>
        <div className="w-20 h-4 bg-neutral-900 rounded-full mx-auto" />
        <span>5G</span>
      </div>

      {/* Screen Viewport */}
      <div className="h-[460px] bg-neutral-950 rounded-[28px] overflow-hidden relative flex flex-col justify-between p-4 border border-neutral-900">
        <AnimatePresence mode="wait">
          
          {/* ─── PHASE 0: WHATSAPP NOTIFICATION ─── */}
          {phase === 0 && (
            <motion.div
              key="p0"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col justify-between pt-4"
            >
              {/* WhatsApp Push Banner */}
              <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-3.5 shadow-xl backdrop-blur-md">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded bg-emerald-600 flex items-center justify-center">
                      <MessageSquare className="w-2.5 h-2.5 text-white"/>
                    </div>
                    <span className="text-[11px] font-semibold text-neutral-300">WhatsApp</span>
                  </div>
                  <span className="text-[10px] text-neutral-500">now</span>
                </div>
                <p className="text-[11px] font-bold text-white">Grand Central Hotel</p>
                <p className="text-[10px] text-neutral-400 leading-snug mt-0.5">
                  Your reservation is ready. Tap to complete your fast-track verification in under a minute:
                </p>
                <div className="mt-2 text-[10px] text-emerald-400 font-mono bg-neutral-950/60 p-1.5 rounded border border-neutral-800 flex items-center justify-between">
                  <span>swiftgate.io/gch-402</span>
                  <ArrowRight className="w-3 h-3"/>
                </div>
              </div>

              {/* Simulated Finger Tap */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.9] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
                className="w-8 h-8 rounded-full bg-white/20 border border-white/40 mx-auto mb-20"
              />

              <div className="text-center text-[10px] text-neutral-500 font-mono pb-2">
                Step 1: WhatsApp Dispatched
              </div>
            </motion.div>
          )}

          {/* ─── PHASE 1: ID SCAN & EDGE-OCR MASKING ─── */}
          {phase === 1 && (
            <motion.div
              key="p1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-400"/>
                  <span className="text-xs font-bold tracking-tight">SwiftGate PWA</span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-2 font-medium">Scanning Government ID...</p>

                {/* ID Card Wireframe */}
                <div className="mt-3 bg-neutral-900 border border-neutral-800 rounded-xl p-3 relative overflow-hidden">
                  {/* Laser Scan Line Animation */}
                  <motion.div
                    initial={{ top: "0%" }}
                    animate={{ top: "100%" }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-[2px] bg-emerald-400 shadow-[0_0_8px_#34d399]"
                  />
                  <div className="flex gap-2.5 items-center">
                    <div className="w-9 h-11 bg-neutral-800 rounded border border-neutral-700 flex items-center justify-center text-[8px] text-neutral-500">
                      PHOTO
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="h-2 w-20 bg-neutral-700 rounded" />
                      <div className="h-1.5 w-28 bg-neutral-800 rounded" />
                      <div className="h-1.5 w-16 bg-neutral-800 rounded" />
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-neutral-800 flex justify-between items-center text-[9px] font-mono text-neutral-400">
                    <span>Aadhaar ID</span>
                    <span className="text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                      XXXX XXXX 8921
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 p-2 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0"/>
                <span className="text-[10px] text-emerald-300 font-medium">8 Digits Masked in Memory</span>
              </div>
            </motion.div>
          )}

          {/* ─── PHASE 2: LIVE SELFIE MATCH ─── */}
          {phase === 2 && (
            <motion.div
              key="p2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-800">
                  <Camera className="w-4 h-4 text-emerald-400"/>
                  <span className="text-xs font-bold tracking-tight">Biometric Liveness</span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-2">Matching live face to ID document...</p>

                {/* Face Frame */}
                <div className="mt-4 w-28 h-28 mx-auto rounded-full border-2 border-dashed border-emerald-500/70 flex items-center justify-center relative">
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-24 h-24 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-600"
                  >
                    <Sparkles className="w-8 h-8 text-emerald-400 animate-pulse"/>
                  </motion.div>
                </div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 p-2 rounded-lg text-center font-mono text-[10px] text-neutral-300">
                Liveness: 99.4% Match Verified
              </div>
            </motion.div>
          )}

          {/* ─── PHASE 3: CHECK-IN CONFIRMED & ROOM ASSIGNED ─── */}
          {phase === 3 && (
            <motion.div
              key="p3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col justify-between text-center pt-2"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-5 h-5"/>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Check-In Completed</h4>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Written directly to Hotel PMS</p>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-left space-y-1.5">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-neutral-400">Guest</span>
                    <span className="font-semibold text-white">Ashish Sharma</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-neutral-400">Assigned Unit</span>
                    <span className="font-bold text-emerald-400">Room #402</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-neutral-400">Digital Folio</span>
                    <span className="font-mono text-neutral-400">SWG-8921</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-neutral-500 font-mono">
                Total Verification Time: ~45 seconds
              </div>
            </motion.div>
          )}

          {/* ─── PHASE 4: FOLLOW-UP WHATSAPP PASS ─── */}
          {phase === 4 && (
            <motion.div
              key="p4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col justify-between pt-4"
            >
              <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-3.5 shadow-xl">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-4 h-4 rounded bg-emerald-600 flex items-center justify-center">
                    <MessageSquare className="w-2.5 h-2.5 text-white"/>
                  </div>
                  <span className="text-[11px] font-semibold text-neutral-300">WhatsApp</span>
                </div>
                <p className="text-[11px] font-bold text-white">Grand Central Hotel</p>
                <p className="text-[10px] text-neutral-300 leading-snug mt-1">
                  You are all checked in! Present this digital arrival token at the express desk to pick up your key:
                </p>
                <div className="mt-2 bg-black border border-neutral-800 p-2 rounded text-center">
                  <p className="text-[9px] text-neutral-500 uppercase tracking-wider">Fast-Pass Token</p>
                  <p className="text-xs font-mono font-bold text-emerald-400 mt-0.5">ROOM-402-PASS</p>
                </div>
              </div>

              <div className="text-center text-[10px] text-neutral-500 font-mono pb-2">
                ✓ Full End-to-End Handshake Complete
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Phone Bottom Home Bar */}
      <div className="w-28 h-1 bg-neutral-800 rounded-full mx-auto mt-2" />
    </div>
  );
}
