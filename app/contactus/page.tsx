import Link from "next/link";
import { ArrowLeft, Linkedin } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header className="border-b border-[0.5px] border-neutral-800 bg-black/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src="/logo.png" alt="SwiftGate Logo" className="h-6 w-auto object-contain" />
              <span className="font-bold text-lg text-white tracking-tight">SwiftGate</span>
            </Link>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-neutral-400 hover:text-white border border-[0.5px] border-neutral-800 hover:border-neutral-600 px-4 py-2 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20 lg:py-24">
        
        {/* ── Contact Section ────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-32">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-emerald-500 font-mono">
              GET IN TOUCH
            </p>
            <h1 className="text-3xl font-semibold text-white mt-2 mb-4">
              Let&apos;s talk about deployment.
            </h1>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-md">
              SwiftGate deploys securely alongside your existing PMS in hours, whether you run a single boutique property or a global portfolio.
            </p>
          </div>
          <div>
            <ContactForm />
          </div>
        </section>

      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t-[0.5px] border-neutral-800 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-[10px] uppercase tracking-widest text-neutral-700">
              SwiftGate Technologies
            </p>
            <p className="text-[10px] text-neutral-500">
              © SwiftGate All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
