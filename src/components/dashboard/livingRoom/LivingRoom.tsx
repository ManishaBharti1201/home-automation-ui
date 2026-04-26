import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import SpeedCard from "./SpeedCard";
import Recycle from "./Recycle";
import CameraCard from './CameraCard';

interface LivingRoomProps {
  isDarkMode: boolean;
  device: any;
  onLog?: (type: 'API' | 'UPDATE' | 'SYSTEM' | 'ERROR', message: string, detail?: string) => void;
}

const LivingRoom: React.FC<LivingRoomProps> = ({ isDarkMode, device, onLog }) => {
  const [mainDoor, setMainDoor] = useState({ name: "Main Door", status: false });
  const [garageDoor, setGarageDoor] = useState({ name: "Garage Door", status: false });
  const [camera, setCamera] = useState({ name: "Camera", status: true });
  const [garden1, setGarden1] = useState({ name: "Garden 1", status: false });
  const [garden2, setGarden2] = useState({ name: "Garden 2", status: false });
  const [garage1, setGarage1] = useState({ name: "Garage 1", status: false });
  const [garage2, setGarage2] = useState({ name: "Garage 2", status: false });
  const [pujaLight, setPujaLight] = useState({ name: "Puja Light", status: false });
  const [fountain, setFountain] = useState({ name: "Fountain", status: false });
  const [roboVac, setRoboVac] = useState({ name: "Robo Vacuum", status: false });
  const [isCameraMaximized, setIsCameraMaximized] = useState(false);
  const prevCameraStatus = useRef(false);

  const [trashRecycleData] = useState({
    trash: { pickUpDate: "Tomorrow", lastPickUp: "Mon", lastStatus: "Success" },
    recycle: { pickUpDate: "Friday", lastPickUp: "Last Fri", lastStatus: "Success" }
  });

  useEffect(() => {
    if (device) {
      Object.values(device).forEach((update: any) => {
        const devId = update.devId || update.id || update.dev_id;
        // Ensure we extract a boolean status correctly from various possible formats
        const isOn = update.status?.value !== undefined ? !!update.status.value : (update.isOn !== undefined ? !!update.isOn : false);
        const name = update.name;

        const mapState = (setter: any, defaultName: string) => {
          setter((prev: any) => {
            if (prev.status === isOn && (prev.name === name || !name)) return prev;
            return { name: name || prev.name || defaultName, status: isOn };
          });
        };

        if (devId === "eba7ab5c1f6a3c9fabfaox") {
          // Auto-maximize logic: Trigger only when moving from false -> true
          if (isOn && !prevCameraStatus.current) {
            onLog?.('SYSTEM', 'Motion Detected', 'Auto-maximizing camera stream');
            setIsCameraMaximized(true);
          }
          prevCameraStatus.current = isOn;
          mapState(setCamera, "Security Camera");
        }
        if (devId === "ebfd63f8defd4c8952ecyt") mapState(setMainDoor, "Main Door");
        if (devId === "eb348887c8926694acl2d1") mapState(setGarageDoor, "Garage Door");
        if (devId === "eba76027112512d0c4yste") mapState(setGarden1, "Garden 1");
        if (devId === "ebe76b7ca03fe085c2tfum") mapState(setGarden2, "Garden 2");
        if (devId === "062025582cf432e12b55") mapState(setGarage1, "Garage 1");
        if (devId === "04348481600194f74f53") mapState(setGarage2, "Garage 2");
        if (devId === "ebace458dfa30f1a28ouzo") mapState(setPujaLight, "Puja Light");
        if (devId === "eb983962fe625a3cecm94t") mapState(setFountain, "Fountain");
        if (devId === "robo-vac") mapState(setRoboVac, "Robo Vacuum");
      });
    }
  }, [device, onLog]);

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

  const DeviceCard = ({ title, icon, status, setStatus, energy }: any) => (
  <div 
    onClick={() => setStatus(!status)}
    className={`
      relative flex flex-col justify-between p-6 min-h-[180px] cursor-pointer
      backdrop-blur-2xl border-2 rounded-[2.5rem] overflow-hidden transition-all duration-500
      ${status 
        ? 'bg-cyan-500/10 border-cyan-400/50 shadow-[0_0_40px_rgba(6,182,212,0.1)]' 
        : 'bg-white/5 border-white/5 shadow-2xl hover:border-white/10'}
    `}
  >
    {/* TOP ROW: ICON & BADGE */}
    <div className="flex justify-between items-start relative z-10">
      <div className="relative">
        {/* Glow behind the icon when ON */}
        {status && (
          <div className="absolute inset-0 bg-cyan-400/30 blur-xl rounded-full" />
        )}
        
        {/* ICON CONTAINER - Force background visibility */}
        <div className={`
          relative w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all duration-500
          ${status 
            ? 'bg-gradient-to-tr from-cyan-400 to-cyan-200 shadow-lg scale-110 rotate-3' 
            : 'bg-white/10 border border-white/10 shadow-inner'
          }
        `}>
          {/* ICON - No more grayscale, higher opacity */}
          <span className={`transition-opacity duration-500 ${status ? 'opacity-100' : 'opacity-70'}`}>
            {icon}
          </span>
        </div>
      </div>
    </div>

    {/* BOTTOM ROW: TEXT INFO */}
    <div className="mt-4 relative z-10">
      <div className={`font-black text-xl leading-tight uppercase tracking-tight transition-colors duration-300 ${
        status ? 'text-white' : 'text-white/60'
      }`}>
        {title}
      </div>
      <div className="flex items-center gap-2 mt-1">
        <div className={`w-1.5 h-1.5 rounded-full ${status ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
        <div className={`text-xs font-bold uppercase tracking-widest ${
          status ? 'text-cyan-400' : 'text-white/20'
        }`}>
          {status ? "Active" : "Standby"}
        </div>
      </div>
    </div>

    {/* ENERGY TAG */}
    {energy && (
      <div className="absolute right-6 bottom-6 text-[9px] font-black text-white/10 uppercase italic tracking-tighter">
        {energy}
      </div>
    )}
  </div>
);

  const DeviceGroup = ({ title, children }: { title: string; children: React.ReactNode }) => (
    // Slightly lighter background for the group container to separate it from the main floor 
    <div className="bg-white/5 backdrop-blur-2xl p-5 rounded-[2.5rem] border border-white/5 shadow-2xl">
      <p className="text-lg uppercase font-black tracking-[0.3em] text-cyan-400/60 ml-2 mb-4 italic">{title}</p>
      <div className="grid grid-cols-2 gap-4">{children}</div>
    </div>
  );

  return (
    // Ensure the main container is dark but not pure black to allow shadows to work
    <div className="w-full min-h-screen bg-transparent px-2 lg:px-4 pt-2 pb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        
        <SpeedCard onLog={onLog} />

        <DeviceGroup title="Garden Lights">
          <DeviceCard title={garden1.name} icon="💡" status={garden1.status} setStatus={(val: boolean) => handleToggle("eba76027112512d0c4yste", val, setGarden1, garden1)} />
          <DeviceCard title={garden2.name} icon="💡" status={garden2.status} setStatus={(val: boolean) => handleToggle("ebe76b7ca03fe085c2tfum", val, setGarden2, garden2)} />
        </DeviceGroup>

        <DeviceGroup title="Garage Lights">
          <DeviceCard title={garage1.name} icon="💡" status={garage1.status} setStatus={(val: boolean) => handleToggle("062025582cf432e12b55", val, setGarage1, garage1, "switch_led")} />
          <DeviceCard title={garage2.name} icon="💡" status={garage2.status} setStatus={(val: boolean) => handleToggle("04348481600194f74f53", val, setGarage2, garage2, "switch_led")} />
        </DeviceGroup>

        <DeviceCard title={roboVac.name} icon="🧹" status={roboVac.status} setStatus={(val: boolean) => handleToggle("robo-vac", val, setRoboVac, roboVac)} energy="1.2KW" />
        
        <div className="col-span-1">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-2">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic">{camera.name}</span>
               <div className="flex items-center gap-1">
                  <div className={`w-1 h-1 rounded-full ${camera.status ? 'bg-cyan-400 animate-pulse' : 'bg-red-500'}`} />
                  <span className="text-[8px] font-bold text-white/20 uppercase">{camera.status ? 'Live' : 'Offline'}</span>
               </div>
            </div>
            <div 
              className={`
                relative flex flex-col justify-between min-h-[140px] md:min-h-[160px] cursor-pointer
                backdrop-blur-md border-2 rounded-[2rem] overflow-hidden transition-all group
                ${camera.status 
                  ? 'bg-cyan-500/20 border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.2)]' 
                  : 'bg-slate-800/40 border-white/20'}
              `}
              onClick={() => setIsCameraMaximized(true)}
            >
              <div className="relative z-10 flex-1 h-full">
                <CameraCard id="eba7ab5c1f6a3c9fabfaox" gatewayBase="http://localhost:8000" onLog={onLog} />
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                <span className="text-[10px] font-black uppercase tracking-widest text-white bg-black/60 px-4 py-2 rounded-full border border-white/10">Expand View</span>
              </div>
            </div>
          </div>
        </div>

        <DeviceCard title={garageDoor.name} icon="🚗" status={garageDoor.status} setStatus={(val: boolean) => handleToggle("eb348887c8926694acl2d1", val, setGarageDoor, garageDoor)} />
        <DeviceCard title={pujaLight.name} icon="🪔" status={pujaLight.status} setStatus={(val: boolean) => handleToggle("ebace458dfa30f1a28ouzo", val, setPujaLight, pujaLight)} />
        <DeviceCard title={fountain.name} icon="💦" status={fountain.status} setStatus={(val: boolean) => handleToggle("eb983962fe625a3cecm94t", val, setFountain, fountain)} energy="2.0KW" />
        <DeviceCard title={mainDoor.name} icon="🚪" status={mainDoor.status} setStatus={(val: boolean) => handleToggle("ebfd63f8defd4c8952ecyt", val, setMainDoor, mainDoor)} />

        <Recycle
          data={{
            pickUpDate: trashRecycleData.trash.pickUpDate,
            lastStatus: trashRecycleData.trash.lastStatus
          }} type={"trash"} />

        <Recycle
          data={{
            pickUpDate: trashRecycleData.recycle.pickUpDate,
            lastStatus: trashRecycleData.recycle.lastStatus
          }} type={"recycle"} />
      </div>

      {/* Camera Fullscreen Overlay */}
      {isCameraMaximized && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 md:p-10"
          onClick={() => setIsCameraMaximized(false)}
        >
          <div 
            className="relative w-full max-w-6xl aspect-video bg-black rounded-[3rem] overflow-hidden border-2 border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsCameraMaximized(false)}
              className="absolute top-8 right-8 z-[110] w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-white text-xl transition-all active:scale-90"
            >
              ✕
            </button>
            <div className="w-full h-full">
              <CameraCard id="eba7ab5c1f6a3c9fabfaox" gatewayBase="http://localhost:8000" onLog={onLog} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LivingRoom;