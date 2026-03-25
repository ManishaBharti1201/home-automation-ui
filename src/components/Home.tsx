import React, { useState, useMemo } from "react";
import Dashboard from "./Dashboard"; 
import Weather from "./dashboard/Weather";

const sunnyVideo = require("../assets/weather/sunny.mp4");

const Home: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "GOOD MORNING";
    if (hour < 17) return "GOOD AFTERNOON";
    if (hour < 21) return "GOOD EVENING";
    return "GOOD NIGHT";
  }, []);

  return (
    // Base background is now a solid, stable dark color
    <div className="min-h-screen flex flex-col font-sans bg-[#0a0a0b] text-white antialiased">
      
      {/* 1. HEADER WITH SCOPED VIDEO */}
      <header className="w-full p-3 shrink-0 relative overflow-hidden h-[120px] md:h-[140px]">
        
        {/* VIDEO CONFINED TO HEADER ONLY */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay loop muted playsInline
            className="w-full h-full object-cover"        
          >
            <source src={sunnyVideo} type="video/mp4" />
          </video>
          {/* Blur helps blend the bottom of the header into the solid body */}
          {/* <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#0a0a0b]" /> */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0b]/80" />
        </div>

        {/* HEADER CONTENT LAYER */}
        <div className="relative z-10 max-w-[1800px] mx-auto h-full flex items-center justify-between px-6 border-b border-white/5">
          
          {/* LEFT: WEATHER */}
          <div className="flex-1 flex items-center gap-4 ">
            <Weather />
            <div className="hidden xl:flex items-center gap-3 px-4 py-2 bg-black/20 rounded-xl border border-white/10">
               <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-300">
                  <span className="text-xs font-black">CAL</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-base font-black italic uppercase leading-none">Flight to Patna</span>
                  <span className="text-[10px] font-black uppercase text-white/30 mt-1">Mar 30 • 6E</span>
               </div>
            </div>
          </div>

          {/* CENTER: GREETING */}
          <div className="hidden md:flex flex-col items-center flex-[1.2]">
            <h1 className="text-3xl lg:text-4xl font-black tracking-tighter italic uppercase drop-shadow-2xl">
              {greeting}
            </h1>
            <span className="text-[9px] font-black tracking-[0.5em] text-white/20 uppercase mt-1">CORE OS V3</span>
          </div>

          {/* RIGHT: SYSTEM STATUS */}
          <div className="flex-1 flex justify-end items-center gap-4">
             <div className="flex items-center gap-4 bg-black/20 p-2 rounded-xl border border-white/10">
                <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-lg text-xl transition-none">
                  {isDarkMode ? "🌙" : "🌞"}
                </button>
                <div className="flex items-center gap-3 px-1">
                  <div className="flex flex-col items-end">
                    <span className="text-base font-black italic leading-none">94%</span>
                    <span className="text-[8px] font-black text-white/30 uppercase">Power</span>
                  </div>
                  <div className="relative w-12 h-6 border border-white/40 rounded-md p-[2px] bg-black/50">
                    <div className="h-full rounded-[2px] bg-cyan-400 w-[94%]" />
                  </div>
                </div>
             </div>
          </div>
        </div>
      </header>

      {/* 2. STABLE MAIN CONTENT AREA */}
      <main className="flex-1 p-6 max-w-[1800px] mx-auto w-full">
        <Dashboard isDarkMode={isDarkMode} />
      </main>
    </div>
  );
};

export default Home;