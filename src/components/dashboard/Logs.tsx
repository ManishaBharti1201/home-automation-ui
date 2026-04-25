import React, { useEffect, useRef } from "react";

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'API' | 'UPDATE' | 'SYSTEM' | 'ERROR';
  message: string;
  detail?: string;
}

interface LogsProps {
  logs: LogEntry[];
  onClear: () => void;
}

const Logs: React.FC<LogsProps> = ({ logs, onClear }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top when a new log arrives (since Dashboard prepends logs)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [logs]);

  const getTypeStyles = (type: LogEntry['type']) => {
    switch (type) {
      case 'ERROR': return 'text-red-400 border-red-500/30 bg-red-500/10';
      case 'API': return 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10';
      case 'UPDATE': return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
      default: return 'text-slate-400 border-white/10 bg-white/5';
    }
  };

  return (
    <div className="w-full p-4 md:p-8 rounded-[2.5rem] bg-slate-900/60 backdrop-blur-3xl border-2 border-white/5 shadow-2xl transition-all min-h-[600px]">
      <div className="flex justify-between items-end mb-8">
        <div>
          <button 
            onClick={onClear}
            className="mt-3 px-4 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all active:scale-95"
          >
            Clear History
          </button>
        </div>
        <div className="flex items-baseline gap-3">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Total Events</p>
          <span className="text-3xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            {logs.length}
          </span>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="space-y-3 max-h-[500px] overflow-y-auto no-scrollbar pr-2 scroll-smooth"
      >
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/20">
            <span className="text-4xl mb-4">📂</span>
            <p className="font-black uppercase tracking-widest italic text-sm">No events recorded yet</p>
          </div>
        ) : (
          logs.map((log) => (
            <div 
              key={log.id} 
              className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex-shrink-0 w-24">
                <span className="text-sm font-black text-white/30 font-mono tracking-tighter">
                  [{log.timestamp}]
                </span>
              </div>
              
              <div className={`px-3 py-1 rounded-lg text-[9px] font-black border uppercase tracking-widest min-w-[70px] text-center ${getTypeStyles(log.type)}`}>
                {log.type}
              </div>

              <div className="flex-1">
                <p className="text-sm font-bold text-slate-200 uppercase tracking-tight">{log.message}</p>
                {log.detail && (
                  <p className="text-[10px] text-white/40 font-medium italic mt-0.5 truncate max-w-md">{log.detail}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Logs;