"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Upload,
  Camera,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Coffee,
  Clock,
  Check,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ArrivalPreference {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ElementType;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const BOOKING = {
  guestName: "Ashish Sharma",
  bookingRef: "SWG-8921",
  property: "Grand Central Tech Hotel",
  location: "Outer Ring Road, Bengaluru",
  arrival: "Today",
  roomType: "Deluxe Corporate Room",
  nights: "2 Nights",
};

const ARRIVAL_PREFERENCES: ArrivalPreference[] = [
  {
    id: "early-checkin",
    label: "Request Early Check-in",
    sublabel: "Before 2:00 PM, subject to availability",
    icon: Clock,
  },
  {
    id: "breakfast",
    label: "Request Complimentary Breakfast",
    sublabel: "Continental buffet, 7:00 AM - 10:30 AM",
    icon: Coffee,
  },
];

// ─── Shared primitives ────────────────────────────────────────────────────────

const VERIFY_PHASES = [
  "Scanning identity document...",
  "Running biometric comparison...",
  "Writing guest record to PMS...",
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1">
      {children}
    </p>
  );
}

function Divider() {
  return <div className="border-t border-[0.5px] border-neutral-800 my-1" />;
}

// ─── Step components ──────────────────────────────────────────────────────────

function StepWelcome({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      key="s1"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22 }}
      className="flex-1 flex flex-col justify-between"
    >
      <div className="space-y-6">
        <div>
          <Eyebrow>Pre-Arrival Check-In</Eyebrow>
          <h1 className="text-2xl font-semibold text-white leading-snug">
            Welcome,<br />{BOOKING.guestName}
          </h1>
          <p className="text-neutral-500 text-xs mt-1">
            {BOOKING.property}, {BOOKING.location}
          </p>
        </div>

        {/* Booking summary */}
        <div className="border border-[0.5px] border-neutral-800 rounded-sm">
          {[
            { label: "Booking Ref", value: BOOKING.bookingRef, mono: true },
            { label: "Room Type", value: BOOKING.roomType },
            { label: "Arrival", value: BOOKING.arrival },
            { label: "Duration", value: BOOKING.nights },
          ].map(({ label, value, mono }, i, arr) => (
            <div key={label}>
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-[10px] uppercase tracking-widest text-neutral-500">
                  {label}
                </span>
                <span
                  className={`text-xs font-semibold text-white ${
                    mono ? "font-mono" : ""
                  }`}
                >
                  {value}
                </span>
              </div>
              {i < arr.length - 1 && (
                <div className="border-t border-[0.5px] border-neutral-800" />
              )}
            </div>
          ))}
        </div>

        {/* Notice */}
        <div className="border border-[0.5px] border-neutral-800 rounded-sm px-4 py-3 flex gap-3 items-start">
          <ShieldCheck className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
          <p className="text-xs text-neutral-400 leading-relaxed">
            Provide your identity documents in the next step to complete
            biometric verification and skip the front-desk queue on arrival.
          </p>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full mt-8 bg-white hover:bg-neutral-200 text-black font-semibold text-sm py-3.5 rounded-sm flex items-center justify-center gap-2 transition-colors"
      >
        Begin Identity Verification
        <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

