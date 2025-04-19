import React, { useEffect, useState } from "react";
import SpeedCard from "./SpeedCard";
import Trash from "./Trash";
import Recycle from "./Recycle";
import axios from "axios";

interface LivingRoomProps {
  isDarkMode: boolean;
  device: any;
}

const LivingRoom: React.FC<LivingRoomProps> = ({ isDarkMode, device }) => {
  const [gardenDevice, setGardenDevice] = useState<any>(null);
  const [fountainDevice, setFountainDevice] = useState<any>(null);
  const [garageDevice, setGarageDevice] = useState<any>(null);
  const [trashRecycleData, setTrashRecycleData] = useState({
    trash: {
      pickUpDate: "",
      lastPickUp: "",
      lastStatus: false,
    },
    recycle: {
      pickUpDate: "",
      lastPickUp: "",
      lastStatus: false,
    },
  });

  // Function to check if today is Friday
  const isFriday = () => {
    const today = new Date();
    return today.getDay() === 5; // 5 represents Friday
  };

  // Function to fetch TrashRecycle data
  const fetchTrashRecycleData = async () => {
    try {
      const response = await axios.get<{ trash: any; recycle: string }>("/api/trash-recycle"); // Replace with your actual API endpoint
      setTrashRecycleData({
        trash: {
          pickUpDate: response.data.trash.pickUpDate || "",
          lastPickUp: response.data.trash.lastPickUp || "",
          lastStatus: response.data.trash.lastStatus || false,
        },
        recycle: {
          pickUpDate: response.data.trash.pickUpDate || "",
          lastPickUp: response.data.trash.lastPickUp || "",
          lastStatus: response.data.trash.lastStatus || false,
        },
      });
    } catch (error) {
      console.error("Error fetching TrashRecycle data:", error);
    }
  };

  useEffect(() => {
    // Check if today is Friday and fetch data
    if (isFriday()) {
      fetchTrashRecycleData();
    }

    // Set up an interval to check every day at midnight
    const interval = setInterval(() => {
      if (isFriday()) {
        fetchTrashRecycleData();
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
    }
  }, [device]);

  return (
    <div>
      <div className="dashboard-header">
        <h2>Living Room</h2>
        <button className="add-device-button">+ Add Device</button>
      </div>

      <div className="devices-grid">
        <SpeedCard />

        {/* Garden Device */}
        <div className={`device-card ${isDarkMode ? "dark-mode" : "light-mode"}`}>
          <div className="device-icon">💡</div>
          <div className="device-name">Garden</div>
          <div className="device-status">Active for 3 hours</div>
          <div className="device-power">5Kwh</div>
          <label
            className="toggle-switch"
            style={{ position: "absolute", top: "15px", right: "15px" }}
          >
            <input type="checkbox" checked={gardenDevice?.status} />
            <span className="slider"></span>
          </label>
        </div>

        {/* Fountain Device */}
        <div className={`device-card ${isDarkMode ? "dark-mode" : "light-mode"}`}>
          <div className="device-icon">💦</div>
          <div className="device-name">Fountain</div>
          <div className="device-status">Active for 5 hours</div>
          <div className="device-power">5Kwh</div>
          <label
            className="toggle-switch"
            style={{ position: "absolute", top: "15px", right: "15px" }}
          >
            <input type="checkbox" checked={fountainDevice?.status} />
            <span className="slider"></span>
          </label>
        </div>

        {/* Container for Garage Lights */}
        <div
          className={`device-card-container ${isDarkMode ? "dark-mode" : "light-mode"}`}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          {/* Garage Light 1 */}
          <div className="device-card">
            <div className="device-icon">💡</div>
            <div className="device-name">Garage Light 1</div>
            <div className="device-status">Active for 3 hours</div>
            <label
              className="toggle-switch"
              style={{ position: "absolute", top: "15px", right: "15px" }}
            >
              <input type="checkbox" checked={garageDevice?.status} />
              <span className="slider"></span>
            </label>
          </div>

          {/* Garage Light 2 */}
          <div className="device-card">
            <div className="device-icon">💡</div>
            <div className="device-name">Garage Light 2</div>
            <div className="device-status">Active for 3 hours</div>
            <label
              className="toggle-switch"
              style={{ position: "absolute", top: "15px", right: "15px" }}
            >
              <input type="checkbox" checked={false} />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        {/* Trash Component */}
        <Trash data={trashRecycleData.trash} />

        {/* Recycle Component */}
        <Recycle data={ trashRecycleData.recycle } />
      </div>
    </div>
  );
};

export default LivingRoom;