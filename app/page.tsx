"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Database,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Smartphone,
  ArrowUpRight,
  MessageSquare,
  ScanFace,
  ServerCog,
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import WorkflowSimulation from "@/components/WorkflowSimulation";

const QRCodeSVG = dynamic(
  () => import("qrcode.react").then((mod) => ({ default: mod.QRCodeSVG })),
  { ssr: false }
);

// ─── Types ────────────────────────────────────────────────────────────────────

interface LogEntry {
  time: string;
  message: string;
  type: "success" | "info";
}

// ─── Terminal ─────────────────────────────────────────────────────────────────

function TerminalSimulator() {
  const [logs, setLogs] = useState<LogEntry[]>([
    { time: "18:21:44", message: "Core initialization complete. PMS sync active.", type: "info" },
    { time: "18:22:01", message: "WhatsApp API Gateway: Connected (Session #2904)", type: "success" },
    { time: "18:22:19", message: "Biometric Verification Node: Ready", type: "success" },
  ]);

  const logPool: Omit<LogEntry, "time">[] = [
    { message: "Guest #8812 -- Check-in link dispatched via WhatsApp", type: "info" },
    { message: "Aadhaar Document OCR: 100% field extraction confidence", type: "success" },
    { message: "Live selfie biometric matched against ID photo", type: "success" },
    { message: "Folio #8921 written to PMS (Oracle OPERA / IDS Next)", type: "success" },
    { message: "Early check-in preference recorded on folio", type: "info" },
    { message: "F&B Order #3312 routed to Kitchen Display System", type: "success" },
    { message: "GSTIN validation complete. Corporate split-bill generated.", type: "success" },
    { message: "eZee connector heartbeat: 200 OK", type: "info" },
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
      const entry = logPool[index % logPool.length];
      setLogs((prev) => [...prev.slice(-12), { ...entry, time }]);
      index++;
    }, 2000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-black border border-[0.5px] border-neutral-800 overflow-hidden">
      {/* Chrome bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[0.5px] border-neutral-800 bg-neutral-950">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
            ))}
          </div>
          <span className="text-[10px] text-neutral-600 font-mono ml-2 uppercase tracking-widest">
            swiftgate-core-orchestrator
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest">
            Live Feed
          </span>
        </div>
      </div>

      {/* Log stream */}
      <div className="p-4 font-mono text-xs space-y-2 h-56 overflow-y-auto custom-scroll">
        {logs.map((log, i) => (
          <motion.div
            key={`${i}-${log.time}`}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="flex gap-3"
          >
            <span className="text-neutral-700 shrink-0">[{log.time}]</span>
            <span className={log.type === "success" ? "text-neutral-300" : "text-neutral-500"}>
              {log.message}
            </span>
          </motion.div>
        ))}
        <div className="flex gap-3">
          <span className="text-neutral-700 shrink-0">{"  "}</span>
          <span className="text-neutral-600">
            <span className="cursor-blink">_</span>
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Demo Entry Card ──────────────────────────────────────────────────────────

function DemoCard({
  eyebrow,
  title,
  description,
  href,
  qrUrl,
}: {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  qrUrl: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="border border-[0.5px] border-neutral-800 bg-black p-6 flex flex-col gap-6">
      {/* Label */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-neutral-500">{eyebrow}</p>
        <h3 className="text-sm font-semibold text-white mt-1">{title}</h3>
        <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{description}</p>
      </div>

      {/* QR Code */}
      <div className="flex justify-center">
        <div className="bg-white p-3">
          {mounted ? (
            <QRCodeSVG
              value={qrUrl}
              size={120}
              bgColor="#ffffff"
              fgColor="#000000"
              level="M"
            />
          ) : (
            <div className="w-[120px] h-[120px] bg-neutral-200 animate-pulse" />
          )}
        </div>
      </div>

      {/* CTA */}
      <Link
        href={href}
        className="w-full bg-white hover:bg-neutral-200 text-black font-semibold text-xs py-3 flex items-center justify-center gap-2 transition-colors"
      >
        <Smartphone className="w-3.5 h-3.5" />
        {title}
        <ArrowUpRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const pillars = [
    {
      icon: ShieldCheck,
      title: "WhatsApp Biometric Check-In",
      body: "Automated government ID parsing and live face verification via a zero-download WhatsApp flow. Eliminates lobby wait times completely.",
    },
    {
      icon: Database,
      title: "Two-Way PMS Integration",
      body: "Seamlessly integrates with the hotel's existing property management systems (including Oracle OPERA, IDS Next, and others) via bidirectional APIs. Enables real-time folio routing, secure guest profiling, and automated compliance.",
    },
    {
      icon: TrendingUp,
      title: "Incremental Revenue Engine",
      body: "High-conversion pre-arrival upsells and digital in-room F&B ordering. Maximize RevPAR and capture incremental revenue directly through the guest's native mobile browser.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header className="border-b border-[0.5px] border-neutral-800 bg-black/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <p className="font-bold text-lg text-white tracking-tight">SwiftGate</p>
            <div className="hidden md:flex items-center gap-2 ml-2">
              {["WhatsApp-Native", "PMS Integrated", "Biometric Compliance"].map((b) => (
                <span
                  key={b}
                  className="text-[10px] uppercase tracking-widest border border-[0.5px] border-neutral-800 text-neutral-500 px-2.5 py-1"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          <Link
            href="/contactus"
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-neutral-400 hover:text-white border border-[0.5px] border-neutral-800 hover:border-neutral-600 px-4 py-2 transition-colors"
          >
            Talk to Sales
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
          {/* Left */}
          <div className="lg:col-span-3 space-y-8">
            <div className="space-y-5">
              <p className="text-[10px] uppercase tracking-widest text-neutral-500">
                Hospitality Infrastructure
              </p>
              <h1 className="text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-tight">
                Frictionless Check-In &amp; In-Stay Commerce for Modern Hotels.
              </h1>
              <p className="text-neutral-400 text-sm lg:text-base leading-relaxed max-w-xl">
                SwiftGate replaces manual reception bottlenecks with WhatsApp-native
                biometric check-in, automated guest preferences, and PMS-linked in-room
                ordering.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-0 border-[0.5px] border-neutral-800">
              {[
                { value: "< 60s", label: "Pre-Arrival Verification" },
                { value: "0", label: "App Downloads" },
                { value: "+22%", label: "Incremental Revenue" },
              ].map(({ value, label }, i) => (
                <div
                  key={label}
                  className={`px-5 py-5 ${i < 2 ? "border-r-[0.5px] border-neutral-800" : ""}`}
                >
                  <p className="text-2xl font-semibold text-white">{value}</p>
                  <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Two demo entry cards */}
          <div className="lg:col-span-2 space-y-4">
            <p className="text-[10px] uppercase tracking-widest text-neutral-500">
              Live Demo Access
            </p>
            <DemoCard
              eyebrow="Flow 1 of 2 — WhatsApp Trigger"
              title="Launch Pre-Arrival Check-in"
              description="Simulates the guest journey from WhatsApp link to biometric ID verification and arrival preference capture."
              href="/demo/checkin"
              qrUrl={`${origin}/demo/checkin`}
            />
            <DemoCard
              eyebrow="Flow 2 of 2 — In-Room QR Scan"
              title="Launch In-Room Concierge"
              description="Simulates the in-room ordering experience: F&B menu, cart, and direct room-folio charge via Kitchen Display System."
              href="/demo/concierge"
              qrUrl={`${origin}/demo/concierge`}
            />
          </div>
        </section>

        {/* ── Workflow Simulation Showcase ─────────────────────────────────── */}
        <section className="relative py-16 lg:py-20 border border-[0.5px] border-neutral-800 rounded-2xl overflow-hidden mb-16">
          {/* Subtle background texture */}
          <div className="absolute inset-0 bg-neutral-950/40 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:24px_24px] pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center px-6 lg:px-16">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-neutral-500">
                INTERACTIVE PREVIEW
              </p>
              <h2 className="text-2xl font-semibold text-white mt-2 mb-4">
                Pre-Arrival Verification Flow
              </h2>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-md">
                Guests complete regulatory identity verification on their mobile device prior to arrival. Verified guest records and compliance parameters write directly to the hotel management system.
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <WorkflowSimulation />
            </div>
          </div>
        </section>

        {/* ── How It Works ─────────────────────────────────────────────────── */}
        <section className="py-16 border-t-[0.5px] border-neutral-800">
          <div className="mb-10">
            <p className="text-[10px] uppercase tracking-widest text-neutral-500">
              SYSTEM PIPELINE
            </p>
            <h2 className="text-2xl font-semibold text-white mt-2">
              How SwiftGate Operates
            </h2>
            <p className="text-xs text-neutral-500 mt-3 max-w-2xl leading-relaxed">
              A secure verification pipeline completed by guests in under a minute on their own device.
            </p>
          </div>

          {/* 3-step progression */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-[0.5px] border-neutral-800">
            {[
              {
                step: "01",
                icon: MessageSquare,
                title: "Pre-Arrival Dispatch",
                detail:
                  "The property sends an authenticated web link via WhatsApp ahead of the guest's scheduled arrival window.",
              },
              {
                step: "02",
                icon: ScanFace,
                title: "On-Device Verification",
                detail:
                  "Government IDs are parsed locally with automated regulatory masking and real-time facial liveness detection.",
              },
              {
                step: "03",
                icon: ServerCog,
                title: "PMS Synchronization",
                detail:
                  "Verified guest data writes directly to the property management system, generating an express arrival pass for key collection.",
              },
            ].map(({ step, icon: Icon, title, detail }, i) => (
              <div
                key={step}
                className={`p-6 flex flex-col gap-5 ${
                  i < 2 ? "border-b-[0.5px] md:border-b-0 md:border-r-[0.5px] border-neutral-800" : ""
                }`}
              >
                {/* Step number + icon */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-700 font-mono">
                    Step {step}
                  </span>
                  <div className="w-8 h-8 border-[0.5px] border-neutral-800 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-neutral-400" />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2 flex-1">
                  <h3 className="text-sm font-semibold text-white leading-snug">{title}</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Pillars ──────────────────────────────────────────────────────── */}
        <section className="py-16 border-t-[0.5px] border-neutral-800">
          <div className="mb-12">
            <p className="text-[10px] uppercase tracking-widest text-neutral-500">
              Platform Architecture
            </p>
            <h2 className="text-2xl font-semibold text-white mt-2">
              Enterprise-Grade Platform Architecture
            </h2>
            <p className="text-xs text-neutral-500 mt-3 max-w-2xl leading-relaxed">
              A robust, zero-friction operating layer designed to securely bridge the gap
              between the modern guest experience and your core infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-[0.5px] border-neutral-800">
            {pillars.map(({ icon: Icon, title, body }, i) => (
              <div
                key={title}
                className={`p-6 ${i < pillars.length - 1 ? "border-b-[0.5px] border-neutral-800 md:border-b-0 md:border-r-[0.5px]" : ""}`}
              >
                <div className="w-8 h-8 border-[0.5px] border-neutral-800 flex items-center justify-center mb-5">
                  <Icon className="w-4 h-4 text-neutral-400" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Terminal ─────────────────────────────────────────────────────── */}
        <section className="py-16 border-t-[0.5px] border-neutral-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-neutral-500">
                  System Layer
                </p>
                <h2 className="text-2xl font-semibold text-white mt-2">
                  Live PMS Synchronization
                </h2>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                SwiftGate operates as a middleware orchestration layer, listening for
                reservation events and synchronizing check-ins, identity folios, and
                service charges directly into the hotel&apos;s existing PMS software.
              </p>
              <div className="space-y-3">
                {[
                  "Automatic Form C and e-FRRO compliance logging",
                  "Corporate GSTIN validation and automatic split-billing",
                  "Kitchen Display System (KDS) direct order dispatch",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3 text-xs text-neutral-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-neutral-600 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
            <TerminalSimulator />
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t-[0.5px] border-neutral-800 py-6">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-widest text-neutral-700">
            SwiftGate Technologies
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/demo/checkin"
              className="text-[10px] uppercase tracking-widest text-neutral-600 hover:text-neutral-400 transition-colors"
            >
              Pre-Arrival Demo
            </Link>
            <Link
              href="/demo/concierge"
              className="text-[10px] uppercase tracking-widest text-neutral-600 hover:text-neutral-400 transition-colors"
            >
              Concierge Demo
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
