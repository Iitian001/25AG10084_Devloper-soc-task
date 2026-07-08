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
      className="max-w-4xl mx-auto space-y-6"
    >
      <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
        <ArrowLeft size={16} className="mr-2" /> Back to Feed
      </Link>
      
      <article className="glass rounded-[2rem] overflow-hidden shadow-2xl relative">
        {/* Glow behind article */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        {notice.image_url && (
          <div className="w-full h-72 sm:h-96 relative overflow-hidden bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={notice.image_url} alt={notice.title} className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          </div>
        )}
        
        <div className={`p-8 sm:p-12 relative z-10 ${notice.image_url ? '-mt-24' : ''}`}>
          <div className="flex flex-wrap gap-4 items-center mb-6 text-sm text-gray-300">
            <span className="flex items-center gap-1.5 font-bold text-blue-300 bg-blue-500/20 border border-blue-500/30 px-3 py-1.5 rounded-md uppercase tracking-wider shadow-[0_0_10px_rgba(59,130,246,0.2)]">
              <Tag size={14} /> {notice.category}
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-md font-medium">
              <Calendar size={14} className="text-blue-400" /> {format(new Date(notice.created_at), 'MMMM d, yyyy')}
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-md font-medium">
              <User size={14} className="text-blue-400" /> {notice.posted_by?.name || "Admin"}
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 text-white tracking-tight drop-shadow-md">{notice.title}</h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none text-gray-300 whitespace-pre-wrap leading-relaxed font-medium">
            {notice.content}
          </div>
        </div>
      </article>
    </motion.div>
  );
}
