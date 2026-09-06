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
              Let&apos;s talk about enterprise deployment.
            </h1>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-md">
              Whether you are a single boutique property or a large global portfolio, SwiftGate can be deployed securely alongside your existing PMS in a matter of hours.
            </p>
          </div>
          <div>
            <ContactForm />
          </div>
        </section>

        {/* ── Leadership Team ──────────────────────────────────────────────── */}
        <section className="py-16 border-t-[0.5px] border-neutral-800">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Ankita */}
            <div className="p-6 border-[0.5px] border-neutral-800 flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-16 h-16 shrink-0 bg-neutral-900 border-[0.5px] border-neutral-700 flex items-center justify-center">
                <span className="text-lg font-mono text-neutral-300 tracking-widest">AR</span>
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
            <div className="p-6 border-[0.5px] border-neutral-800 flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-16 h-16 shrink-0 bg-neutral-900 border-[0.5px] border-neutral-700 flex items-center justify-center">
                <span className="text-lg font-mono text-neutral-300 tracking-widest">AS</span>
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
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t-[0.5px] border-neutral-800 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-widest text-neutral-700">
            SwiftGate Technologies
          </p>
        </div>
      </footer>
    </div>
  );
}
