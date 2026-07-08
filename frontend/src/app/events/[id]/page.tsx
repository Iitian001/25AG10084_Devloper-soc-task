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
      className="max-w-5xl mx-auto space-y-6 pb-20"
    >
      <Link href="/events" className="inline-flex items-center text-sm font-black text-black hover:bg-pink-400 transition-colors bg-white px-4 py-2 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wider">
        <ArrowLeft size={16} className="mr-2" /> Back to Events
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <article className="neo-card overflow-hidden bg-white h-full">
            {event.image_url && (
              <div className="w-full relative border-b-[3px] border-black bg-zinc-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={event.image_url} alt={event.title} className="w-full max-h-[600px] object-contain" />
              </div>
            )}
            
            <div className="p-6 sm:p-12">
              <span className="inline-flex items-center gap-1.5 bg-yellow-400 border-[3px] border-black px-3 py-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold text-black uppercase tracking-wider mb-8">
                <Tag size={14} /> {event.category}
              </span>
              
              <h1 className="text-4xl sm:text-6xl font-black mb-10 text-black tracking-tighter uppercase leading-none">{event.title}</h1>
              
              <div className="text-black text-lg font-medium whitespace-pre-wrap leading-relaxed border-t-[3px] border-black pt-8">
                {event.description}
              </div>
            </div>
          </article>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="neo-card p-8 bg-pink-400 sticky top-24">
            <h3 className="text-2xl font-black border-b-[3px] border-black pb-4 mb-6 text-black flex items-center gap-2 uppercase tracking-tight">
              <Calendar size={24} /> Event Details
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-1">
                  <Calendar size={20} className="text-black" />
                </div>
                <div>
                  <p className="text-sm font-black text-black uppercase tracking-wider mb-1 underline">Date</p>
                  <p className="font-bold text-black text-lg leading-tight">{format(new Date(event.start_time), 'EEEE, MMMM d')}</p>
                  <p className="text-sm font-bold text-black/80">{format(new Date(event.start_time), 'yyyy')}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-1">
                  <Clock size={20} className="text-black" />
                </div>
                <div>
                  <p className="text-sm font-black text-black uppercase tracking-wider mb-1 underline">Time</p>
                  <p className="font-bold text-black text-lg leading-tight">{format(new Date(event.start_time), 'h:mm a')}</p>
                  <p className="text-sm font-bold text-black/80">to {format(new Date(event.end_time), 'h:mm a')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-1">
                  <MapPin size={20} className="text-black" />
                </div>
                <div>
                  <p className="text-sm font-black text-black uppercase tracking-wider mb-1 underline">Location</p>
                  <p className="font-bold text-black text-lg leading-tight">{event.venue}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-1">
                  <Building size={20} className="text-black" />
                </div>
                <div>
                  <p className="text-sm font-black text-black uppercase tracking-wider mb-1 underline">Organizer</p>
                  <p className="font-bold text-black text-lg leading-tight">{event.organizer}</p>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-10 py-4 bg-white border-[3px] border-black text-black font-black uppercase tracking-widest text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
              Add to Calendar
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