function StepBiometrics({ onNext }: { onNext: () => void }) {
  const [idUploaded, setIdUploaded] = useState(false);
  const [selfieUploaded, setSelfieUploaded] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const idRef = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);

  const canSubmit = idUploaded && selfieUploaded && !isVerifying;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setIsVerifying(true);
    setPhaseIndex(0);
    const t1 = setTimeout(() => setPhaseIndex(1), 900);
    const t2 = setTimeout(() => setPhaseIndex(2), 1800);
    const t3 = setTimeout(() => {
      clearTimeout(t1);
      clearTimeout(t2);
      setIsVerifying(false);
      onNext();
    }, 2600);
    return () => clearTimeout(t3);
  };

  const UploadZone = ({
    uploaded,
    onClick,
    primaryLabel,
    secondaryLabel,
    icon: Icon,
  }: {
    uploaded: boolean;
    onClick: () => void;
    primaryLabel: string;
    secondaryLabel: string;
    icon: React.ElementType;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-full border border-[0.5px] rounded-sm px-4 py-4 flex items-center justify-between gap-3 text-left transition-colors ${
        uploaded
          ? "border-neutral-600 bg-neutral-900"
          : "border-neutral-800 bg-black hover:border-neutral-700"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-neutral-400 shrink-0" />
        <div>
          <p className="text-xs font-medium text-white">{primaryLabel}</p>
          <p className="text-[11px] text-neutral-500 mt-0.5">{secondaryLabel}</p>
        </div>
      </div>
      {uploaded ? (
        <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
      ) : (
        <span className="text-[10px] uppercase tracking-widest text-neutral-600">
          Upload
        </span>
      )}
    </button>
  );

  return (
    <motion.div
      key="s2"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22 }}
      className="flex-1 flex flex-col justify-between"
    >
      <div className="space-y-5">
        <div>
          <Eyebrow>Step 2 of 3</Eyebrow>
          <h2 className="text-2xl font-semibold text-white">Identity Verification</h2>
          <p className="text-neutral-500 text-xs mt-1">
            Mandatory regulatory compliance. Documents are processed locally.
          </p>
        </div>

        <div className="space-y-2">
          <Eyebrow>Government ID</Eyebrow>
          <UploadZone
            uploaded={idUploaded}
            onClick={() => idRef.current?.click()}
            icon={Upload}
            primaryLabel={idUploaded ? "Document Attached" : "Aadhaar / Passport / Driving Licence"}
            secondaryLabel={idUploaded ? "Ready for verification" : "JPG or PDF, max 10 MB"}
          />
          <input
            ref={idRef}
            type="file"
            className="hidden"
            onChange={() => setIdUploaded(true)}
          />
        </div>

        <div className="space-y-2">
          <Eyebrow>Live Selfie</Eyebrow>
          <UploadZone
            uploaded={selfieUploaded}
            onClick={() => selfieRef.current?.click()}
            icon={Camera}
            primaryLabel={selfieUploaded ? "Photo Captured" : "Take or Upload Selfie"}
            secondaryLabel={
              selfieUploaded ? "Face match ready" : "Ensure even lighting, face clearly visible"
            }
          />
          <input
            ref={selfieRef}
            type="file"
            accept="image/*"
            capture="user"
            className="hidden"
            onChange={() => setSelfieUploaded(true)}
          />
        </div>

        {!canSubmit && !isVerifying && (
          <p className="text-[11px] text-neutral-600 text-center">
            Both documents required to proceed.
          </p>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`w-full mt-8 font-semibold text-sm py-3.5 rounded-sm flex items-center justify-center gap-2 transition-colors ${
          canSubmit
            ? "bg-white hover:bg-neutral-200 text-black cursor-pointer"
            : isVerifying
            ? "bg-neutral-900 text-neutral-400 border border-[0.5px] border-neutral-800 cursor-default"
            : "bg-neutral-900 text-neutral-600 border border-[0.5px] border-neutral-800 cursor-not-allowed"
        }`}
      >
        {isVerifying ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>{VERIFY_PHASES[phaseIndex]}</span>
          </>
        ) : (
          <>
            Submit for Verification
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </motion.div>
  );
}

function StepPreferences({ onNext }: { onNext: () => void }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [earlyCheckinTime, setEarlyCheckinTime] = useState<string | null>(null);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        // Clear time selection if early check-in is toggled off
        if (id === "early-checkin") setEarlyCheckinTime(null);
      } else {
        next.add(id);
      }
      return next;
    });

  const earlyCheckinOn = selected.has("early-checkin");

  const TIME_SLOTS = [
    "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM",
    "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
  ];

  const canProceed = !earlyCheckinOn || (earlyCheckinOn && earlyCheckinTime !== null);

  return (
    <motion.div
      key="s3"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22 }}
      className="flex-1 flex flex-col justify-between"
    >
      <div className="space-y-5">
        <div>
          <Eyebrow>Step 3 of 3</Eyebrow>
          <h2 className="text-2xl font-semibold text-white">Arrival Preferences</h2>
          <p className="text-neutral-500 text-xs mt-1">
            Optional requests attached to your booking confirmation.
          </p>
        </div>

        <div className="space-y-2">
          {ARRIVAL_PREFERENCES.map((pref) => {
            const Icon = pref.icon;
            const isOn = selected.has(pref.id);
            return (
              <div key={pref.id} className="space-y-0">
                <button
                  type="button"
                  onClick={() => toggle(pref.id)}
                  className={`w-full text-left border border-[0.5px] rounded-none px-4 py-4 flex items-center justify-between gap-4 transition-colors ${
                    isOn
                      ? "border-white bg-neutral-900"
                      : "border-neutral-800 bg-black hover:border-neutral-700"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-white">{pref.label}</p>
                      <p className="text-[11px] text-neutral-500 mt-0.5">{pref.sublabel}</p>
                    </div>
                  </div>
                  {/* Toggle track */}
                  <div
                    className={`w-8 h-4 rounded-full shrink-0 flex items-center transition-colors px-0.5 ${
                      isOn ? "bg-white" : "bg-neutral-700"
                    }`}
                  >
                    <motion.div
                      animate={{ x: isOn ? 16 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className={`w-3 h-3 rounded-full ${isOn ? "bg-black" : "bg-neutral-400"}`}
                    />
                  </div>
                </button>

                {/* Time slot picker — only for early check-in */}
                <AnimatePresence>
                  {pref.id === "early-checkin" && isOn && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-x border-b border-[0.5px] border-white bg-neutral-950"
                    >
                      <div className="px-4 pt-4 pb-4 space-y-3">
                        <p className="text-[10px] uppercase tracking-widest text-neutral-500">
                          Preferred Arrival Time
                        </p>
                        <div className="grid grid-cols-4 gap-1.5">
                          {TIME_SLOTS.map((slot) => {
                            const active = earlyCheckinTime === slot;
                            return (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => setEarlyCheckinTime(slot)}
                                className={`text-[11px] py-2 text-center border border-[0.5px] transition-colors font-medium ${
                                  active
                                    ? "bg-white text-black border-white"
                                    : "bg-black text-neutral-400 border-neutral-800 hover:border-neutral-600 hover:text-neutral-200"
                                }`}
                              >
                                {slot}
                              </button>
                            );
                          })}
                        </div>
                        {!earlyCheckinTime && (
                          <p className="text-[11px] text-neutral-600">
                            Select a preferred arrival window to continue.
                          </p>
                        )}
                        {earlyCheckinTime && (
                          <p className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            Requesting arrival at{" "}
                            <span className="text-white font-semibold">{earlyCheckinTime}</span>
                            {" "} (subject to housekeeping availability)
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="border border-[0.5px] border-neutral-800 px-4 py-3">
          <p className="text-[11px] text-neutral-500 leading-relaxed">
            Requests are noted on your folio and actioned by hotel staff. Approval
            is subject to availability and property policy.
          </p>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!canProceed}
        className={`w-full mt-8 font-semibold text-sm py-3.5 flex items-center justify-center gap-2 transition-colors ${
          canProceed
            ? "bg-white hover:bg-neutral-200 text-black cursor-pointer"
            : "bg-neutral-900 text-neutral-600 border border-[0.5px] border-neutral-800 cursor-not-allowed"
        }`}
      >
        Complete Check-In
        <Check className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

function StepSuccess() {
  return (
    <motion.div
      key="s4"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22 }}
      className="flex-1 flex flex-col justify-center items-center text-center gap-8 px-2"
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.1 }}
        className="w-14 h-14 border border-[0.5px] border-white rounded-sm flex items-center justify-center"
      >
        <Check className="w-6 h-6 text-white" />
      </motion.div>

      <div className="space-y-3">
        <Eyebrow>Booking Ref: {BOOKING.bookingRef}</Eyebrow>
        <h2 className="text-3xl font-semibold text-white leading-tight">
          Check-in<br />Complete.
        </h2>
        <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
          Please collect your physical key at the{" "}
          <span className="text-white font-medium">Express Desk</span> on arrival.
          No queue, no forms.
        </p>
      </div>

      <Divider />

      <div className="w-full space-y-3 text-left">
        {[
          { label: "Identity Status", value: "Verified" },
          { label: "Folio", value: BOOKING.bookingRef },
          { label: "Property", value: BOOKING.property },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between text-xs">
            <span className="text-[10px] uppercase tracking-widest text-neutral-600">
              {label}
            </span>
            <span className="text-neutral-300 font-medium">{value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function CheckInPage() {
  const [step, setStep] = useState(1);

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
              <p className="text-xs font-semibold text-white mt-0.5">Pre-Arrival Check-In</p>
            </div>
          </div>
          {/* Step indicator dots */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`rounded-none transition-all duration-300 ${
                  s === step
                    ? "w-5 h-1 bg-white"
                    : s < step
                    ? "w-2 h-1 bg-neutral-600"
                    : "w-2 h-1 bg-neutral-800"
                }`}
              />
            ))}
          </div>
        </header>

        {/* Step content */}
        <div className="flex-1 flex flex-col px-6 py-7 overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === 1 && <StepWelcome onNext={() => setStep(2)} />}
            {step === 2 && <StepBiometrics onNext={() => setStep(3)} />}
            {step === 3 && <StepPreferences onNext={() => setStep(4)} />}
            {step === 4 && <StepSuccess />}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="px-6 py-4 border-t border-[0.5px] border-neutral-800 shrink-0">
          <p className="text-[10px] uppercase tracking-widest text-neutral-700 text-center">
            SwiftGate Technologies - Secure Guest Platform
          </p>
        </footer>
      </div>
    </div>
  );
}
