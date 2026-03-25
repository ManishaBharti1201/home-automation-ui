import React, { useEffect, useState } from "react";
import SpeedCard from "./SpeedCard";
import Recycle from "./Recycle";

interface LivingRoomProps {
  isDarkMode: boolean;
  device: any;
}

const LivingRoom: React.FC<LivingRoomProps> = ({ isDarkMode, device }) => {
<<<<<<< HEAD
  const [gardenDevice, setGardenDevice] = useState<any>(null);
  const [fountainDevice, setFountainDevice] = useState<any>(null);
  const [garageDevice, setGarageDevice] = useState<any>(null);
  const [trashRecycleData, setTrashRecycleData] = useState({
    trash: {
      pickUpDate: "",
      lastPickUp: "",
      lastStatus: "",
    },
    recycle: {
      pickUpDate: "",
      lastPickUp: "",
      lastStatus: "",
    },
  });

  // Function to check if today is Friday
  const isFriday = () => {
    const today = new Date();
    return today.getDay() === 5; // 5 represents Friday
  };

  // Function to fetch TrashRecycle data
  // const fetchTrashRecycleData = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:8081/devices/WM"); // Replace with your actual API endpoint

  //     setTrashRecycleData({
  //       trash: {
  //         pickUpDate: (
  //           response.data as {
  //              NextTrashService: string ;
  //           }
  //         ).NextTrashService,
  //         lastPickUp: (
  //           response.data as {
  //             PreviousTrashService: string ;
  //           }
  //         ).PreviousTrashService,
  //        lastStatus: (
  //           response.data as {
  //             PreviousTrashStatus: string ;
  //           }
  //         ).PreviousTrashStatus,
  //       },
  //       recycle: {
  //         pickUpDate: (
  //           response.data as {
  //             NextRecyclingService: string ;
  //           }
  //         ).NextRecyclingService,
  //         lastPickUp: (
  //           response.data as {
  //             PreviousRecyclingService: string ;
  //           }
  //         ).PreviousRecyclingService,
  //         lastStatus: (
  //           response.data as {
  //             PreviousRecyclingStatus: string ;
  //           }
  //         ).PreviousRecyclingStatus,
  //       },
  //     });
  //   } catch (error) {
  //     console.error("Error fetching TrashRecycle data:", error);
  //   }
  // };

  useEffect(() => {
    // Check if today is Friday and fetch data
    // if (isFriday()) {
    //  fetchTrashRecycleData();
    //}

    // Set up an interval to check every day at midnight
    const interval = setInterval(() => {
      if (isFriday()) {
      //  fetchTrashRecycleData();
      }
    }, 24 * 60 * 60 * 1000); // Check every 24 hours

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  // Update state based on the device data
  useEffect(() => {
    if (device) {
      if (device.devId === "eba76027112512d0c4yste") {
        console.log("Event received for Garden:", device);
        setGardenDevice(device);
      } else if (device.devId === "eb983962fe625a3cecm94t") {
        console.log("Event received for Fountain:", device);
        setFountainDevice(device);
      } else if (device.devId === "062025582462ab4e42ad") {
        console.log("Event received for Garage Bulb 1:", device);
        setGarageDevice(device);
      }
=======
  const [mainDoor, setMainDoor] = useState({ status: false });
  const [garageDoor, setGarageDoor] = useState({ status: false });
  const [camera, setCamera] = useState({ status: true });
  const [garden1, setGarden1] = useState({ status: false });
  const [garden2, setGarden2] = useState({ status: false });
  const [garage1, setGarage1] = useState({ status: false });
  const [garage2, setGarage2] = useState({ status: false });
  const [pujaLight, setPujaLight] = useState({ status: false });
  const [fountain, setFountain] = useState({ status: false });
  const [roboVac, setRoboVac] = useState({ status: false });

  const [trashRecycleData] = useState({
    trash: { pickUpDate: "Tomorrow", lastPickUp: "Mon", lastStatus: "Success" },
    recycle: { pickUpDate: "Friday", lastPickUp: "Last Fri", lastStatus: "Success" }
  });

  useEffect(() => {
    if (device) {
      if (device.devId === "main-door") setMainDoor({ status: device.status });
      if (device.devId === "garage-door") setGarageDoor({ status: device.status });
      if (device.devId === "garden-1") setGarden1({ status: device.status });
      if (device.devId === "garden-2") setGarden2({ status: device.status });
      if (device.devId === "garage-1") setGarage1({ status: device.status });
      if (device.devId === "garage-2") setGarage2({ status: device.status });
      if (device.devId === "puja-light") setPujaLight({ status: device.status });
      if (device.devId === "fountain") setFountain({ status: device.status });
      if (device.devId === "robo-vac") setRoboVac({ status: device.status });
>>>>>>> 896f041 (ui fix , dockerfile, github action)
    }
  }, [device]);

  const ControlBadge = ({ title, status, onToggle }: { title: string, status: boolean, onToggle: () => void }) => {
    const getLabel = () => {
      if (title.includes("Door")) return status ? "OPEN" : "LOCKED";
      if (title.includes("Camera")) return status ? "LIVE" : "OFFLINE";
      if (title.includes("Vacuum")) return status ? "CLEANING" : "DOCKED";
      return status ? "ON" : "OFF";
    };

    const getColor = () => {
      if (status) return "text-black bg-cyan-400 border-cyan-300";
      return "text-white/40 bg-white/5 border-white/10";
    };

    return (
      <button
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className={`text-[11px] font-black px-4 py-2 rounded-xl border uppercase tracking-tighter ${getColor()}`}
      >
        {getLabel()}
      </button>
    );
  };

  const DeviceCard = ({ title, icon, status, setStatus, energy }: any) => (
    <div className={`
      relative flex flex-col justify-between p-5 min-h-[140px] md:min-h-[160px] 
      backdrop-blur-md border-2 rounded-[2rem] overflow-hidden transition-all
      ${status 
        ? 'bg-cyan-500/20 border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.2)]' 
        : 'bg-black/40 border-white/10 shadow-2xl'}
    `}>
      <div className="flex justify-between items-start relative z-10">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
          status ? 'bg-cyan-500/40 text-white' : 'bg-white/5 text-white/40'
        }`}>
          {icon}
        </div>
        <ControlBadge title={title} status={status} onToggle={() => setStatus(!status)} />
      </div>

      <div className="mt-4 relative z-10">
        <div className="font-black text-lg md:text-xl leading-tight italic uppercase tracking-tight text-white drop-shadow-md">
          {title}
        </div>
        <div className={`text-[11px] font-black uppercase tracking-[0.2em] mt-1 ${
          status ? 'text-cyan-300' : 'text-white/40'
        }`}>
          {status ? "SYSTEM ACTIVE" : "STANDBY"}
        </div>
      </div>
      {energy && <div className="absolute right-4 bottom-4 text-[10px] font-black text-white/20 uppercase italic">{energy}</div>}
    </div>
  );

  const DeviceGroup = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-black/20 backdrop-blur-lg p-4 rounded-[2.5rem] border-2 border-white/5 shadow-2xl">
      <p className="text-[12px] uppercase font-black tracking-[0.3em] text-cyan-400 ml-4 mb-4 italic drop-shadow-lg">{title}</p>
      <div className="grid grid-cols-2 gap-4">{children}</div>
    </div>
  );

  return (
    <div className="w-full pb-12">
      {/* SECTION HEADER - ENHANCED SIZE */}
      {/* <div className="flex justify-between items-center mb-10 px-2">
        <div className="flex flex-col">
          <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase drop-shadow-2xl">Living Room</h2>
          <span className="text-xs font-black tracking-[0.5em] text-cyan-500/40 uppercase -mt-1">Zone Control • 01</span>
        </div>
        <div className="h-[2px] flex-1 mx-10 bg-gradient-to-r from-cyan-500/50 via-white/10 to-transparent" />
      </div> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <SpeedCard />

        <DeviceGroup title="Garden Lighting">
          <DeviceCard title="Hall" icon="💡" status={garden1.status} setStatus={(val: boolean) => setGarden1({ status: val })} />
          <DeviceCard title="Garage" icon="💡" status={garden2.status} setStatus={(val: boolean) => setGarden2({ status: val })} />
        </DeviceGroup>

        <DeviceGroup title="Garage Area">
          <DeviceCard title="Light 1" icon="💡" status={garage1.status} setStatus={(val: boolean) => setGarage1({ status: val })} />
          <DeviceCard title="Light 2" icon="💡" status={garage2.status} setStatus={(val: boolean) => setGarage2({ status: val })} />
        </DeviceGroup>

        {/* HIGH-VIS INDIVIDUAL CARDS */}
        <DeviceCard title="Robo Vacuum" icon="🧹" status={roboVac.status} setStatus={(val: boolean) => setRoboVac({ status: val })} energy="1.2KW" />
        <DeviceCard title="Camera" icon="📹" status={camera.status} setStatus={(val: boolean) => setCamera({ status: val })} />
        <DeviceCard title="Garage Door" icon="🚗" status={garageDoor.status} setStatus={(val: boolean) => setGarageDoor({ status: val })} />
        <DeviceCard title="Puja Light" icon="🪔" status={pujaLight.status} setStatus={(val: boolean) => setPujaLight({ status: val })} />
        <DeviceCard title="Fountain" icon="💦" status={fountain.status} setStatus={(val: boolean) => setFountain({ status: val })} energy="2.0KW" />
        <DeviceCard title="Main Door" icon="🚪" status={mainDoor.status} setStatus={(val: boolean) => setMainDoor({ status: val })} />



        {/* TRASH & RECYCLE UNITS */}

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
    </div>
  );
};

export default LivingRoom;