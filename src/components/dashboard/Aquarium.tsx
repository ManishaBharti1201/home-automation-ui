import React, { useEffect, useState } from "react";

interface AquariumProps {
  device: any;
}

const Aquarium: React.FC<AquariumProps> = ({ device }) => {
  const [lastFoodGiven, setLastFoodGiven] = useState<string>("March 02");
  const [isFeeding, setIsFeeding] = useState<boolean>(false);
  const [aquaLightStatus, setAquaLightStatus] = useState(false);
  const [aquaLightStatus2, setAquaLightStatus2] = useState(false);
  const [heaterStatus, setHeaterStatus] = useState(true);
  const [filterStatus, setFilterStatus] = useState(true);
  const [pumpStatus, setPumpStatus] = useState(true);
  const [leakStatus, setLeakStatus] = useState(false);

  // Device Mapping Logic
  useEffect(() => {
    if (device) {
      if (device.devId === "eb7808944838719ea1yctc") setAquaLightStatus(device.status);
      else if (device.devId === "aquarium_light_2") setAquaLightStatus2(device.status);
      else if (device.devId === "ebe9d4b02cca4e57ddhwwv") setFilterStatus(device.status);
      else if (device.devId === "ebf7e89f76b6c51114f2ci") setPumpStatus(device.status);
      else if (device.devId === "eb4a8281458f2a33f0g2tv") setHeaterStatus(device.status);
      else if (device.devId === "aquarium_leak_sensor_1") setLeakStatus(device.status);
    }
  }, [device]);

  const handleManualFeed = () => {
    setIsFeeding(true);
    const today = new Date().toLocaleDateString("en-US", { month: "long", day: "2-digit" });
    setLastFoodGiven(today);

    // Voice feedback
    const utterance = new SpeechSynthesisUtterance("Feeding the fish now");
    speechSynthesis.speak(utterance);

    setTimeout(() => setIsFeeding(false), 5000);
  };

  // Status Badge Component (Matches Living Room)
  const ControlBadge = ({ title, status, onToggle }: any) => {
    const getLabel = () => {
      if (title.includes("Light")) return status ? "ON" : "OFF";
      if (title.includes("Heater")) return status ? "WARMING" : "STANDBY";
      if (title.includes("Filter")) return status ? "ACTIVE" : "OFF";
      if (title.includes("Leak")) return status ? "DETECTED" : "SAFE";
      return status ? "FLOWING" : "IDLE";
    };

    const getColor = () => {
      if (title.includes("Leak") && status) return "text-red-400 bg-red-400/20 border-red-400/30";
      if (status) return "text-cyan-400 bg-cyan-400/20 border-cyan-400/30";
      return "text-white/40 bg-white/5 border-white/10";
    };

    return (
      <button
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className={`text-[10px] font-black px-3 py-1 rounded-lg border transition-all active:scale-95 ${getColor()}`}
      >
        {getLabel()}
      </button>
    );
  };

  const AquaCard = ({ title, icon, status, setStatus, subtext, energy }: any) => (
    <div className="relative flex flex-col justify-between p-4 min-h-[140px] bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl text-white group transition-all duration-300">
      <div className="flex justify-between items-start">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl transition-transform group-hover:scale-110">
          {icon}
        </div>
        <ControlBadge title={title} status={status} onToggle={() => setStatus(!status)} />
      </div>
      <div>
        <div className="font-bold text-base md:text-lg leading-tight">{title}</div>
        <div className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-0.5">
          {subtext || (status ? "Normal" : "Stopped")}
        </div>
      </div>
      {energy && <div className="absolute right-3 bottom-3 text-[10px] font-bold text-cyan-300/40">{energy}</div>}
    </div>
  );

  const DeviceGroup = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white/5 backdrop-blur-sm p-2 rounded-2xl border border-white/5">
      <p className="text-[11px] uppercase font-black tracking-[0.2em] text-white/20 ml-2 mb-2">{title}</p>
      <div className="grid grid-cols-2 gap-2">{children}</div>
    </div>
  );

  const DeviceCard = ({ title, icon, status, setStatus, isSmall }: any) => (
    <div className={`
      relative flex flex-col justify-between transition-all duration-300
      bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl text-white group
      ${isSmall ? 'p-3 min-h-[115px]' : 'p-4 min-h-[140px]'}
    `}>
      <div className="flex justify-between items-start">
        <div className={`rounded-xl bg-white/10 flex items-center justify-center transition-transform group-hover:scale-110 ${isSmall ? 'w-8 h-8 text-base' : 'w-10 h-10 text-xl'}`}>
          {icon}
        </div>
        <ControlBadge title={title} status={status} onToggle={() => setStatus(!status)} />
      </div>
      <div>
        <div className="font-bold text-base md:text-lg leading-tight">{title}</div>
      </div>
    </div>
  );

  return (
    <div className="w-full pb-8">
      {/* <div className="flex justify-between items-center mb-6 px-1">
        <h2 className="text-2xl font-black text-white tracking-tight drop-shadow-md italic">AQUARIUM</h2>
        <div className="h-px flex-1 mx-6 bg-gradient-to-r from-white/20 to-transparent" />
      </div> */}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

        <DeviceGroup title="Aquarium Lights">
          <DeviceCard title="Upper Light" icon="💡" status={aquaLightStatus} setStatus={setAquaLightStatus} isSmall />
          <DeviceCard title="Lower Light" icon="💡" status={aquaLightStatus2} setStatus={setAquaLightStatus2} isSmall />
        </DeviceGroup>
        <AquaCard title="Heater" icon="🌡️" status={heaterStatus} setStatus={setHeaterStatus} subtext={heaterStatus ? "Warming" : "Standby"} energy="100W" />
        <AquaCard title="Filter" icon="🌀" status={filterStatus} setStatus={setFilterStatus} energy="25W" />
        <AquaCard title="Oxygen" icon="💧" status={pumpStatus} setStatus={setPumpStatus} energy="12W" />
        <AquaCard title="Leak Sensor" icon="⚠️" status={leakStatus} setStatus={setLeakStatus} subtext={leakStatus ? "Leak Detected!" : "Dry"} />

        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">🍱</div>
            <button onClick={handleManualFeed} disabled={isFeeding} className="text-[10px] font-black px-3 py-1 rounded-lg border border-cyan-400/30 bg-cyan-400/20 text-cyan-400">
              {isFeeding ? "FEEDING..." : "FEED NOW"}
            </button>
          </div>
          <div>
            <div className="font-bold text-lg text-white">Fish Feeder</div>
            <div className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Last: {lastFoodGiven}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aquarium;