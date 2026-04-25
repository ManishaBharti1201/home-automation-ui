import React, { useEffect, useState, useCallback } from "react";
import { RefreshCw } from 'lucide-react';
import wifi from "../../../assets/wifi/wifi.png";
import noWifi from "../../../assets/wifi/no-wifi.png";

interface SpeedCardProps {
  onLog?: (type: 'API' | 'UPDATE' | 'SYSTEM' | 'ERROR', message: string, detail?: string) => void;
}

const SpeedCard: React.FC<SpeedCardProps> = ({ onLog }) => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [metrics, setMetrics] = useState({ down: 852.4, up: 42.1, ping: 12 });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkNetworkStatus = useCallback(async () => {
    try {
      await fetch("https://www.google.com/favicon.ico", { method: "HEAD", mode: "no-cors", cache: "no-store" });
      if (!isOnline) onLog?.('SYSTEM', 'Network Restored', 'External connectivity detected');
      setIsOnline(true);
    } catch {
      if (isOnline) onLog?.('ERROR', 'Network Offline', 'Connectivity check failed');
      setIsOnline(false);
    }
  }, [onLog, isOnline]);

  useEffect(() => {
    checkNetworkStatus();
    const interval = setInterval(checkNetworkStatus, 30000); // Check every 30s to reduce jitter
    return () => clearInterval(interval);
  }, [checkNetworkStatus]);

  const refreshMetrics = () => {
    if (!isOnline || isRefreshing) return;
    setIsRefreshing(true);
    onLog?.('API', 'Starting Speed Test', 'Simulating network metrics...');
    
    // Simulate a network speed test delay
    setTimeout(() => {
      const newMetrics = {
        down: Number((800 + Math.random() * 150).toFixed(1)),
        up: Number((35 + Math.random() * 15).toFixed(1)),
        ping: Math.floor(8 + Math.random() * 12)
      };
      setMetrics(newMetrics);
      setIsRefreshing(false);
      onLog?.('UPDATE', 'Speed Metrics Updated', `Ping: ${newMetrics.ping}ms`);
    }, 1500);
  };

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
            <div className={`px-3 py-1 rounded-lg text-[10px] font-black border shadow-lg mt-1 w-fit ${
              isOnline ? 'bg-green-500/80 text-white border-green-400' : 'bg-red-600 text-white border-red-500'
            }`}>
                {isOnline ? "ONLINE" : "OFFLINE"}
            </div>
          </div>
        </div>
        
        <button 
          onClick={refreshMetrics}
          disabled={isRefreshing || !isOnline}
          className={`p-2.5 rounded-xl border border-white/10 bg-white/5 transition-all active:scale-95 
            ${isRefreshing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10 hover:border-white/20'}`}
          title="Refresh Speed"
        >
          <RefreshCw size={18} className={`text-white/60 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
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