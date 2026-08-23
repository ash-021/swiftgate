"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate network request
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div id="sales" className="border-[0.5px] border-neutral-800 bg-neutral-950 p-8 w-full max-w-md mx-auto">
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-widest text-emerald-500 font-mono">
          Priority Onboarding
        </p>
        <h3 className="text-xl font-semibold text-white mt-1">Talk to Sales</h3>
        <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
          Ready to eliminate check-in queues and capture incremental revenue? Leave your details and we&apos;ll be in touch.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-10 space-y-4"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border-[0.5px] border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-white font-medium">Inquiry Received</h4>
              <p className="text-xs text-neutral-400 mt-1 max-w-[200px] mx-auto">
                Our enterprise team will contact you within 24 hours.
              </p>
            </div>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 text-[10px] uppercase tracking-widest text-neutral-500 hover:text-white transition-colors"
            >
              Submit another request
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-neutral-500">Full Name</label>
                <input required type="text" className="w-full bg-black border-[0.5px] border-neutral-800 p-2.5 text-xs text-white placeholder-neutral-700 outline-none focus:border-neutral-500 transition-colors" placeholder="John Doe" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-neutral-500">Work Email</label>
                <input required type="email" className="w-full bg-black border-[0.5px] border-neutral-800 p-2.5 text-xs text-white placeholder-neutral-700 outline-none focus:border-neutral-500 transition-colors" placeholder="john@hotel.com" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-neutral-500">Property / Group Name</label>
              <input required type="text" className="w-full bg-black border-[0.5px] border-neutral-800 p-2.5 text-xs text-white placeholder-neutral-700 outline-none focus:border-neutral-500 transition-colors" placeholder="Grand Central Tech Hotel" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-neutral-500">Portfolio Size</label>
                <select required className="w-full bg-black border-[0.5px] border-neutral-800 p-2.5 text-xs text-white outline-none focus:border-neutral-500 transition-colors appearance-none cursor-pointer">
                  <option value="" disabled selected>Select Rooms</option>
                  <option value="1-50">1 - 50 Rooms</option>
                  <option value="51-200">51 - 200 Rooms</option>
                  <option value="201-500">201 - 500 Rooms</option>
                  <option value="500+">500+ Rooms</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-neutral-500">Primary Interest</label>
                <select required className="w-full bg-black border-[0.5px] border-neutral-800 p-2.5 text-xs text-white outline-none focus:border-neutral-500 transition-colors appearance-none cursor-pointer">
                  <option value="" disabled selected>Select Area</option>
                  <option value="checkin">Pre-Arrival Check-In</option>
                  <option value="concierge">In-Room Concierge</option>
                  <option value="both">Full Platform</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-white hover:bg-neutral-200 text-black font-semibold text-xs py-3 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Transmitting..." : "Talk to Sales"}
              {!loading && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
