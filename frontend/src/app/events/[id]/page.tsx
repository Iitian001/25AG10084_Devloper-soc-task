"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";
import { Event } from "@/types";
import { Loader2, ArrowLeft, Calendar, Tag, AlertCircle, MapPin, Clock, Building } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

export default function EventDetail() {
  const params = useParams();
  const id = params.id as string;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvent() {
      try {
        const data = await fetcher(`/events/${id}`);
        setEvent(data);
      } catch (err: any) {
        setError(err.message || "Failed to load event");
      } finally {
        setLoading(false);
      }
    }
    if (id) loadEvent();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center py-32"><Loader2 className="animate-spin text-emerald-500" size={48} /></div>;
  }

  if (error || !event) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-red-400 glass rounded-3xl mt-10">
        <AlertCircle size={48} className="mb-4 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
        <h2 className="text-2xl font-semibold mb-2">Event Unavailable</h2>
        <p className="text-gray-400">{error || "Event not found"}</p>
        <Link href="/" className="mt-6 px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-full transition-all">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-6"
    >
      <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
        <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <article className="glass rounded-[2rem] overflow-hidden shadow-2xl relative h-full">
            {/* Glow behind article */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            {event.image_url && (
              <div className="w-full h-72 sm:h-96 relative overflow-hidden bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={event.image_url} alt={event.title} className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              </div>
            )}
            
            <div className={`p-8 sm:p-12 relative z-10 ${event.image_url ? '-mt-24' : ''}`}>
              <span className="inline-flex items-center gap-1.5 font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-md uppercase tracking-wider shadow-[0_0_10px_rgba(16,185,129,0.2)] mb-6">
                <Tag size={14} /> {event.category}
              </span>
              
              <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 text-white tracking-tight drop-shadow-md">{event.title}</h1>
              
              <div className="prose prose-lg dark:prose-invert max-w-none text-gray-300 whitespace-pre-wrap leading-relaxed font-medium">
                {event.description}
              </div>
            </div>
          </article>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="glass rounded-[2rem] p-8 shadow-2xl sticky top-24">
            <h3 className="text-xl font-extrabold border-b border-white/10 pb-4 mb-6 text-white flex items-center gap-2">
              <Calendar className="text-emerald-400" size={20} /> Event Details
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 mt-1">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Date</p>
                  <p className="font-semibold text-gray-200">{format(new Date(event.start_time), 'EEEE, MMMM d')}</p>
                  <p className="text-sm text-emerald-400/80">{format(new Date(event.start_time), 'yyyy')}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 mt-1">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Time</p>
                  <p className="font-semibold text-gray-200">{format(new Date(event.start_time), 'h:mm a')}</p>
                  <p className="text-sm text-gray-400">to {format(new Date(event.end_time), 'h:mm a')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 mt-1">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Location</p>
                  <p className="font-semibold text-gray-200">{event.venue}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 mt-1">
                  <Building size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Organizer</p>
                  <p className="font-semibold text-gray-200">{event.organizer}</p>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-[1.02] transition-all">
              Add to Calendar
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
