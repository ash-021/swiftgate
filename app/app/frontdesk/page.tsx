'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { sendInviteLink } from '@/actions/sendInviteLink';

type CheckIn = {
  id: string;
  guest_name: string;
  document_type: string;
  masked_id_preview: string;
  face_match_score: string;
  company_gst: string;
  nationality: string | null;
  visa_status: string | null;
  room_number: string | null;
  status: string;
  created_at: string;
};

type Filter = 'ALL' | 'PENDING' | 'CHECKED_IN';

const ROOM_OPTIONS = ['101', '102', '103', '201', '202', '203', '301', '302', '303'];

export default function FrontDeskDashboard() {
  const [arrivals, setArrivals] = useState<CheckIn[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<Filter>('ALL');
  const [roomAssignments, setRoomAssignments] = useState<Record<string, string>>({});
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  
  const [invitePhone, setInvitePhone] = useState('');
  const [isSendingInvite, setIsSendingInvite] = useState(false);

  useEffect(() => {
    // 1. Fetch initial load of today's check-ins
    const fetchInitialData = async () => {
      const { data, error } = await supabase
        .from('checkins')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (data && !error) {
        setArrivals(data);
        // Initialize local room assignments state from DB
        const assignments: Record<string, string> = {};
        data.forEach(guest => {
          if (guest.room_number) assignments[guest.id] = guest.room_number;
        });
        setRoomAssignments(assignments);
      }
    };
    fetchInitialData();

    // 2. Wire the Realtime WebSocket Subscription
    const channel = supabase
      .channel('realtime-arrivals')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'checkins' },
        (payload) => {
          setArrivals((current) => [payload.new as CheckIn, ...current]);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'checkins' },
        (payload) => {
          setArrivals((current) => 
            current.map(guest => guest.id === payload.new.id ? payload.new as CheckIn : guest)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Compute Stats
  const stats = useMemo(() => {
    return {
      total: arrivals.length,
      domestic: arrivals.filter(a => a.document_type.includes('Government ID')).length,
      international: arrivals.filter(a => a.document_type.includes('Passport')).length,
      pending: arrivals.filter(a => a.status === 'Verified').length,
      checkedIn: arrivals.filter(a => a.status === 'Checked In').length,
    };
  }, [arrivals]);

  // Filter & Search Logic
  const filteredArrivals = useMemo(() => {
    return arrivals.filter(guest => {
      const matchesSearch = 
        guest.guest_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        guest.document_type.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTab = 
        activeFilter === 'ALL' ? true :
        activeFilter === 'PENDING' ? guest.status === 'Verified' :
        activeFilter === 'CHECKED_IN' ? guest.status === 'Checked In' : true;

      return matchesSearch && matchesTab;
    });
  }, [arrivals, searchQuery, activeFilter]);

  const handleIssueKeycard = async (guestId: string) => {
    const assignedRoom = roomAssignments[guestId];
    if (!assignedRoom) {
      alert("Please select a room before issuing a keycard.");
      return;
    }

    setIsUpdating(guestId);
    try {
      const { error } = await supabase
        .from('checkins')
        .update({ status: 'Checked In', room_number: assignedRoom })
        .eq('id', guestId);

      if (error) throw error;
      // The Realtime UPDATE subscription will automatically refresh the UI state
    } catch (err) {
      console.error(err);
      alert('Failed to issue keycard. Please try again.');
    } finally {
      setIsUpdating(null);
    }
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitePhone) return;
    setIsSendingInvite(true);
    try {
      const res = await sendInviteLink(invitePhone);
      if (res.success) {
        alert('Invite sent successfully!');
        setInvitePhone('');
      } else {
        alert(`Error: ${res.error}`);
      }
    } catch (err: any) {
      alert(`Failed to send invite: ${err.message}`);
    } finally {
      setIsSendingInvite(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col">
      {/* Top Navbar / Header */}
      <header className="bg-black border-b border-neutral-900 px-8 py-5 shrink-0 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            PMS Command Center
            <span className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-sm border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              System Live
            </span>
          </h1>
        </div>
        
        {/* Stats Strip */}
        <div className="flex gap-8">
          <div className="text-right">
            <p className="text-[10px] uppercase text-neutral-500 tracking-wider">Total Arrivals</p>
            <p className="text-xl font-semibold text-white">{stats.total}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase text-neutral-500 tracking-wider">Demographics</p>
            <p className="text-sm font-medium text-white mt-1">
              {stats.domestic} Dom <span className="text-neutral-700">|</span> {stats.international} Intl
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase text-neutral-500 tracking-wider">Status</p>
            <p className="text-sm font-medium text-emerald-400 mt-1">
              {stats.pending} Pending <span className="text-neutral-700">|</span> <span className="text-neutral-400">{stats.checkedIn} Checked In</span>
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* Controls: Search & Filter */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 mb-8">
          <div className="flex gap-2 p-1 bg-neutral-900 rounded-sm border border-neutral-800 shrink-0">
            {(['ALL', 'PENDING', 'CHECKED_IN'] as Filter[]).map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                  activeFilter === f ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {f === 'ALL' ? 'All Arrivals' : f === 'PENDING' ? 'Pending Assignment' : 'Checked In'}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
            {/* WhatsApp Invite Form */}
            <form onSubmit={handleSendInvite} className="flex items-center gap-2">
              <input
                type="tel"
                placeholder="+1234567890"
                value={invitePhone}
                onChange={(e) => setInvitePhone(e.target.value)}
                className="w-40 bg-black border border-[0.5px] border-neutral-800 rounded-sm px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
              />
              <button
                type="submit"
                disabled={isSendingInvite || !invitePhone}
                className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-neutral-800 disabled:text-neutral-500 text-black text-sm font-medium px-4 py-2 rounded-sm transition-colors whitespace-nowrap"
              >
                {isSendingInvite ? 'Sending...' : 'Send WhatsApp Link'}
              </button>
            </form>

            {/* Search Bar */}
            <div className="relative flex-1 xl:flex-none">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search guests or IDs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full xl:w-72 bg-black border border-[0.5px] border-neutral-800 rounded-sm pl-10 pr-4 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Guest Cards Grid */}
        {filteredArrivals.length === 0 ? (
          <div className="text-center py-20 border border-[0.5px] border-dashed border-neutral-800 rounded-sm bg-neutral-900/30">
            <p className="text-neutral-500 text-sm">No arrivals match your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArrivals.map((guest) => {
              const isCheckedIn = guest.status === 'Checked In';
              const isIntl = guest.nationality && guest.document_type === 'Passport';
              const hasGst = guest.company_gst && guest.company_gst !== 'N/A';

              return (
                <div key={guest.id} className={`bg-neutral-900 border border-[0.5px] ${isCheckedIn ? 'border-neutral-800 opacity-60' : 'border-neutral-700 shadow-lg'} rounded-sm flex flex-col relative overflow-hidden transition-all`}>
                  
                  {/* Top Status Strip */}
                  <div className={`absolute top-0 left-0 w-full h-1 ${isCheckedIn ? 'bg-neutral-600' : 'bg-emerald-500'}`} />
                  
                  <div className="p-5 flex-1 flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-lg font-semibold text-white">{guest.guest_name}</h2>
                        <span className={`text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded-sm mt-1 inline-block ${isCheckedIn ? 'bg-neutral-800 text-neutral-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                          {guest.status}
                        </span>
                      </div>
                      
                      {/* Compliance Badge */}
                      {isIntl ? (
                        <span className="text-[9px] uppercase tracking-widest text-blue-400 bg-blue-950 px-2 py-1 rounded-sm border border-blue-900 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          e-FRRO Ready
                        </span>
                      ) : (
                        <span className="text-[9px] uppercase tracking-widest text-emerald-400 bg-emerald-950 px-2 py-1 rounded-sm border border-emerald-900 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          DigiLocker OKYC
                        </span>
                      )}
                    </div>

                    {/* Billing Tag */}
                    {hasGst && (
                      <div className="bg-yellow-950/30 border border-yellow-900/50 rounded-sm px-2 py-1.5 flex items-center gap-2">
                        <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        <div>
                          <p className="text-[9px] uppercase tracking-widest text-yellow-600">Corporate Billing (GSTR-2B)</p>
                          <p className="text-xs text-yellow-400 font-mono mt-0.5">{guest.company_gst}</p>
                        </div>
                      </div>
                    )}

                    {/* Details */}
                    <div className="space-y-2 mt-auto">
                      <div>
                        <p className="text-[10px] uppercase text-neutral-500 tracking-wider">Verified Document</p>
                        <p className="text-xs text-neutral-300 font-mono mt-0.5">
                          {guest.document_type} • {guest.masked_id_preview}
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <div>
                          <p className="text-[10px] uppercase text-neutral-500 tracking-wider">Face Match</p>
                          <p className="text-xs text-emerald-400 font-mono mt-0.5">{guest.face_match_score}</p>
                        </div>
                        {isIntl && (
                          <div>
                            <p className="text-[10px] uppercase text-neutral-500 tracking-wider">Nat / Visa</p>
                            <p className="text-xs text-neutral-300 font-mono mt-0.5">{guest.nationality} • {guest.visa_status}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions (Room Assign & Checkout) */}
                  <div className="bg-black p-4 border-t border-[0.5px] border-neutral-800 flex gap-3">
                    <div className="flex-1">
                      <select
                        value={roomAssignments[guest.id] || ''}
                        onChange={(e) => setRoomAssignments(prev => ({ ...prev, [guest.id]: e.target.value }))}
                        disabled={isCheckedIn}
                        className="w-full bg-neutral-900 border border-[0.5px] border-neutral-700 rounded-sm px-2 py-2 text-xs text-white focus:outline-none focus:border-neutral-500 disabled:opacity-50 appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Assign Room...</option>
                        {ROOM_OPTIONS.map(rm => (
                          <option key={rm} value={rm}>Room {rm}</option>
                        ))}
                      </select>
                    </div>
                    
                    <button
                      onClick={() => handleIssueKeycard(guest.id)}
                      disabled={isCheckedIn || isUpdating === guest.id}
                      className={`flex-1 text-xs font-semibold rounded-sm transition-colors ${
                        isCheckedIn
                          ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                          : 'bg-white hover:bg-neutral-200 text-black shadow-sm'
                      }`}
                    >
                      {isUpdating === guest.id ? 'Updating...' : isCheckedIn ? 'Keycard Issued' : 'Issue Keycard'}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
