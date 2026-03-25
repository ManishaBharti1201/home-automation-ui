import React, { useEffect, useState, useCallback } from "react";
import wifi from "../../../assets/wifi/wifi.png";
import noWifi from "../../../assets/wifi/no-wifi.png";

const SpeedCard = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [metrics, setMetrics] = useState({ down: 852.4, up: 42.1, ping: 12 });

  const checkNetworkStatus = useCallback(async () => {
    try {
      await fetch("https://www.google.com/favicon.ico", { method: "HEAD", mode: "no-cors", cache: "no-store" });
      setIsOnline(true);
    } catch {
      setIsOnline(false);
    }
  }, []);

  useEffect(() => {
    checkNetworkStatus();
    const interval = setInterval(checkNetworkStatus, 30000); // Check every 30s to reduce jitter
    return () => clearInterval(interval);
  }, [checkNetworkStatus]);

  return (
    <div className={`
      relative p-6 rounded-[2rem] min-h-[180px] flex flex-col justify-between border-2 backdrop-blur-md
      ${isOnline ? 'bg-black/40 border-green-500/30 shadow-2xl' : 'bg-red-950/40 border-red-500 shadow-2xl'}
    `}>
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center border-2 bg-white/5 border-white/10">
            <img src={isOnline ? wifi : noWifi} alt="wifi" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h3 className="text-white font-black text-xl italic uppercase tracking-tighter drop-shadow-md">Network</h3>
            <p className={`text-[11px] uppercase tracking-[0.2em] font-black mt-1 ${isOnline ? 'text-green-400/60' : 'text-red-400'}`}>
              {isOnline ? "System Stable" : "Connection Lost"}
            </p>
          </div>
        </div>
        
        <div className={`px-4 py-2 rounded-xl text-xs font-black border shadow-lg ${
          isOnline ? 'bg-green-500/80 text-white border-green-400' : 'bg-red-600 text-white border-red-500'
        }`}>
            {isOnline ? "ONLINE" : "OFFLINE"}
        </div>
      </div>

      {/* METRICS */}
      <div className="flex items-end justify-between mt-6">
        <div className="flex flex-col">
          <span className="text-5xl font-black tracking-tighter italic leading-none text-white drop-shadow-lg">
            {isOnline ? metrics.down : '---'}
            <span className="text-sm italic font-black text-white/40 ml-2 uppercase">Mbps</span>
          </span>
          <div className="text-[11px] font-black tracking-[0.2em] mt-2 text-cyan-400">
            ↓ DOWNLOAD SPEED
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="text-right">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Upload</p>
            <p className="text-xl font-black italic text-white leading-none">
              {isOnline ? metrics.up : '---'} <span className="text-xs text-white/20">Mb/s</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Ping</p>
            <p className={`text-xl font-black italic leading-none ${isOnline ? 'text-green-400' : 'text-red-500'}`}>
              {isOnline ? metrics.ping : '---'} <span className="text-xs opacity-30">ms</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeedCard;