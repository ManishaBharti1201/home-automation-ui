// Dashboard.tsx
import React, { useState } from "react";
import LivingRoom from "./dashboard/livingRoom/LivingRoom";
import Aquarium from "./dashboard/Aquarium";
import Usage from "./dashboard/Usage";
import Logs, { LogEntry } from "./dashboard/Logs";
import WeatherDetail from "./dashboard/WeatherDetail";

interface DashboardProps {
  isDarkMode: boolean;
  logs: LogEntry[];
  onLog: (type: LogEntry['type'], message: string, detail?: string) => void;
  onClear: () => void;
  deviceStates: Record<string, any>;
}

const Dashboard: React.FC<DashboardProps> = ({ isDarkMode, logs, onLog, onClear, deviceStates }) => {
  const [rooms] = useState<string[]>(["Living Room", "Aquarium", "Weather", "Usage", "Logs"]);
  const [activeRoom, setActiveRoom] = useState(rooms[0]);

  return (
    <div className="relative w-full min-h-screen">

      {/* SHADY GLASS: Subtle dark overlay */}
      <div className="fixed inset-0 -z-10 bg-slate-900/40 backdrop-blur-[24px]" />

      {/* DEEP VIGNETTE */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-black/40" />

      {/* DASHBOARD CONTENT */}
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-2 overflow-x-auto no-scrollbar">
          <div className="flex gap-3 p-2 bg-black border-2 border-white/20 rounded-[2.5rem] shadow-2xl mb-4">
            {rooms.map((room, index) => (
              <button
                key={index}
                onClick={() => setActiveRoom(room)} 
                className={`px-8 py-3 rounded-[1.8rem] text-sm font-black uppercase tracking-[0.2em] italic transition-all duration-300
                  ${activeRoom === room ? "bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]" : "text-white hover:bg-white/10"}`}
              >
                {room}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full">
          {activeRoom === "Living Room" && <LivingRoom isDarkMode={isDarkMode} device={deviceStates} onLog={onLog} />}
          {activeRoom === "Aquarium" && (
            <div className="w-full min-h-screen bg-white/20 backdrop-blur-3xl rounded-[3rem] px-4 py-8 border border-white/20 shadow-2xl mt-4">
              <Aquarium device={deviceStates} onLog={onLog} />
            </div>
          )}
          {activeRoom === "Weather" && <WeatherDetail onLog={onLog} />}
          {activeRoom === "Usage" && <Usage onLog={onLog} />}
          {activeRoom === "Logs" && <Logs logs={logs} onClear={onClear} />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;