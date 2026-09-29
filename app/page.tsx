"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Menu,
  X,
  AlertTriangle,
  Clock,
  Ban,
  Linkedin
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
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-white hover:bg-neutral-200 text-black font-semibold text-xs py-3 flex items-center justify-center gap-2 transition-colors"
      >
        <Smartphone className="w-3.5 h-3.5" />
        {title}
        <ArrowUpRight className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [origin, setOrigin] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

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
    <div className="min-h-screen bg-black text-white relative">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header className="border-b border-[0.5px] border-neutral-800 bg-black/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="SwiftGate Logo" className="h-6 w-auto object-contain" />
            <p className="font-bold text-lg text-white tracking-tight">SwiftGate</p>
            <div className="hidden md:flex items-center gap-2 ml-2">
              {["ZERO-FRICTION", "PMS Integrated"].map((b) => (
                <span
                  key={b}
                  className="text-[10px] uppercase tracking-widest border border-[0.5px] border-neutral-800 text-neutral-500 px-2.5 py-1"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden lg:flex items-center gap-6 text-[10px] uppercase tracking-widest text-neutral-400 mr-2">
              <a href="#problem" className="hover:text-white transition-colors">The Problem</a>
              <a href="#demo" className="hover:text-white transition-colors">Live Demo</a>
              <a href="#about" className="hover:text-white transition-colors">Vision</a>
              <a href="#team" className="hover:text-white transition-colors">Founders</a>
            </nav>

            <Link
              href="/contactus"
              className="hidden sm:flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-black bg-brand-500 hover:bg-brand-400 font-semibold border border-brand-500 px-4 py-2 transition-colors"
            >
              Get in touch
              <ArrowRight className="w-3 h-3" />
            </Link>

            <button 
              className="lg:hidden text-neutral-400 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-b border-[0.5px] border-neutral-800 bg-neutral-950 overflow-hidden absolute w-full left-0 top-full shadow-2xl"
            >
              <nav className="flex flex-col p-6 gap-6 text-[10px] uppercase tracking-widest text-neutral-400">
                <a href="#problem" onClick={() => setIsMenuOpen(false)} className="hover:text-white">The Problem</a>
                <a href="#demo" onClick={() => setIsMenuOpen(false)} className="hover:text-white">Live Demo</a>
                <a href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="hover:text-white">How it works</a>
                <a href="#about" onClick={() => setIsMenuOpen(false)} className="hover:text-white">Vision</a>
                <a href="#team" onClick={() => setIsMenuOpen(false)} className="hover:text-white">Founders</a>
                <Link
                  href="/contactus"
                  onClick={() => setIsMenuOpen(false)}
                  className="sm:hidden flex items-center justify-between text-black bg-brand-500 font-semibold px-4 py-3"
                >
                  Get in touch
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <motion.section 
          id="hero"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          <div className="space-y-8">
            <div className="space-y-5">
              <p className="text-[10px] uppercase tracking-widest text-neutral-500">
                Hospitality Infrastructure
              </p>
              <h1 className="text-4xl lg:text-6xl font-semibold text-white tracking-tight leading-tight">
                Frictionless Check-In &amp; In-Stay Commerce for Modern Hotels.
              </h1>
              <p className="text-neutral-400 text-sm lg:text-base leading-relaxed max-w-xl">
                SwiftGate replaces manual reception bottlenecks with zero-app biometric verification, automated guest preferences, and PMS-linked in-room ordering.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border-[0.5px] border-neutral-800">
              {[
                { value: "< 60s", label: "Pre-Arrival Verification" },
                { value: "0", label: "App Downloads" },
                { value: "+22%", label: "Incremental Revenue" },
              ].map(({ value, label }, i) => (
                <div
                  key={label}
                  className={`px-5 py-5 ${i < 2 ? "border-b-[0.5px] sm:border-b-0 sm:border-r-[0.5px] border-neutral-800" : ""}`}
                >
                  <p className="text-2xl font-semibold text-white">{value}</p>
                  <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <WorkflowSimulation />
          </div>
        </motion.section>

        {/* ── The Problem ──────────────────────────────────────────────────── */}
        <motion.section 
          id="problem"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="py-16 border-t-[0.5px] border-neutral-800"
        >
          <div className="mb-10">
            <p className="text-[10px] uppercase tracking-widest text-red-500">
              The Problem
            </p>
            <h2 className="text-2xl font-semibold text-white mt-2">
              The Front Desk Bottleneck
            </h2>
            <p className="text-xs text-neutral-500 mt-3 max-w-2xl leading-relaxed">
              Traditional check-ins cost time, frustrate guests, and lead to missed revenue opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border-[0.5px] border-neutral-800 bg-neutral-950 flex flex-col items-center text-center">
              <Clock className="w-5 h-5 text-red-500/80 mb-4" />
              <h3 className="text-sm font-semibold text-white mb-2">Long Lobby Queues</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">Guests arrive tired only to wait 15+ minutes in line while staff manually photocopy IDs and type details into the PMS.</p>
            </div>
            <div className="p-6 border-[0.5px] border-neutral-800 bg-neutral-950 flex flex-col items-center text-center">
              <Ban className="w-5 h-5 text-red-500/80 mb-4" />
              <h3 className="text-sm font-semibold text-white mb-2">App Fatigue</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">Nobody wants to download a 50MB hotel app just to order room service or request a late checkout.</p>
            </div>
            <div className="p-6 border-[0.5px] border-neutral-800 bg-neutral-950 flex flex-col items-center text-center">
              <AlertTriangle className="w-5 h-5 text-red-500/80 mb-4" />
              <h3 className="text-sm font-semibold text-white mb-2">Compliance Errors</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">Manual data entry for Form C and police verification leads to typos, compliance risks, and security issues.</p>
            </div>
          </div>
        </motion.section>



        {/* ── Demo Access ──────────────────────────────────────────────────── */}
        <motion.section 
          id="demo"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="py-16 border-t-[0.5px] border-neutral-800"
        >
          <div className="mb-10">
            <p className="text-[10px] uppercase tracking-widest text-neutral-500">
              Experience It
            </p>
            <h2 className="text-2xl font-semibold text-white mt-2">
              Live Demo Access
            </h2>
            <p className="text-xs text-neutral-500 mt-3 max-w-2xl leading-relaxed">
              Scan the QR codes with your phone to instantly experience the native guest flow. No downloads required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
            <DemoCard
              eyebrow="Flow 1 of 2: Pre-Arrival"
              title="Split-Screen Check-In Demo"
              description="Run the mobile guest flow side-by-side with the PMS Front Desk to see records sync in real-time."
              href="/demo/split"
              qrUrl={`${origin}/demo/split`}
            />
            <DemoCard
              eyebrow="Flow 2 of 2: In-Room"
              title="Launch In-Room Concierge"
              description="Simulates the in-room ordering experience: F&B menu, cart, and direct room-folio charge."
              href="/demo/concierge"
              qrUrl={`${origin}/demo/concierge`}
            />
          </div>
        </motion.section>

        {/* ── How It Works ─────────────────────────────────────────────────── */}
        <motion.section 
          id="how-it-works"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="py-16 border-t-[0.5px] border-neutral-800"
        >
          <div className="mb-10">
            <p className="text-[10px] uppercase tracking-widest text-neutral-500">
              SYSTEM PIPELINE
            </p>
            <h2 className="text-2xl font-semibold text-white mt-2">
              How SwiftGate Works
            </h2>
            <p className="text-xs text-neutral-500 mt-3 max-w-2xl leading-relaxed">
              A secure verification pipeline completed by guests in under a minute on their own device.
            </p>
          </div>

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
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-700 font-mono">
                    Step {step}
                  </span>
                  <div className="w-8 h-8 border-[0.5px] border-neutral-800 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-neutral-400" />
                  </div>
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="text-sm font-semibold text-white leading-snug">{title}</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Pillars ──────────────────────────────────────────────────────── */}
        <motion.section 
          id="architecture"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="py-16 border-t-[0.5px] border-neutral-800"
        >
          <div className="mb-12">
            <p className="text-[10px] uppercase tracking-widest text-neutral-500">
              Platform Architecture
            </p>
            <h2 className="text-2xl font-semibold text-white mt-2">
              Platform Architecture
            </h2>
            <p className="text-xs text-neutral-500 mt-3 max-w-2xl leading-relaxed">
              A secure operating layer that connects the guest experience directly to your core infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-[0.5px] border-neutral-800">
            {pillars.map(({ icon: Icon, title, body }, i) => (
              <div
                key={title}
                className={`p-6 flex flex-col items-center text-center ${i < pillars.length - 1 ? "border-b-[0.5px] border-neutral-800 md:border-b-0 md:border-r-[0.5px]" : ""}`}
              >
                <div className="w-8 h-8 border-[0.5px] border-neutral-800 flex items-center justify-center mb-5">
                  <Icon className="w-4 h-4 text-neutral-400" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Terminal ─────────────────────────────────────────────────────── */}
        <motion.section 
          id="terminal"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="py-16 border-t-[0.5px] border-neutral-800"
        >
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
                SwiftGate listens for reservation events and synchronizes check-ins, folios, and service charges directly into the hotel&apos;s existing PMS software.
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
        </motion.section>

        {/* ── Vision / About Us ────────────────────────────────────────────── */}
        <motion.section 
          id="about"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="py-16 border-t-[0.5px] border-neutral-800"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-emerald-500 font-mono">
                Our Vision
              </p>
              <h2 className="text-3xl font-semibold text-white mt-2 mb-4">
                Redefining the Hospitality Standard
              </h2>
            </div>
            <div className="space-y-6 text-sm text-neutral-400 leading-relaxed">
              <p>
                At SwiftGate, we believe the hotel lobby should be a place of welcome, not a waiting room. For decades, the hospitality industry has been held back by fragmented legacy systems and manual data entry that frustrate both guests and staff.
              </p>
              <p>
                We are building the intelligent infrastructure layer that connects the modern guest directly to core property operations. By combining cutting-edge biometric verification with deep PMS integrations, we are eliminating the friction of travel and empowering hoteliers to focus on what matters most: true hospitality.
              </p>
            </div>
          </div>
        </motion.section>

        {/* ── Leadership Team ──────────────────────────────────────────────── */}
        <motion.section 
          id="team"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="py-16 border-t-[0.5px] border-neutral-800"
        >
          <div className="mb-12">
            <p className="text-[10px] uppercase tracking-widest text-neutral-500">
              FOUNDING TEAM
            </p>
            <h2 className="text-2xl font-semibold text-white mt-2">
              Meet the Founders
            </h2>
            <p className="text-xs text-neutral-500 mt-3 max-w-2xl leading-relaxed">
              Combining deep operational experience with modern engineering to solve hospitality&apos;s most complex challenges.
            </p>
          </div>

          <div className="flex flex-col md:flex-row flex-wrap gap-8 items-stretch">
            {/* Ankita */}
            <div className="p-6 border-[0.5px] border-neutral-800 flex flex-col sm:flex-row gap-6 items-start w-full sm:w-[340px]">
              <div className="w-16 h-16 rounded-full shrink-0 bg-neutral-900 border-[0.5px] border-neutral-700 flex items-center justify-center overflow-hidden relative">
                <span className="text-lg font-mono text-neutral-300 tracking-widest">AR</span>
                <img src="/ankita.jpg" alt="Ankita Roy" className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Ankita Roy</h3>
                  <a href="https://www.linkedin.com/in/ankitaroy21/" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">Co-Founder</p>
                <p className="text-xs text-neutral-500 mt-3 leading-relaxed">
                  Consultant at Accenture <br/>
                  Ex-Microsoft, IIM Shillong
                </p>
              </div>
            </div>

            {/* Ashish */}
            <div className="p-6 border-[0.5px] border-neutral-800 flex flex-col sm:flex-row gap-6 items-start w-full sm:w-[340px]">
              <div className="w-16 h-16 rounded-full shrink-0 bg-neutral-900 border-[0.5px] border-neutral-700 flex items-center justify-center overflow-hidden relative">
                <span className="text-lg font-mono text-neutral-300 tracking-widest">AS</span>
                <img src="/ashish.jpg" alt="Ashish Sharma" className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Ashish Sharma</h3>
                  <a href="https://www.linkedin.com/in/ashishsharma021/" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">Co-Founder</p>
                <p className="text-xs text-neutral-500 mt-3 leading-relaxed">
                  Founder&apos;s Office at Binocs (AI SaaS Startup) <br/>
                  Ex-ZS, IIM Shillong, NIT Kurukshetra
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t-[0.5px] border-neutral-800 py-6">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-[10px] uppercase tracking-widest text-neutral-700">
              SwiftGate Technologies
            </p>
            <p className="text-[10px] text-neutral-500">
              © SwiftGate All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/demo/split"
              className="text-[10px] uppercase tracking-widest text-neutral-600 hover:text-neutral-400 transition-colors"
            >
              Live Split-Screen Demo
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
