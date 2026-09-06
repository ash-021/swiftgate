'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DigiLockerFlow from '@/components/DigiLockerFlow';
import PassportScanner from '@/components/PassportScanner';

type Flow = 'SELECT' | 'INDIAN_RESIDENT' | 'INTERNATIONAL';

export default function CheckinPage() {
  const [flow, setFlow] = useState<Flow>('SELECT');

  return (
    <div className="min-h-screen bg-black text-white flex justify-center">
      <div className="w-full max-w-md min-h-screen flex flex-col border-x border-[0.5px] border-neutral-800">
        
        {/* Header */}
        <header className="px-6 py-5 border-b border-[0.5px] border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="SwiftGate Logo" className="h-5 w-auto object-contain" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-neutral-500">
                SwiftGate
              </p>
              <p className="text-xs font-semibold text-white mt-0.5">
                Express Check-In
              </p>
            </div>
          </div>
          {flow !== 'SELECT' && (
            <button
              onClick={() => setFlow('SELECT')}
              className="text-[10px] uppercase tracking-widest text-neutral-500 hover:text-white transition-colors"
            >
              ← Back
            </button>
          )}
        </header>

        {/* Content */}
        <div className="flex-1 flex flex-col px-6 py-7 overflow-y-auto">
          <AnimatePresence mode="wait">
            
            {/* SELECTION SCREEN */}
            {flow === 'SELECT' && (
              <motion.div
                key="select"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="flex-1 flex flex-col justify-center"
              >
                <div className="mb-8 text-center space-y-2">
                  <h2 className="text-2xl font-semibold text-white">Welcome</h2>
                  <p className="text-neutral-500 text-sm">
                    Select your residency status to begin check-in.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <button
                    onClick={() => setFlow('INDIAN_RESIDENT')}
                    className="w-full border border-[0.5px] border-neutral-800 bg-neutral-900/30 hover:bg-neutral-800/50 hover:border-neutral-700 rounded-sm p-6 flex flex-col items-center gap-3 transition-colors text-center"
                  >
                    <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <div>
                      <h3 className="font-medium text-white text-sm">Indian Resident</h3>
                      <p className="text-neutral-500 text-xs mt-1">Aadhaar / DigiLocker Verification</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setFlow('INTERNATIONAL')}
                    className="w-full border border-[0.5px] border-neutral-800 bg-neutral-900/30 hover:bg-neutral-800/50 hover:border-neutral-700 rounded-sm p-6 flex flex-col items-center gap-3 transition-colors text-center"
                  >
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="font-medium text-white text-sm">International Guest</h3>
                      <p className="text-neutral-500 text-xs mt-1">Passport & E-Visa Scanning</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {/* INDIAN RESIDENT FLOW */}
            {flow === 'INDIAN_RESIDENT' && (
              <DigiLockerFlow key="indian" />
            )}

            {/* INTERNATIONAL GUEST FLOW */}
            {flow === 'INTERNATIONAL' && (
              <PassportScanner key="intl" />
            )}

          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="px-6 py-4 border-t border-[0.5px] border-neutral-800 shrink-0">
          <p className="text-[10px] uppercase tracking-widest text-neutral-700 text-center">
            SwiftGate Technologies &mdash; Secure Guest Platform
          </p>
        </footer>
      </div>
    </div>
  );
}
