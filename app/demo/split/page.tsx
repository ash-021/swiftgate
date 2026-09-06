'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SplitScreenDemo() {
  const [mounted, setMounted] = useState(false);
  const [appUrl, setAppUrl] = useState('');

  useEffect(() => {
    setMounted(true);
    
    // Construct the app. subdomain URL
    const host = window.location.host;
    const protocol = window.location.protocol;
    
    if (host.startsWith('app.')) {
      setAppUrl(`${protocol}//${host}`);
    } else {
      setAppUrl(`${protocol}//app.${host}`);
    }
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col font-sans">
      
      {/* Header */}
      <header className="bg-black border-b border-neutral-900 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-neutral-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-sm font-semibold tracking-wide">Interactive Demo Mode</h1>
            <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-0.5">
              Live Edge-to-Cloud Sync
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-medium text-emerald-500 uppercase tracking-widest">
            Supabase Realtime Connected
          </span>
        </div>
      </header>

      {/* Split Screen Container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Guest Mobile Experience */}
        <div className="w-[400px] shrink-0 border-r border-neutral-900 bg-black flex flex-col relative overflow-hidden">
          <div className="bg-neutral-900/50 border-b border-neutral-900 px-4 py-2 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Guest Mobile View</span>
            </div>
            <div className="text-[10px] text-neutral-600 font-mono hidden md:block">
              {appUrl}/checkin/demo-token
            </div>
          </div>
          <div className="flex-1 p-4 flex items-center justify-center bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:24px_24px]">
            {/* Simulated Phone Frame */}
            <div className="w-[375px] h-[812px] bg-black border-[4px] border-neutral-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
              {/* Notch */}
              <div className="absolute top-0 inset-x-0 h-6 bg-neutral-800 rounded-b-3xl w-40 mx-auto z-50"></div>
              <iframe 
                src={`${appUrl}/checkin/demo-token`}
                className="w-full h-full border-none"
                title="Guest Check-in"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Front Desk PMS */}
        <div className="flex-1 bg-neutral-950 flex flex-col relative">
          <div className="bg-neutral-900/50 border-b border-neutral-900 px-4 py-2 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Front Desk PMS Command Center</span>
            </div>
            <div className="text-[10px] text-neutral-600 font-mono">
              {appUrl}/frontdesk
            </div>
          </div>
          <iframe 
            src={`${appUrl}/frontdesk`}
            className="w-full h-full border-none bg-neutral-950"
            title="Front Desk PMS"
          />
        </div>

      </div>
    </div>
  );
}
