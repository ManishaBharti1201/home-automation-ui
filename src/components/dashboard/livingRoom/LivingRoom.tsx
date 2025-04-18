import React, { useEffect, useState } from "react";
import SpeedCard from "./SpeedCard";
import SpotifyCard from "./SpotifyCard";
import recycle from "../../../assets/recycle.png";
import trash from "../../../assets/trash.png";

interface LivingRoomProps {
  isDarkMode: boolean;
  event: any; // Change the type to `any` or a specific type if you know the structure
}

const LivingRoom: React.FC<LivingRoomProps> = ({ isDarkMode, event }) => {
  // State to manage the toggle switches
  const [switchStates, setSwitchStates] = useState({
    garden: false,
    fountain: true,
    garageLights: true,
  });

  useEffect(() => {
    if (event) {
      try {
        const parsedEvent = JSON.parse(event); // Parse the event data
        console.log("Updating aquarium events:", parsedEvent);

        // Update the state based on the event data
        setSwitchStates((prevState) => ({
          ...prevState,
          fountain: parsedEvent.text ?? true,
          garden: parsedEvent.text ?? true,
          garageLights: parsedEvent.text ?? true,

        }));
      } catch (error) {
        console.error("Error parsing event data:", error);
      }
    }
  }, [event]); // Re-run the effect whenever the `event` prop changes

  const handleToggle = (device: keyof typeof switchStates) => {
    setSwitchStates((prevState) => ({
      ...prevState,
      [device]: !prevState[device],
    }));
  };

  return (
    <div>
      <div
        className="dashboard-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "20px 0",
        }}
      >
        <h2>Living Room</h2>
        <button className="add-device-button">+ Add Device</button>
      </div>

      <div className="devices-grid">
        <SpeedCard />

        <div className={`device-card ${isDarkMode ? "dark-mode" : "light-mode"}`}>
          <div className="device-icon">💡</div>
          <div className="device-name">Garden</div>
          <div className="device-status">Active for 3 hours</div>
          <div className="device-power">5Kwh</div>
          <label
            className="toggle-switch"
            style={{ position: "absolute", top: "15px", right: "15px" }}
          >
            <input
              type="checkbox"
              checked={switchStates.garden}
              onChange={() => handleToggle("garden")}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className={`device-card ${isDarkMode ? "dark-mode" : "light-mode"}`}>
          <div className="device-icon">💦</div>
          <div className="device-name">Fountain</div>
          <div className="device-status">Active for 5 hours</div>
          <div className="device-power">5Kwh</div>
          <label
            className="toggle-switch"
            style={{ position: "absolute", top: "15px", right: "15px" }}
          >
            <input
              type="checkbox"
              checked={switchStates.fountain}
              onChange={() => handleToggle("fountain")}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className={`device-card ${isDarkMode ? "dark-mode" : "light-mode"}`}>
          <div className="device-icon">🔥</div>
          <div className="device-name">Garage Lights</div>
          <div className="device-status">Active for 3 hours</div>
          <div className="device-power">5Kwh</div>
          <label
            className="toggle-switch"
            style={{ position: "absolute", top: "15px", right: "15px" }}
          >
            <input
              type="checkbox"
              checked={switchStates.garageLights}
              onChange={() => handleToggle("garageLights")}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className={`device-card ${isDarkMode ? "dark-mode" : "light-mode"}`}>
          <div className="device-icon">
            <img
              src={recycle}
              alt="Spotify Icon"
              style={{ width: "20px", height: "20px" }}
            />
          </div>
          <div className="device-name">Recycle</div>
          <div className="device-power">Last Picked Up at: 07/04, 11:30</div>
          <label
            className="toggle-switch"
            style={{ position: "absolute", top: "15px", right: "15px" }}
          >
            04/12 11:40pm
          </label>
        </div>
        <div className={`device-card ${isDarkMode ? "dark-mode" : "light-mode"}`}>
          <div className="device-icon">
            <img
              src={trash}
              alt="Spotify Icon"
              style={{ width: "20px", height: "20px" }}
            />
          </div>
          <div className="device-name">Trash</div>
          <div className="device-power">Last Picked Up at: 07/04, 11:30</div>
          <label
            className="toggle-switch"
            style={{ position: "absolute", top: "15px", right: "15px" }}
          >
            04/12 11:40pm
          </label>
        </div>
      </div>
    </div>
  );
};

export default LivingRoom;