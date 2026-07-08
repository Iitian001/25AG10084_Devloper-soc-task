"use client";

import { useState, useEffect } from "react";
import { fetcher } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { Megaphone, Calendar, UploadCloud, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { User } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

export default function CreatePost() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"notice" | "event">("notice");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email === "shreyash506@gmail.com") {
        setIsAdmin(true);
        // Also fetch our dummy users table just in case we need the specific backend ID
        try {
          const users = await fetcher('/users');
          if (users.length > 0) setCurrentUser(users[0]);
        } catch (e) {
          console.error(e);
        }
      }
      setAuthChecking(false);
    }
    checkAuth();
  }, []);

  if (authChecking) {
    return <div className="flex justify-center py-32"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;
  }

  if (!isAdmin) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 text-red-400 glass rounded-3xl mt-10 max-w-2xl mx-auto">
        <AlertCircle size={48} className="mb-4 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
        <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
        <p className="text-gray-400 text-center max-w-md">You do not have permission to access the creation dashboard. Only administrators are allowed to post notices and events.</p>
      </motion.div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) {
      setError("No user found. Please ensure there is at least one user in the database.");
      return;
    }
    
    setError("");
    setLoading(true);
    setSuccess(false);
    
    const formData = new FormData(e.currentTarget);
    formData.append('posted_by', currentUser.id);

    try {
      const endpoint = activeTab === "notice" ? "/notices" : "/events";
      
      const res = await fetch(`https://two5ag10084-devloper-soc-task.onrender.com/api${endpoint}`, {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create post");
      }
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "w-full px-4 py-3 neo-border neo-shadow bg-white text-black font-bold placeholder-black/50 focus:outline-none focus:bg-yellow-100 transition-colors uppercase";
  const labelStyles = "block text-sm font-black mb-2 text-black uppercase tracking-wider";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="neo-card p-6 sm:p-12 bg-white">
        <div className="relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-black mb-3 text-black tracking-tighter uppercase">CREATE <span className="text-pink-500 underline decoration-[6px]">POST</span></h1>
            <p className="text-black font-bold text-lg uppercase">Share an announcement or organize an event.</p>
          </div>

          {/* Neo-Brutalism Tab Switcher */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <button 
              type="button"
              className={`flex-1 flex justify-center items-center gap-2 py-4 text-xl font-black uppercase tracking-widest border-[3px] border-black transition-all ${activeTab === 'notice' ? 'bg-cyan-400 text-black shadow-none translate-x-[4px] translate-y-[4px]' : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-cyan-400 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'}`}
              onClick={() => setActiveTab("notice")}
            >
              <Megaphone size={24} /> Notice
            </button>
            <button 
              type="button"
              className={`flex-1 flex justify-center items-center gap-2 py-4 text-xl font-black uppercase tracking-widest border-[3px] border-black transition-all ${activeTab === 'event' ? 'bg-pink-400 text-black shadow-none translate-x-[4px] translate-y-[4px]' : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-pink-400 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'}`}
              onClick={() => setActiveTab("event")}
            >
              <Calendar size={24} /> Event
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-red-400 text-black p-4 mb-8 text-sm font-bold uppercase neo-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
                <AlertCircle size={20} /> {error}
              </motion.div>
            )}
            {success && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-emerald-400 text-black p-4 mb-8 text-sm font-bold uppercase neo-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
                <CheckCircle2 size={20} /> Successfully posted! Redirecting to dashboard...
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className={labelStyles}>Title <span className="text-red-500 text-2xl leading-none">*</span></label>
              <input name="title" required type="text" placeholder="A SHORT, CATCHY TITLE" className={inputStyles} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <label className={labelStyles}>Category <span className="text-red-500 text-2xl leading-none">*</span></label>
                <select name="category" required className={`${inputStyles} cursor-pointer appearance-none`}>
                  <option value="Academic">Academic</option>
                  <option value="Sports">Sports</option>
                  <option value="Clubs">Clubs</option>
                  <option value="General">General</option>
                </select>
              </div>
              
              {activeTab === "event" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <label className={labelStyles}>Organizer <span className="text-red-500 text-2xl leading-none">*</span></label>
                  <input name="organizer" required type="text" placeholder="CLUB OR PERSON NAME" className={inputStyles} />
                </motion.div>
              )}
            </div>

            {activeTab === "notice" ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key="notice-fields">
                <label className={labelStyles}>Content <span className="text-red-500 text-2xl leading-none">*</span></label>
                <textarea name="content" required rows={6} placeholder="WHAT DO YOU WANT TO ANNOUNCE?" className={`${inputStyles} resize-none`}></textarea>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key="event-fields" className="space-y-8">
                <div>
                  <label className={labelStyles}>Description <span className="text-red-500 text-2xl leading-none">*</span></label>
                  <textarea name="description" required rows={4} placeholder="EVENT DETAILS, WHAT TO EXPECT..." className={`${inputStyles} resize-none`}></textarea>
                </div>

                <div>
                  <label className={labelStyles}>Venue <span className="text-red-500 text-2xl leading-none">*</span></label>
                  <input name="venue" required type="text" placeholder="WHERE IS IT HAPPENING?" className={inputStyles} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label className={labelStyles}>Start Time <span className="text-red-500 text-2xl leading-none">*</span></label>
                    <input name="start_time" required type="datetime-local" className={inputStyles} />
                  </div>
                  <div>
                    <label className={labelStyles}>End Time <span className="text-red-500 text-2xl leading-none">*</span></label>
                    <input name="end_time" required type="datetime-local" className={inputStyles} />
                  </div>
                </div>
              </motion.div>
            )}

            <div>
              <label className={labelStyles}>Cover Image</label>
              <div className="border-[4px] border-dashed border-black bg-yellow-400 p-10 text-center hover:bg-yellow-500 transition-colors cursor-pointer group relative overflow-hidden">
                <input type="file" name="image" id="image" accept="image/*" className="hidden" onChange={(e) => {
                  const label = document.getElementById('file-label');
                  if (label && e.target.files && e.target.files.length > 0) label.innerText = e.target.files[0]?.name;
                }} />
                <label htmlFor="image" className="cursor-pointer flex flex-col items-center gap-3 relative z-10 w-full h-full">
                  <div className="p-3 bg-white neo-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:scale-110 transition-transform duration-300">
                    <UploadCloud className="text-black" size={32} />
                  </div>
                  <span id="file-label" className="text-xl font-black text-black mt-2 uppercase tracking-tight">Click to select an image</span>
                  <span className="text-sm font-bold text-black uppercase">High-res PNG or JPG (max. 5MB)</span>
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-5 border-[4px] border-black text-black font-black uppercase tracking-widest text-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex justify-center items-center gap-4 transition-all ${loading ? 'bg-gray-300 cursor-not-allowed shadow-none translate-x-[6px] translate-y-[6px]' : activeTab === 'notice' ? 'bg-cyan-400 hover:bg-cyan-500 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[6px] active:translate-y-[6px]' : 'bg-pink-400 hover:bg-pink-500 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[6px] active:translate-y-[6px]'}`}
            >
              {loading ? <Loader2 className="animate-spin text-black" size={32} /> : null}
              {loading ? "TRANSMITTING..." : `PUBLISH ${activeTab === 'notice' ? 'NOTICE' : 'EVENT'}`}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
