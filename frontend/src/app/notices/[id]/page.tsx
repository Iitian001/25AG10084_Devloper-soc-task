"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";
import { Notice } from "@/types";
import { Loader2, ArrowLeft, Calendar, User, Tag, AlertCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

export default function NoticeDetail() {
  const params = useParams();
  const id = params.id as string;
  
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNotice() {
      try {
        const data = await fetcher(`/notices/${id}`);
        setNotice(data);
      } catch (err: any) {
        setError(err.message || "Failed to load notice");
      } finally {
        setLoading(false);
      }
    }
    if (id) loadNotice();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center py-32"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;
  }

  if (error || !notice) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-red-400 glass rounded-3xl mt-10">
        <AlertCircle size={48} className="mb-4 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
        <h2 className="text-2xl font-semibold mb-2">Notice Unavailable</h2>
        <p className="text-gray-400">{error || "Notice not found"}</p>
        <Link href="/" className="mt-6 px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-full transition-all">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6 pb-20"
    >
      <Link href="/" className="inline-flex items-center text-sm font-black text-black hover:bg-yellow-400 transition-colors bg-white px-4 py-2 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wider">
        <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
      </Link>
      
      <article className="neo-card overflow-hidden bg-white">
        {notice.image_url && (
          <div className="w-full h-72 sm:h-96 relative overflow-hidden border-b-[3px] border-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={notice.image_url} alt={notice.title} className="w-full h-full object-cover" />
          </div>
        )}
        
        <div className="p-6 sm:p-12">
          <div className="flex flex-wrap gap-4 items-center mb-8 text-sm text-black font-bold uppercase">
            <span className="flex items-center gap-1.5 bg-cyan-400 border-[3px] border-black px-3 py-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Tag size={14} /> {notice.category}
            </span>
            <span className="flex items-center gap-1.5 bg-yellow-400 border-[3px] border-black px-3 py-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Calendar size={14} /> {format(new Date(notice.created_at), 'MMMM d, yyyy')}
            </span>
            <span className="flex items-center gap-1.5 bg-pink-400 border-[3px] border-black px-3 py-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <User size={14} /> {notice.posted_by?.name || "Admin"}
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black mb-10 text-black tracking-tighter uppercase leading-none">{notice.title}</h1>
          
          <div className="text-black text-lg font-medium whitespace-pre-wrap leading-relaxed border-t-[3px] border-black pt-8">
            {notice.content}
          </div>
        </div>
      </article>
    </motion.div>
  );
}
