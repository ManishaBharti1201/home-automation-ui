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
      <div className="fixed inset-0 -z-10 bg-black/20 backdrop-blur-[12px]" />

      {/* DEEP VIGNETTE */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-black/40" />

      {/* DASHBOARD CONTENT */}
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-2 overflow-x-auto no-scrollbar">
          <div className="flex gap-3 p-2 bg-white/5 backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-2xl mb-4">
            {rooms.map((room, index) => (
              <button
                key={index}
                onClick={() => setActiveRoom(room)} 
                className={`px-6 py-3 rounded-[1.2rem] text-sm font-black uppercase tracking-[0.2em] italic transition-none
                  ${activeRoom === room ? "bg-cyan-500 text-black shadow-lg" : "text-white/40 hover:text-white"}`}
              >
                {room}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full">
          {activeRoom === "Living Room" && <LivingRoom isDarkMode={isDarkMode} device={deviceStates} onLog={onLog} />}
          {activeRoom === "Aquarium" && <Aquarium device={deviceStates} onLog={onLog} />}
          {activeRoom === "Weather" && <WeatherDetail onLog={onLog} />}
          {activeRoom === "Usage" && <Usage onLog={onLog} />}
          {activeRoom === "Logs" && <Logs logs={logs} onClear={onClear} />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;