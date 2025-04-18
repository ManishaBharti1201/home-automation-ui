import React, { useEffect, useState } from "react";
import food from "../../assets/fish-food.png"; // Import the food button image

interface AquariumProps {
  event: string;
}

const Aquarium: React.FC<AquariumProps> = ({ event }) => {
  const [lastFoodGiven, setLastFoodGiven] = useState<string>("March 02"); // Default last food given date
  const [backgroundColor, setBackgroundColor] = useState<string>("#252525"); // State to track the current background color
  const [switchStates, setSwitchStates] = useState({
    aquaLight: false,
    filter: true,
    pump: true,
    heater: true,
  });

  useEffect(() => {
    if (event) {
      try {
        //const parsedEvent = JSON.parse(event); // Parse the event data
        console.log("Updating aquarium events:", event);

        // Update the state based on the event data
        setSwitchStates((prevState) => ({
          ...prevState,
          // aquaLight: parsedEvent.aquaLight ?? prevState.aquaLight,
          // filter: parsedEvent.filter ?? prevState.filter,
          // pump: parsedEvent.pump ?? prevState.pump,
          // heater: parsedEvent.heater ?? prevState.heater,
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

  const handleFoodGiven = () => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
    });
    setLastFoodGiven(formattedDate); // Update the last food given date
    // Trigger blinking effect
    let isBlue = false;
    const interval = setInterval(() => {
      setBackgroundColor(isBlue ? "#252525" : "#8875FF");
      isBlue = !isBlue;
    }, 500); // Toggle every 500ms

    setTimeout(() => {
      clearInterval(interval); // Stop toggling after 5 seconds
      setBackgroundColor("#252525"); // Reset to default color
    }, 5000);

    // Play voice message
    const utterance = new SpeechSynthesisUtterance("Giving food now");
    speechSynthesis.speak(utterance);
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
        <h2>Aquarium</h2>
        <button className="add-device-button">+ Add Device</button>
      </div>

      <div className="devices-grid">
        <div className="device-card">
          <div className="device-icon">💡</div>
          <div className="device-name">Aqua Light</div>
          <div className="device-status">Active for 3 hours</div>
          <div className="device-power">5Kwh</div>
          <label
            className="toggle-switch"
            style={{ position: "absolute", top: "15px", right: "15px" }}
          >
            <input
              type="checkbox"
              checked={switchStates.aquaLight}
              onChange={() => handleToggle("aquaLight")}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="device-card">
          <div className="device-icon">💦</div>
          <div className="device-name">Filter</div>
          <div className="device-status">Active for 5 hours</div>
          <div className="device-power">5Kwh</div>
          <label
            className="toggle-switch"
            style={{ position: "absolute", top: "15px", right: "15px" }}
          >
            <input
              type="checkbox"
              checked={switchStates.filter}
              onChange={() => handleToggle("filter")}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="device-card">
          <div className="device-icon">🔥</div>
          <div className="device-name">Pump</div>
          <div className="device-status">Active for 3 hours</div>
          <div className="device-power">5Kwh</div>
          <label
            className="toggle-switch"
            style={{ position: "absolute", top: "15px", right: "15px" }}
          >
            <input
              type="checkbox"
              checked={switchStates.pump}
              onChange={() => handleToggle("pump")}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="device-card">
          <div className="device-icon">🔥</div>
          <div className="device-name">Heater</div>
          <div className="device-status">Active for 3 hours</div>
          <div className="device-power">5Kwh</div>
          <label
            className="toggle-switch"
            style={{ position: "absolute", top: "15px", right: "15px" }}
          >
            <input
              type="checkbox"
              checked={switchStates.heater}
              onChange={() => handleToggle("heater")}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div
          className="device-card"
          style={{
            backgroundColor: backgroundColor, // Dynamically set background color
            transition: "background-color 0.5s ease", // Smooth transition for blinking effect
          }}
        >
          <div className="device-icon">🔥</div>
          <div className="device-name">Food</div>
          <div className="device-status">Last Given: {lastFoodGiven}</div>
          <div className="device-power">Tue, Thu and Sat</div>
          <button
            onClick={handleFoodGiven}
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              background: "transparent",
              borderRadius: "30%",
              border: "none",
              cursor: "pointer",
            }}
          >
            <img
              src={food}
              alt="Food"
              style={{ width: "40px", height: "40px" }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Aquarium;