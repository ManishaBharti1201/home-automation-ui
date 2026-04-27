import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import Dashboard from "./Dashboard"; 
import Weather from "./dashboard/Weather";
import { LogEntry } from "./dashboard/Logs";

import sunnyVideo from '../assets/weather/sunny.mp4';
import rainyVideo from '../assets/weather/rainy.mp4';
import cloudyVideo from '../assets/weather/cloudy.mp4';
import thunderVideo from '../assets/weather/thunderstorm.mp4';
import foggyVideo from '../assets/weather/foggy.mp4';
import heavyDrizzleVideo from '../assets/weather/heavy-drizzle.mp4';
import heavyRainVideo from '../assets/weather/heavy-rain.mp4';
import heavyShowersVideo from '../assets/weather/heavy-showers.mp4';
import mainlyClearVideo from '../assets/weather/mainly-clear.mp4';
import overcastVideo from '../assets/weather/overcast.mp4';
import rainShowersVideo from '../assets/weather/rain-showers.mp4';
import rimeFogVideo from '../assets/weather/rime-fog.mp4';


// Hardcoded Gateway URL
const GATEWAY_URL = "http://homelab.tail1ccd16.ts.net:8081";

const Home: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [weatherCode, setWeatherCode] = useState<string>("0");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [deviceStates, setDeviceStates] = useState<Record<string, any>>({});
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInitialSyncDone = useRef(false);

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
        const resp = await axios.get<{ status: string; uptime: string }>(`${GATEWAY_URL}/api/health`);
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
        isInitialSyncDone.current = true;
      } catch (err) {
        const error = err as any;
        const msg = error.isAxiosError ? error.response?.data?.error || error.message : error.message || String(err);
        addLog('ERROR', 'Initial Sync Failed', msg);
      }
    };
    fetchInitialStatus();

    const eventSource = new EventSource(`${GATEWAY_URL}/api/status-stream`);

    eventSource.onopen = () => addLog('SYSTEM', 'Status Stream Connected', 'Listening for real-time updates');
    eventSource.onerror = () => addLog('ERROR', 'Status Stream Failure', 'Connection to gateway lost');

    eventSource.onmessage = (event) => {
      try {
        const update = JSON.parse(event.data);
        // Log status changes that occur after the initial dashboard sync
        if (isInitialSyncDone.current && update && update.name) {
          const statusLabel = update.isOn ? 'ON' : 'OFF';
          addLog('UPDATE', `Device: ${update.name}`, `Status changed to ${statusLabel}`);
        }
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
    const batt = rawStatus.find((s: any) => s.code === 'battery_percentage')?.value; // Keep battery for other uses

    return {
      temp: temp !== undefined ? (temp / 10).toFixed(1) : "22.5",
      battery: batt !== undefined ? batt : 85
    };
  }, [deviceStates]);

  const currentVideo = useMemo(() => {
    const code = parseInt(weatherCode);
    switch (code) {
      case 0: 
        return sunnyVideo;
      case 1: 
        return mainlyClearVideo;
      case 2: 
        return cloudyVideo;
      case 3: 
        return overcastVideo;
      case 45: 
        return foggyVideo;
      case 48: 
        return rimeFogVideo;
      case 51:
      case 53:
      case 56:
      case 57:
      case 61:
      case 63: 
        return rainyVideo;
      case 55: 
        return heavyDrizzleVideo;
      case 65:
      case 66:
      case 67: 
        return heavyRainVideo;
      case 71:
      case 73:
      case 75:
      case 77:
      case 85:
      case 86: 
        return rainShowersVideo;
      case 80: 
        return rainShowersVideo;
      case 81:
      case 82: 
        return heavyShowersVideo;
      case 95:
      case 96:
      case 99: 
        return thunderVideo;
      default: 
        return sunnyVideo;
    }
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

  const currentDate = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      weekday: 'long'
    });
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
            key={currentVideo}
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
              <Weather onConditionChange={setWeatherCode} onLog={addLog} /> {/* Weather component remains */}
            </div> 
            <div className="hidden xl:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5"> 
               <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-300">
                  <span className="text-xs font-black">✈️</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-base font-black italic uppercase leading-none text-white/80">Flight to Patna</span>
                  <span className="text-[10px] font-black uppercase text-white/20 mt-1">Mar 30 • 6E</span>
               </div>
            </div>
          </div>

          {/* CENTER: BRANDING & GREETING */}
          <div className="hidden md:flex flex-col items-center justify-center flex-[1.2] gap-1 text-center">
            <h1 className="text-3xl lg:text-4xl font-black tracking-tighter italic uppercase text-white">
              {greeting} BHANU
            </h1>
            <span className="text-[16px] font-black tracking-[0.5em] text-white/80 uppercase"> {currentDate}</span>
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