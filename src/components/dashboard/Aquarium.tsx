import React, { useEffect, useState } from "react";
import food from "../../assets/fish-food.png"; // Import the food button image

interface AquariumProps {
  device: any;
}

const Aquarium: React.FC<AquariumProps> = ({ device }) => {
  const [lastFoodGiven, setLastFoodGiven] = useState<string>("March 02"); // Default last food given date
  const [backgroundColor, setBackgroundColor] = useState<string>("#252525"); // State to track the current background color

  const [gardenDevice, setGardenDevice] = useState<any>(null);
  const [aquaLightDevice, setAquaLightDevice] = useState<any>(null);
  const [fountainDevice, setFountainDevice] = useState<any>(null);
  const [garageDevice, setGarageDevice] = useState<any>(null);
  const [heaterDevice, setHeaterDevice] = useState<any>(null);
  const [filterDevice, setFilterDevice] = useState<any>(null);
  const [pumpDevice, setPumpDevice] = useState<any>(null);

  // Update state based on the device data
  useEffect(() => {
    if (device) {
      if (device.devId === "eb7808944838719ea1yctc") {
        console.log("Event received for Aqua light:", device);
        setAquaLightDevice(device);
      } else if (device.devId === "ebe9d4b02cca4e57ddhwwv") {
        console.log("Event received for Filter:", device);
        setFilterDevice(device);
      } else if (device.devId === "ebf7e89f76b6c51114f2ci") {
        console.log("Event received for Pump:", device);
        setPumpDevice(device);
      } else if (device.devId === "eb4a8281458f2a33f0g2tv") {
        console.log("Event received for Heater:", device);
        setHeaterDevice(device);
      } 
    }
  }, [device]);

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

  useEffect(() => {
    const scheduleFoodGiven = () => {
      const now = new Date();
      const targetTime = new Date();

      // Set target time to 8:30 AM
      targetTime.setHours(8, 30, 0, 0);

      // Find the next Monday, Wednesday, or Friday
      let dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      while (![1, 3, 5].includes(dayOfWeek) || now > targetTime) {
        targetTime.setDate(targetTime.getDate() + 1); // Move to the next day
        dayOfWeek = targetTime.getDay();
      }

      // Calculate the time difference in milliseconds
      const timeUntilTarget = targetTime.getTime() - now.getTime();

      // Schedule the first call to handleFoodGiven
      const timeout = setTimeout(() => {
        handleFoodGiven();

        // After the first call, set an interval to call it weekly on Mon, Wed, and Fri
        setInterval(() => {
          const today = new Date();
          const currentDay = today.getDay();
          const currentTime = today.getHours() * 60 + today.getMinutes();

          // Check if it's 8:30 AM on Mon, Wed, or Fri
          if ([1, 3, 5].includes(currentDay) && currentTime === 8 * 60 + 30) {
            handleFoodGiven();
          }
        }, 24 * 60 * 60 * 1000); // Check daily
      }, timeUntilTarget);

      return () => clearTimeout(timeout); // Cleanup timeout on component unmount
    };

    scheduleFoodGiven();
  }, []);

  return (
    <div>
      <div className="dashboard-header">
        <h2>Aquarium</h2>
        <button className="add-device-button">+ Add Device</button>
      </div>

      <div>
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
              <input type="checkbox" checked={aquaLightDevice?.status}/>
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
              <input type="checkbox" checked ={filterDevice?.status}/>
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
              <input type="checkbox" checked={pumpDevice?.status} />
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
              <input type="checkbox" checked={heaterDevice?.status}  />
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
            <div className="device-power">Last Given: {lastFoodGiven}</div>
            <label
              className="toggle-switch"
              style={{ position: "absolute", top: "15px", right: "15px" }}
            > Tue Thu Sat
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aquarium;
