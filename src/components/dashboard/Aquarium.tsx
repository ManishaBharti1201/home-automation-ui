import React, { useEffect, useState } from "react";
import axios from "axios";
import { Lightbulb, Thermometer, Wind, Droplets, AlertTriangle, Soup } from "lucide-react";

const GATEWAY_URL = "http://192.168.0.197:8081";

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
      await axios.post(`${GATEWAY_URL}/api/device/control`, {
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

  const AquaCard = ({ title, icon, status, setStatus, subtext, energy, isSensor }: any) => {
    const isAlert = isSensor && status;
    
    return (
    <div 
      onClick={() => setStatus(!status)}
      className={`
      relative flex flex-col justify-between p-6 min-h-[180px] cursor-pointer
      border-2 rounded-[2.5rem] overflow-hidden transition-all duration-500
      ${isSensor 
        ? isAlert 
          ? 'bg-black border-orange-500 shadow-[0_0_60px_rgba(249,115,22,0.3)]' 
          : 'bg-black border-cyan-500 shadow-2xl'
        : status 
          ? 'bg-black border-cyan-400 shadow-[0_0_60px_rgba(6,182,212,0.3)]' 
          : 'bg-black border-white/30 hover:border-white/50 shadow-2xl'}
    `}>
      <div className="flex justify-between items-start relative z-10">
        <div className="relative">
          {(status || isSensor) && (
            <div className={`absolute inset-0 blur-xl rounded-full opacity-20 ${isAlert ? 'bg-orange-400' : 'bg-cyan-400'}`} />
          )}
          <div className={`
            relative w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all duration-500 border border-white/10
            ${isSensor
              ? isAlert 
                ? 'bg-gradient-to-tr from-orange-600 to-orange-400 text-white animate-bounce shadow-lg' 
                : 'bg-gradient-to-tr from-cyan-500 to-cyan-300 text-slate-900 shadow-lg transform -rotate-3'
              : status 
                ? 'bg-gradient-to-tr from-cyan-500 to-cyan-300 text-slate-900 shadow-lg' 
                : 'bg-white/10 text-white/70 shadow-inner'
            }
          `}>
            <span className={`transition-opacity duration-500 ${status ? "opacity-100" : "opacity-70"}`}>
              {icon}
            </span>
          </div>
        </div>

        {isSensor && (
          <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            status ? "bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]" : "bg-cyan-400 text-slate-900 shadow-[0_0_15px_rgba(34,211,238,0.4)]"
          }`}>
            {status ? "ALERT" : "SECURE"}
          </div>
        )}
      </div>

      <div className="mt-4 relative z-10">
        <div className={`font-black leading-tight uppercase transition-all ${
          isSensor ? 'text-2xl italic tracking-tighter drop-shadow-sm text-white' : 'text-xl tracking-tight text-white'
        }`}>
          {title}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className={`w-1.5 h-1.5 rounded-full ${
            isSensor ? status ? 'bg-orange-500 animate-pulse' : 'bg-cyan-400' : status ? 'bg-cyan-400' : 'bg-slate-600'
          }`} />
          <div className={`text-[11px] font-bold uppercase tracking-widest ${
            isSensor ? status ? 'text-orange-300' : 'text-cyan-300' : 'text-xs text-white'
          }`}>
            {subtext || (status ? "Active" : "Stopped")}
          </div>
        </div>
      </div>
      {energy && (
        <div className="absolute right-6 bottom-6 text-[9px] font-black text-white/50 uppercase italic tracking-tighter">
          {energy}
        </div>
      )}
    </div>
    );
  };

  const DeviceGroup = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-black/20 backdrop-blur-3xl p-5 rounded-[2.5rem] border border-white/10 shadow-inner">
      <p className="text-lg uppercase font-black tracking-[0.3em] text-cyan-400 ml-2 mb-4 italic">{title}</p>
      <div className="grid grid-cols-2 gap-4">{children}</div>
    </div>
  );

  return (
    <div className="w-full px-2 lg:px-4 pb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        
          <AquaCard title={aquaLight.name} icon={<Lightbulb size={32} />} status={aquaLight.status} setStatus={(val: boolean) => handleToggle("eb7808944838719ea1yctc", val, setAquaLight, aquaLight)} />
          <AquaCard title={aquaLight2.name} icon={<Lightbulb size={32} />} status={aquaLight2.status} setStatus={(val: boolean) => handleToggle("ebef989f18f6b4123bmqix", val, setAquaLight2, aquaLight2)} />      
        <AquaCard title={heater.name} icon={<Thermometer size={32} />} status={heater.status} setStatus={(val: boolean) => handleToggle("eb4a8281458f2a33f0g2tv", val, setHeater, heater)} subtext={heater.status ? "Warming" : "Standby"} energy="100W" />
        <AquaCard title={filter.name} icon={<Wind size={32} />} status={filter.status} setStatus={(val: boolean) => handleToggle("ebe9d4b02cca4e57ddhwwv", val, setFilter, filter)} energy="25W" />
        <AquaCard title={pump.name} icon={<Droplets size={32} />} status={pump.status} setStatus={(val: boolean) => handleToggle("ebf7e89f76b6c51114f2ci", val, setPump, pump)} energy="12W" />
        
        {/* Special Red Theme for Leak Sensor */}
        <AquaCard 
          title={leak.name}
          icon={<AlertTriangle size={32} />}
          status={leak.status} 
          setStatus={() => {}} 
          subtext={leak.status ? "Leak Detected!" : "Dry"} 
          isSensor={true}
        />

        {/* FEEDER CARD */}
        <div className={`
          relative flex flex-col justify-between p-6 min-h-[180px]
          border-2 rounded-[2.5rem] transition-all duration-500
          ${isFeeding ? 'bg-black border-orange-500 shadow-[0_0_60px_rgba(249,115,22,0.3)]' : 'bg-black border-white/30 shadow-2xl'}
        `}>
          <div className="flex justify-between items-start relative z-10">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all ${isFeeding ? 'bg-gradient-to-tr from-orange-600 to-orange-400 text-white animate-bounce' : 'bg-white/10 text-white/70 border border-white/10 shadow-inner'}`}>
              <span><Soup size={32} /></span>
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
            <div className="font-black text-xl text-white uppercase tracking-tight">Fish Feeder</div>
            <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-1">Last: {lastFoodGiven}</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Aquarium;