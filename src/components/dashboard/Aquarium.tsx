import React, { useEffect, useState } from "react";
import axios from "axios";

interface AquariumProps {
  device: any;
  onLog?: (type: 'API' | 'UPDATE' | 'SYSTEM' | 'ERROR', message: string, detail?: string) => void;
}

const Aquarium: React.FC<AquariumProps> = ({ device, onLog }) => {
  const [lastFoodGiven, setLastFoodGiven] = useState<string>("March 02");
  const [isFeeding, setIsFeeding] = useState<boolean>(false);
  const [aquaLight, setAquaLight] = useState({ name: "Upper Light", status: false });
  const [aquaLight2, setAquaLight2] = useState({ name: "Lower Light", status: false });
  const [heater, setHeater] = useState({ name: "Heater", status: true });
  const [filter, setFilter] = useState({ name: "Filter", status: true });
  const [pump, setPump] = useState({ name: "Oxygen", status: true });
  const [leak, setLeak] = useState({ name: "Leak Sensor", status: false });

  // Device Mapping Logic
  useEffect(() => {
    if (device) {
      Object.values(device).forEach((update: any) => {
        const devId = update.devId || update.id;
        const isOn = update.status?.value !== undefined ? update.status.value : update.isOn;
        const name = update.name;

        const mapState = (setter: any, defaultName: string) => setter((prev: any) => ({ name: name || prev.name || defaultName, status: isOn }));

        if (devId === "eb7808944838719ea1yctc") mapState(setAquaLight, "Upper Light");
        else if (devId === "ebef989f18f6b4123bmqix") mapState(setAquaLight2, "Lower Light");
        else if (devId === "ebe9d4b02cca4e57ddhwwv") mapState(setFilter, "Filter");
        else if (devId === "ebf7e89f76b6c51114f2ci") mapState(setPump, "Oxygen");
        else if (devId === "eb4a8281458f2a33f0g2tv") mapState(setHeater, "Heater");
        else if (devId === "eb82de64788b89910dj0ri") mapState(setLeak, "Leak Sensor");
      });
    }
  }, [device]);

  const handleToggle = async (deviceId: string, newValue: boolean, setter: any, current: any, code: string = "switch_1") => {
    setter({ ...current, status: newValue });
    onLog?.('API', `Request: Toggle ${deviceId}`, `Action: ${newValue ? 'ON' : 'OFF'} (Code: ${code})`);
    try {
      await axios.post("http://localhost:8000/api/device/control", {
        deviceId,
        code,
        value: newValue
      });
    } catch (err) {
      console.error(`Failed to control ${deviceId}`, err);
      onLog?.('ERROR', `API Failure: ${deviceId}`, (err as any).message);
      setter({ ...current, status: !newValue });
    }
  };

  const handleManualFeed = () => {
    setIsFeeding(true);
    const today = new Date().toLocaleDateString("en-US", { month: "long", day: "2-digit" });
    setLastFoodGiven(today);
    const utterance = new SpeechSynthesisUtterance("Feeding the fish now");
    speechSynthesis.speak(utterance);
    setTimeout(() => setIsFeeding(false), 5000);
  };

  const AquaCard = ({ title, icon, status, setStatus, subtext, energy, isRed }: any) => (
    <div 
      onClick={() => setStatus(!status)}
      className={`
      relative flex flex-col justify-between p-6 min-h-[170px] cursor-pointer
      backdrop-blur-2xl border-2 rounded-[2.5rem] overflow-hidden transition-all duration-500
      ${status 
        ? isRed ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_40px_rgba(239,68,68,0.15)]' 
                : 'bg-cyan-500/10 border-cyan-400/50 shadow-[0_0_40px_rgba(6,182,212,0.15)]' 
        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 shadow-2xl'}
    `}>
      <div className="flex justify-between items-start relative z-10">
        <div className="relative">
          {status && <div className={`absolute inset-0 blur-xl rounded-full ${isRed ? 'bg-red-500/20' : 'bg-cyan-400/20'}`} />}
          <div className={`
            relative w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-500 transform -rotate-3
            ${status 
              ? isRed ? 'bg-gradient-to-tr from-red-600 to-red-400 text-white' : 'bg-gradient-to-tr from-cyan-500 to-cyan-300 text-slate-900' 
              : 'bg-white/10 border border-white/10 text-white/40'
            }
           shadow-lg`}>
            {icon}
          </div>
        </div>
      </div>

      <div className="mt-4 relative z-10">
        <div className={`font-black text-xl leading-tight uppercase italic tracking-tight transition-colors ${status ? 'text-white' : 'text-white/60'}`}>
          {title}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className={`w-1.5 h-1.5 rounded-full ${status ? isRed ? 'bg-red-500 animate-pulse' : 'bg-cyan-400 animate-pulse' : 'bg-white/10'}`} />
          <div className={`text-xs font-bold uppercase tracking-widest ${status ? isRed ? 'text-red-400' : 'text-cyan-400' : 'text-white/20'}`}>
            {subtext || (status ? "Active" : "Stopped")}
          </div>
        </div>
      </div>
      {energy && <div className="absolute right-6 bottom-6 text-[9px] font-black text-white/10 uppercase italic">{energy}</div>}
    </div>
  );

  const DeviceGroup = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-slate-900/40 backdrop-blur-2xl p-5 rounded-[2.5rem] border border-white/10 shadow-2xl">
      <p className="text-lg uppercase font-black tracking-[0.3em] text-cyan-400/60 ml-2 mb-4 italic">{title}</p>
      <div className="grid grid-cols-2 gap-4">{children}</div>
    </div>
  );

  return (
    <div className="w-full px-2 lg:px-4 pb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

        <DeviceGroup title="Lights">
          <AquaCard title={aquaLight.name} icon="💡" status={aquaLight.status} setStatus={(val: boolean) => handleToggle("eb7808944838719ea1yctc", val, setAquaLight, aquaLight)} />
          <AquaCard title={aquaLight2.name} icon="💡" status={aquaLight2.status} setStatus={(val: boolean) => handleToggle("ebef989f18f6b4123bmqix", val, setAquaLight2, aquaLight2)} />
        </DeviceGroup>

        <AquaCard title={heater.name} icon="🌡️" status={heater.status} setStatus={(val: boolean) => handleToggle("eb4a8281458f2a33f0g2tv", val, setHeater, heater)} subtext={heater.status ? "Warming" : "Standby"} energy="100W" />
        <AquaCard title={filter.name} icon="🌀" status={filter.status} setStatus={(val: boolean) => handleToggle("ebe9d4b02cca4e57ddhwwv", val, setFilter, filter)} energy="25W" />
        <AquaCard title={pump.name} icon="💧" status={pump.status} setStatus={(val: boolean) => handleToggle("ebf7e89f76b6c51114f2ci", val, setPump, pump)} energy="12W" />
        
        {/* Special Red Theme for Leak Sensor */}
        <AquaCard 
          title={leak.name} 
          icon="⚠️" 
          status={leak.status} 
          setStatus={() => {}} 
          subtext={leak.status ? "Leak Detected!" : "Dry"} 
          isRed={leak.status} 
          isGreen={!leak.status} 
          isBlinking={leak.status} 
        />

        {/* FEEDER CARD */}
        <div className={`
          relative flex flex-col justify-between p-6 min-h-[170px]
          backdrop-blur-xl border-2 rounded-[2.5rem] transition-all duration-500
          ${isFeeding ? 'bg-slate-900 border-orange-500/50 shadow-[0_20px_50px_rgba(249,115,22,0.2)]' : 'bg-slate-800/20 border-white/10 shadow-2xl'}
        `}>
          <div className="flex justify-between items-start relative z-10">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all transform -rotate-3 ${isFeeding ? 'bg-orange-500 text-white animate-bounce' : 'bg-white/10 text-white/40 border border-white/10'}`}>
              🍱
            </div>
            <button 
              onClick={handleManualFeed} 
              disabled={isFeeding} 
              className={`text-[9px] font-black px-4 py-2 rounded-lg border uppercase tracking-widest transition-all 
                ${isFeeding ? 'bg-orange-500 border-orange-400 text-white' : 'bg-white/5 border-white/20 text-white/60 hover:bg-white/10'}`}
            >
              {isFeeding ? "FEEDING" : "FEED NOW"}
            </button>
          </div>
          <div className="mt-4 z-10">
            <div className="font-black text-xl text-white italic uppercase tracking-tight">Fish Feeder</div>
            <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">Last: {lastFoodGiven}</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Aquarium;