"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";
import { Notice, Event } from "@/types";
import { Search, Loader2, MapPin, Calendar, Megaphone, AlertCircle, Sparkles, Bookmark } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useSavedItems } from "@/hooks/useSavedItems";

export default function Dashboard() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { isSaved, toggleSave } = useSavedItems();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [noticesData, eventsData] = await Promise.all([
          fetcher('/notices'),
          fetcher('/events')
        ]);
        setNotices(noticesData);
        setEvents(eventsData);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = ["All", "Academic", "Sports", "Clubs", "General"];

  const filteredNotices = notices.filter(n => 
    (activeFilter === "All" || n.category === activeFilter) &&
    (n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredEvents = events.filter(e => 
    (activeFilter === "All" || e.category === activeFilter) &&
    (e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-red-400 glass rounded-3xl mt-10">
        <AlertCircle size={48} className="mb-4 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
        <h2 className="text-2xl font-semibold mb-2">Connection Interrupted</h2>
        <p className="text-gray-400">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-full transition-all">Retry Connection</button>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-10">
      {/* Neo-Brutalism Hero Header */}
      <div className="neo-border neo-shadow bg-yellow-400 p-8 sm:p-12 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-[3px] border-black text-sm font-bold uppercase tracking-wider text-black mb-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Sparkles size={14} /> Welcome to the new era
            </div>
            <h1 className="text-5xl sm:text-7xl font-black text-black mb-4 tracking-tighter uppercase leading-none">
              STAY CONNECTED.
            </h1>
            <p className="text-black font-bold text-lg max-w-md uppercase tracking-wide">
              Discover the latest announcements and upcoming events happening around campus.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto mt-4 md:mt-0">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={20} />
              <input 
                type="text" 
                placeholder="SEARCH ANYTHING..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 neo-border neo-shadow bg-white text-black font-bold placeholder-black/50 focus:outline-none focus:bg-cyan-100 transition-colors uppercase"
              />
            </div>
            <select 
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="px-5 py-3 neo-border neo-shadow bg-pink-400 text-black font-bold uppercase cursor-pointer outline-none hover:bg-pink-500 transition-colors"
            >
              {categories.map(c => <option key={c} value={c} className="bg-white text-black">{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-32">
          <Loader2 className="animate-spin text-blue-500" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Notices Column */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-pink-400 neo-border neo-shadow">
                <Megaphone size={24} className="text-black" />
              </div>
              <h2 className="text-4xl font-black text-black tracking-tighter uppercase">Latest Notices</h2>
              <span className="ml-auto bg-white neo-border px-3 py-1 text-black font-bold text-xl">{filteredNotices.length}</span>
            </div>
            
            <div className="space-y-6">
              {filteredNotices.length === 0 ? (
                <div className="neo-card p-8 text-center text-black font-bold uppercase text-lg border-dashed">No notices found.</div>
              ) : (
                filteredNotices.map((notice, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={notice.id}
                  >
                    <Link href={`/notices/${notice.id}`} className="block neo-card p-6 neo-shadow-hover relative">
                      <div className="flex justify-between items-start mb-6">
                        <span className="text-sm font-bold px-3 py-1 bg-cyan-400 neo-border text-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          {notice.category}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-black bg-white neo-border px-2 py-1 uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            {format(new Date(notice.created_at), 'MMM d, yyyy')}
                          </span>
                          <button 
                            onClick={(e) => { e.preventDefault(); toggleSave(notice.id); }}
                            className="p-1.5 bg-white neo-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400 transition-colors"
                          >
                            <Bookmark size={18} className={`${isSaved(notice.id) ? 'fill-black' : ''}`} color="black" />
                          </button>
                        </div>
                      </div>
                      
                      <h3 className="font-black text-2xl mb-3 text-black uppercase tracking-tight leading-tight">{notice.title}</h3>
                      <p className="text-black font-medium text-sm line-clamp-2 leading-relaxed mb-6 border-l-4 border-black pl-3">{notice.content}</p>

                      <div className="w-full py-3 neo-border bg-yellow-400 text-black font-black tracking-widest text-center uppercase hover:bg-black hover:text-yellow-400 transition-colors">
                        Read Notice
                      </div>
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
          </section>

          {/* Events Column */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-cyan-400 neo-border neo-shadow">
                <Calendar size={24} className="text-black" />
              </div>
              <h2 className="text-4xl font-black text-black tracking-tighter uppercase">Upcoming Events</h2>
              <span className="ml-auto bg-white neo-border px-3 py-1 text-black font-bold text-xl">{filteredEvents.length}</span>
            </div>
            
            <div className="space-y-6">
              {filteredEvents.length === 0 ? (
                <div className="neo-card p-8 text-center text-black font-bold uppercase text-lg border-dashed">No events found.</div>
              ) : (
                filteredEvents.map((event, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 + 0.1 }}
                    key={event.id}
                  >
                    <Link href={`/events/${event.id}`} className="block neo-card p-6 neo-shadow-hover relative">
                      
                      <div className="absolute top-4 right-4 z-20">
                        <button 
                          onClick={(e) => { e.preventDefault(); toggleSave(event.id); }}
                          className="p-1.5 bg-white neo-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400 transition-colors"
                        >
                          <Bookmark size={18} className={`${isSaved(event.id) ? 'fill-black' : ''}`} color="black" />
                        </button>
                      </div>

                      <div className="mb-6 pr-12">
                        <h3 className="font-black text-3xl mb-1 text-black uppercase tracking-tighter leading-none">{event.title}</h3>
                        <p className="text-black font-bold text-sm bg-pink-400 inline-block px-2 py-0.5 neo-border mt-2 uppercase">{event.category}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-yellow-400 neo-border">
                            <Calendar size={20} className="text-black" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-black uppercase tracking-widest mb-0.5">Date</p>
                            <p className="text-sm font-bold text-black border-b-2 border-black inline-block">{format(new Date(event.start_time), 'EEE, MMM d')}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-pink-400 neo-border">
                            <MapPin size={20} className="text-black" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-black uppercase tracking-widest mb-0.5">Location</p>
                            <p className="text-sm font-bold text-black truncate">{event.venue}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mb-6 pb-6 border-b-[3px] border-black">
                        <div>
                          <p className="text-xs font-black text-black uppercase tracking-widest mb-1 flex items-center gap-1"><Calendar size={14}/> Time</p>
                          <p className="font-bold text-black">{format(new Date(event.start_time), 'h:mm a')}</p>
                        </div>
                        <div>
                          <p className="text-xs font-black text-black uppercase tracking-widest mb-1 flex items-center gap-1"><AlertCircle size={14}/> Organizer</p>
                          <p className="font-bold text-black truncate bg-white px-2 py-1 neo-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-block mt-1">{event.organizer}</p>
                        </div>
                      </div>
                      
                      <div className="w-full py-3 neo-border bg-cyan-400 text-black font-black tracking-widest text-center uppercase hover:bg-black hover:text-cyan-400 transition-colors">
                        View Details
                      </div>
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
