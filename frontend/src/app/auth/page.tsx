"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Megaphone, Lock, Mail, Loader2, AlertCircle } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Validation for Signup
    if (!isLogin) {
      const isAdmin = email.toLowerCase() === "shreyash506@gmail.com";
      const isIIT = email.toLowerCase().endsWith("@kgpian.iitkgp.ac.in");
      
      if (!isAdmin && !isIIT) {
        setError("Only official IIT KGP emails (@kgpian.iitkgp.ac.in) are allowed to sign up.");
        setLoading(false);
        return;
      }
    }

    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.push("/");
        router.refresh();
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        setMessage("Success! Please check your email for a verification link (if enabled), or simply switch to Login.");
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "w-full pl-12 pr-4 py-3 neo-border neo-shadow bg-white text-black font-bold placeholder-black/50 focus:outline-none focus:bg-cyan-100 transition-colors uppercase";

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="neo-card p-6 sm:p-10 bg-yellow-400">
          <div className="text-center mb-8 relative z-10">
            <div className="mx-auto w-16 h-16 bg-white neo-border flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
              <Megaphone className="text-black" size={32} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-black mb-2 uppercase tracking-tighter leading-none">
              {isLogin ? "Welcome Back" : "Join Connect"}
            </h1>
            <p className="text-black font-bold mt-4 uppercase border-t-[3px] border-black pt-4">
              {isLogin ? "Enter your details to access your account." : "Register with your IIT KGP email."}
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-red-400 text-black p-4 mb-6 text-sm font-bold uppercase neo-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-start gap-3">
                <AlertCircle size={18} className="shrink-0 mt-0.5" /> <span>{error}</span>
              </motion.div>
            )}
            {message && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-cyan-400 text-black p-4 mb-6 text-sm font-bold uppercase neo-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-start gap-3">
                {message}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={20} />
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="university@kgpian.iitkgp.ac.in" 
                className={inputStyles} 
              />
            </div>
            
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={20} />
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className={inputStyles} 
                minLength={6}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 neo-border bg-white text-black font-black uppercase tracking-widest text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex justify-center items-center gap-3 transition-all ${loading ? 'bg-gray-200 cursor-not-allowed shadow-none translate-x-[4px] translate-y-[4px]' : 'hover:bg-cyan-400 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]'}`}
            >
              {loading ? <Loader2 className="animate-spin text-black" size={24} /> : (isLogin ? "Sign In" : "Register")}
            </button>
          </form>

          <div className="mt-8 text-center border-t-[3px] border-black pt-6">
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(""); setMessage(""); }}
              className="text-black hover:bg-black hover:text-yellow-400 transition-colors text-sm font-black uppercase tracking-widest px-4 py-2 border-[3px] border-transparent hover:border-black"
            >
              {isLogin ? "No account? Sign up" : "Have an account? Sign in"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
