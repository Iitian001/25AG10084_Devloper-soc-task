"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";
import { Event } from "@/types";
import { Search, Loader2, MapPin, Calendar, AlertCircle, Bookmark } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useSavedItems } from "@/hooks/useSavedItems";

export default function EventsFeed() {
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
        const eventsData = await fetcher('/events');
        setEvents(eventsData);
      } catch (err: any) {
        setError(err.message || "Failed to load events");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = ["All", "Academic", "Sports", "Clubs", "General"];

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
      {/* Neo-Brutalism Header */}
      <div className="neo-border neo-shadow bg-pink-400 p-6 sm:p-12 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8">
          <div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-black mb-2 tracking-tighter uppercase leading-none">
              CAMPUS EVENTS.
            </h1>
            <p className="text-black font-bold text-lg max-w-md uppercase tracking-wide border-l-4 border-black pl-3 mt-4">
              Discover and participate in all upcoming activities around the campus.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto mt-4 md:mt-0">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={20} />
              <input 
                type="text" 
                placeholder="SEARCH EVENTS..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 neo-border neo-shadow bg-white text-black font-bold placeholder-black/50 focus:outline-none focus:bg-cyan-100 transition-colors uppercase"
              />
            </div>
            <select 
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="px-5 py-3 neo-border neo-shadow bg-yellow-400 text-black font-bold uppercase cursor-pointer outline-none hover:bg-yellow-500 transition-colors"
            >
              {categories.map(c => <option key={c} value={c} className="bg-white text-black">{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-32">
          <Loader2 className="animate-spin text-emerald-500" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full neo-card p-16 text-center text-black font-bold uppercase text-lg border-dashed">
              No events found matching your criteria.
            </div>
          ) : (
            filteredEvents.map((event, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={event.id}
                className="h-full"
              >
                <Link href={`/events/${event.id}`} className="flex flex-col h-full neo-card p-6 neo-shadow-hover relative">
                  
                  <div className="absolute top-4 right-4 z-20">
                    <button 
                      onClick={(e) => { e.preventDefault(); toggleSave(event.id); }}
                      className="p-1.5 bg-white neo-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400 transition-colors"
                    >
                      <Bookmark size={18} className={`${isSaved(event.id) ? 'fill-black' : ''}`} color="black" />
                    </button>
                  </div>

                  {event.image_url && (
                    <div className="w-full h-40 neo-border overflow-hidden mb-6 bg-black">
                       {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={event.image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
                    </div>
                  )}

                  <div className="mb-6 pr-12">
                    <h3 className="font-black text-2xl mb-1 text-black uppercase tracking-tighter leading-tight line-clamp-2">{event.title}</h3>
                    <p className="text-black font-bold text-sm bg-pink-400 inline-block px-2 py-0.5 neo-border mt-2 uppercase">{event.category}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-yellow-400 neo-border hidden sm:block">
                        <Calendar size={18} className="text-black" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-black uppercase tracking-widest mb-0.5">Date</p>
                        <p className="text-sm font-bold text-black border-b-2 border-black inline-block">{format(new Date(event.start_time), 'EEE, MMM d')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-cyan-400 neo-border hidden sm:block">
                        <MapPin size={18} className="text-black" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-black uppercase tracking-widest mb-0.5">Location</p>
                        <p className="text-sm font-bold text-black truncate">{event.venue}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-6 pb-6 border-b-[3px] border-black flex-grow">
                    <div>
                      <p className="text-[10px] font-black text-black uppercase tracking-widest mb-1 flex items-center gap-1"><Calendar size={12}/> Time</p>
                      <p className="font-bold text-black">{format(new Date(event.start_time), 'h:mm a')}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-black uppercase tracking-widest mb-1 flex items-center gap-1"><AlertCircle size={12}/> Organizer</p>
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
      )}
    </div>
  );
}
