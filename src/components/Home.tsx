import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import Dashboard from "./Dashboard"; 
import Weather from "./dashboard/Weather";
import { LogEntry } from "./dashboard/Logs";

const sunnyVideo = require("../assets/weather/sunny.mp4");
const rainyVideo = require("../assets/weather/rainy.mp4");
const cloudyVideo = require("../assets/weather/cloudy.mp4");
const thunderVideo = require("../assets/weather/thunderstorm.mp4");

// Hardcoded Gateway URL
const GATEWAY_URL = "http://homelab.tail1ccd16.ts.net:8000";

const Home: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [weatherCode, setWeatherCode] = useState<string>("0");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [deviceStates, setDeviceStates] = useState<Record<string, any>>({});
  const videoRef = useRef<HTMLVideoElement>(null);

  const addLog = useCallback((type: LogEntry['type'], message: string, detail?: string) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(2, 11),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      type,
      message,
      detail
    };
    setLogs(prev => [newLog, ...prev].slice(0, 100));
  }, []);

  const clearLogs = useCallback(() => setLogs([]), []);

  // Device Syncing Logic
  useEffect(() => {
    const verifyGateway = async () => {
      try {
        const resp = await axios.get(`${GATEWAY_URL}/api/health`);
        addLog('SYSTEM', 'Gateway Online', `Status: ${resp.data.status}, Uptime: ${resp.data.uptime}`);
      } catch (err) {
        addLog('ERROR', 'Gateway Unreachable', (err as any).message);
      }
    };

    verifyGateway();

    const fetchInitialStatus = async () => {
      const url = `${GATEWAY_URL}/api/devices/status`;
      try {
        addLog('SYSTEM', 'Syncing devices...', `Requesting: ${url}`);
        const resp = await axios.get<any[]>(url);
        const initialState: Record<string, any> = {};
        resp.data.forEach((dev: any) => { 
          // The gateway returns 'devId', not 'id'
          initialState[dev.devId] = dev; 
        });
        setDeviceStates(initialState);
        addLog('SYSTEM', 'Initial Sync Complete', `Loaded ${resp.data.length} devices`);
      } catch (err) {
        const error = err as any;
        const msg = error.isAxiosError ? error.response?.data?.error || error.message : error.message || String(err);
        addLog('ERROR', 'Initial Sync Failed', msg);
      }
    };
    fetchInitialStatus();

    const eventSource = new EventSource(`${GATEWAY_URL}/api/status-stream`);
    eventSource.onmessage = (event) => {
      try {
        const update = JSON.parse(event.data);
        setDeviceStates((prev) => ({ ...prev, [update.devId]: update }));
      } catch (err) { console.error("Parse Error", err); }
    };
    return () => eventSource.close();
  }, []);

  // Extract Climate and Battery for Header
  const headerMetrics = useMemo(() => {
    const mainSensor = deviceStates["ebfd63f8defd4c8952ecyt"]; // Main Door
    const rawStatus = mainSensor?.status?.raw || [];
    
    const temp = rawStatus.find((s: any) => s.code === 'va_temperature')?.value;
    const batt = rawStatus.find((s: any) => s.code === 'battery_percentage')?.value;

    return {
      temp: temp !== undefined ? (temp / 10).toFixed(1) : "22.5",
      battery: batt !== undefined ? batt : 85
    };
  }, [deviceStates]);

  const currentVideo = useMemo(() => {
    const code = parseInt(weatherCode);
    if (code === 0 || code === 1 || code === 2) return sunnyVideo;
    if (code === 3 || code === 45 || code === 48) return cloudyVideo;
    if (code >= 51 && code <= 65) return rainyVideo;
    if (code >= 80 && code <= 82) return rainyVideo;
    if (code === 95) return thunderVideo;
    return sunnyVideo;
  }, [weatherCode]);

  // Force video reload when source changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [currentVideo]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "GOOD MORNING";
    if (hour < 17) return "GOOD AFTERNOON";
    if (hour < 21) return "GOOD EVENING";
    return "GOOD NIGHT";
  }, []);

  return (
    // Base background is now a solid, stable dark color
    <div className="min-h-screen flex flex-col font-sans bg-[#0f172a] text-white antialiased">
      
      {/* 1. HEADER WITH SCOPED VIDEO */}
      <header className="w-full p-3 shrink-0 relative overflow-hidden h-[120px] md:h-[140px]">
        
        {/* VIDEO CONFINED TO HEADER ONLY */}
        <div className="absolute inset-0 z-0">
          <video 
            ref={videoRef}
            autoPlay loop muted playsInline
            className="w-full h-full object-cover"        
          >
            <source src={currentVideo} type="video/mp4" />
          </video>
          {/* Blur helps blend the bottom of the header into the solid body */}
          {/* <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#0a0a0b]" /> */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f172a]" />
        </div>

        {/* HEADER CONTENT LAYER */}
        <div className="relative z-10 max-w-[1920px] mx-auto h-full flex items-center justify-between px-2 border-b border-white/5">
          
          {/* LEFT: CLIMATE GROUP */}
          <div className="flex-1 flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md p-1 rounded-3xl border border-white/10 shadow-2xl">
              <Weather onConditionChange={setWeatherCode} onLog={addLog} />
              <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/5">
                 <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-300">
                    <span className="text-sm">🌡️</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-base font-black italic uppercase leading-none text-white">{headerMetrics.temp}°C</span>
                    <span className="text-[10px] font-black uppercase text-white/30 mt-1">Indoor</span>
                 </div>
              </div>
            </div>
            <div className="hidden xl:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
               <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-300">
                  <span className="text-xs font-black">CAL</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-base font-black italic uppercase leading-none text-white/80">Flight to Patna</span>
                  <span className="text-[10px] font-black uppercase text-white/20 mt-1">Mar 30 • 6E</span>
               </div>
            </div>
          </div>

          {/* CENTER: GREETING */}
          <div className="hidden md:flex flex-col items-center flex-[1.2]">
            <h1 className="text-3xl lg:text-4xl font-black tracking-tighter italic uppercase text-white">
              {greeting}
            </h1>
            <span className="text-[9px] font-black tracking-[0.5em] text-white/10 uppercase mt-1">CORE OS V3</span>
          </div>

          {/* RIGHT: SYSTEM STATUS */}
          <div className="flex-1 flex justify-end items-center gap-4">
             <div className="flex items-center gap-4 bg-white/5 p-2 rounded-xl border border-white/10">
                <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-lg text-xl">
                  {isDarkMode ? "🌙" : "🌞"}
                </button>
                <div className="flex items-center gap-3 px-1">
                  <div className="flex flex-col items-end">
                    <span className={`text-base font-black italic leading-none ${headerMetrics.battery < 20 ? 'text-red-500' : 'text-white'}`}>{headerMetrics.battery}%</span>
                    <span className="text-[8px] font-black text-white/30 uppercase">Security</span>
                  </div>
                  <div className="relative w-12 h-6 border border-white/20 rounded-md p-[2px] bg-black/20">
                    <div className={`h-full rounded-[2px] transition-all duration-500 ${headerMetrics.battery < 20 ? 'bg-red-500' : 'bg-cyan-400'}`} style={{ width: `${headerMetrics.battery}%` }} />
                  </div>
                </div>
             </div>
          </div>
        </div>
      </header>

      {/* 2. STABLE MAIN CONTENT AREA */}
      <main className="flex-1 px-2 py-4 max-w-[1920px] mx-auto w-full">
        <Dashboard isDarkMode={isDarkMode} logs={logs} onLog={addLog} onClear={clearLogs} deviceStates={deviceStates} />
      </main>
    </div>
  );
};

export default Home;