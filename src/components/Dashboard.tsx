// Dashboard.tsx
import React, { useState } from "react";
import LivingRoom from "./dashboard/livingRoom/LivingRoom";
import Aquarium from "./dashboard/Aquarium";
import Usage from "./dashboard/Usage";

interface DashboardProps {
  isDarkMode: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isDarkMode }) => {
  const [rooms] = useState<string[]>(["Living Room", "Aquarium", "Usage"]);
  const [activeRoom, setActiveRoom] = useState(rooms[0]);

  return (
    <div className="relative w-full min-h-screen">

      {/* REDUCED BLUR: Changed from 40px to 8px for clarity */}
      <div className="fixed inset-0 -z-10 bg-white/5 backdrop-blur-[8px]" />

      {/* DARKER VIGNETTE: Helps the cards stand out */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

      {/* DASHBOARD CONTENT */}
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-5 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 p-2 bg-black/60 backdrop-blur-3xl rounded-[1.8rem] border border-white/10 shadow-2xl">
            {rooms.map((room, index) => (
              <button
                key={index}
                onClick={() => setActiveRoom(room)}
                className={`px-8 py-3.5 rounded-[1.2rem] text-xs font-black uppercase tracking-[0.2em] italic transition-none
                  ${activeRoom === room ? "bg-cyan-500 text-black shadow-lg" : "text-white/40 hover:text-white"}`}
              >
                {room}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full">
          {activeRoom === "Living Room" && <LivingRoom isDarkMode={isDarkMode} device={null} />}
          {activeRoom === "Aquarium" && <Aquarium device={null} />}
          {activeRoom === "Usage" && <Usage />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;