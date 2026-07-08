"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Megaphone, Calendar, Home, PlusCircle, LogIn, LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useRouter, usePathname } from "next/navigation";
import BackgroundCarousel from "@/components/BackgroundCarousel";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const isAdmin = session?.user?.email === "shreyash506@gmail.com";

  return (
    <html lang="en">
      <head>
        <title>Campus Connect</title>
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col text-black selection:bg-yellow-400 selection:text-black`}>
        {/* Neo-Brutalism Navbar */}
        <nav className="sticky top-0 z-50 w-full bg-black border-b-[6px] border-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter text-white uppercase group">
                <div className="bg-white p-1 border-2 border-transparent group-hover:border-white transition-all rounded-full overflow-hidden flex items-center justify-center">
                  <img src="/logo.svg" alt="IIT KGP Logo" className="h-8 w-8 object-contain" />
                </div>
                <span className="hidden sm:inline text-white">Campus<span className="text-yellow-400">Connect</span></span>
              </Link>
              
              <div className="flex items-center gap-1.5 sm:gap-4 md:gap-6 text-[10px] sm:text-sm font-bold uppercase tracking-wider">
                {/* Navigation Links */}
                <Link href="/" className={`flex items-center gap-2 transition-all p-2 sm:px-3 sm:py-1.5 border-[3px] ${pathname === '/' ? 'bg-cyan-400 text-black border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]' : 'text-white border-transparent hover:border-white'}`}>
                  <Home size={18} className="sm:hidden" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <Link href="/events" className={`flex items-center gap-2 transition-all p-2 sm:px-3 sm:py-1.5 border-[3px] ${pathname === '/events' ? 'bg-pink-400 text-black border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]' : 'text-white border-transparent hover:border-white'}`}>
                  <Calendar size={18} className="sm:hidden" />
                  <span className="hidden sm:inline">Events</span>
                </Link>
                
                {/* Admin Only Post Button */}
                {isAdmin && (
                  <Link href="/create" className={`flex items-center gap-2 transition-all p-2 sm:px-4 sm:py-1.5 border-[3px] ${pathname === '/create' ? 'bg-yellow-400 text-black border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]' : 'bg-white text-black border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]'}`}>
                    <PlusCircle size={16} /> <span className="hidden sm:inline">Post</span>
                  </Link>
                )}

                <div className="h-6 sm:h-8 w-1 bg-white mx-1 sm:mx-2"></div>

                {session ? (
                  <div className="flex items-center gap-2 sm:gap-5">
                    <span className="hidden md:flex items-center gap-2 text-white bg-black border-2 border-white px-3 py-1">
                      <User size={14} /> {session.user.email?.split('@')[0]}
                    </span>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-white border-b-[3px] sm:border-b-4 border-red-500 hover:bg-red-500 hover:text-black transition-colors p-1 sm:px-2 sm:py-1">
                      <LogOut size={16} className="sm:hidden" />
                      <span className="hidden sm:inline">Logout</span>
                    </button>
                  </div>
                ) : (
                  <Link href="/auth" className="flex items-center gap-2 bg-white text-black border-[3px] border-black shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] sm:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] p-2 sm:px-5 sm:py-2 hover:bg-cyan-400 transition-all">
                    <LogIn size={16} /> <span className="hidden sm:inline">Login</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>
        
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 relative z-10">
          {children}
        </main>
        
        <footer className="border-t-[6px] border-black py-8 text-center text-sm text-black font-bold bg-white mt-auto relative z-10">
          <p>© {new Date().getFullYear()} SHREYASH</p>
        </footer>
      </body>
    </html>
  );
}
