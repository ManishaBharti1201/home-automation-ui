import React, { useState } from "react";
import "../styles/Home.css"; // Adjust the path as needed
import Dashboard from "./menuItems/Dashboard"; // Adjust the path as needed
import Usage from "./menuItems/Usage"; // Import the Usage component
import Security from "./menuItems/Security"; // Import the Security component
import { useEffect } from "react";
import { Settings } from "lucide-react";
import Weather from "./dashboard/Weather"; // Import the Weather component

const Home: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState<string>("Dashboard");
  const [currentDateTime, setCurrentDateTime] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false); // State for theme toggle
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null); // State for battery level
  const [isCharging, setIsCharging] = useState<boolean | null>(null); // State for charging status

  const getBatteryIcon = () => {
    if (batteryLevel === null) return "🔋"; // Default icon if battery status is unavailable
    if (isCharging) return "⚡"; // Charging icon
    if (batteryLevel > 80) return "🔋"; // Full battery
    if (batteryLevel > 50) return "🔋"; // Medium battery
    if (batteryLevel > 20) return "🪫"; // Low battery
    return "🪫"; // Critical battery
  };

  useEffect(() => {
    // Automatically set theme based on time
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour < 18) {
      setIsDarkMode(true); // Light mode during the day (6 AM to 6 PM)
    } else {
      setIsDarkMode(true); // Dark mode during the night (6 PM to 6 AM)
    }
  }, []);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formattedDateTime = now.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
      setCurrentDateTime(formattedDateTime);

    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000); // Update every second
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  useEffect(() => {
    // Fetch battery status using the Battery Status API
    const fetchBatteryStatus = async () => {
      if ("getBattery" in navigator) {
        const battery = await (navigator as any).getBattery();
        setBatteryLevel(Math.round(battery.level * 100)); // Convert battery level to percentage
        setIsCharging(battery.charging);

        // Add event listeners to update battery status dynamically
        battery.addEventListener("levelchange", () =>
          setBatteryLevel(Math.round(battery.level * 100))
        );
        battery.addEventListener("chargingchange", () =>
          setIsCharging(battery.charging)
        );
      }
    };

    fetchBatteryStatus();
  }, []);

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return "Good Morning Bhanu & Family";
    } else if (currentHour < 15) {
      return "Good Afternoon Bhanu & Family";
    } else if (currentHour < 20) {
      return "Good Evening Bhanu & Family";
    } else {
      return "Good Night Bhanu & Family";
    }
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "Dashboard":
        return <Dashboard isDarkMode={isDarkMode} />;
      case "Usage":
        return <Usage />;
      case "Security":
        return <Security />;
      case "Setting":
        return <Settings />;
      default:
        return <Dashboard isDarkMode={isDarkMode} />;
    }
  };

  return (
    <div className={`app-container ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <div className="header">
        {/* Replace with a valid Weather component or remove */}
        <Weather />
        <div className="logo">
          {getGreeting()}
        </div>
        <div className="date-time">
          {currentDateTime}
        </div>
        <div className="user-actions">
          <button
            className="icon-button theme-toggle"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? "🌙" : "🌞"}
          </button>
          <button className="icon-button">🔔</button>
          <div className="user-avatar" style={{ fontSize: "0.8rem", textAlign: "center" }}>
            {getBatteryIcon()} {batteryLevel !== null ? `${batteryLevel}%` : ""}
          </div>
        </div>
      </div>

      <div className={`main-content ${isDarkMode ? "dark-mode" : "light-mode"}`}>
        <div className="sidebar">
          <div
            className={`sidebar-item ${selectedMenu === "Dashboard" ? "active" : ""}`}
            onClick={() => setSelectedMenu("Dashboard")}
          >
            <span>🏠</span>
            Dashboard
          </div>
          <div
            className={`sidebar-item ${selectedMenu === "Usage" ? "active" : ""}`}
            onClick={() => setSelectedMenu("Usage")}
          >
            <span>🕒</span>
            Usage
          </div>
          <div
            className={`sidebar-item ${selectedMenu === "Security" ? "active" : ""}`}
            onClick={() => setSelectedMenu("Security")}
          >
            <span>🔒</span>
            Security
          </div>
          <div
            className={`sidebar-item ${selectedMenu === "Setting" ? "active" : ""}`}
            onClick={() => setSelectedMenu("Setting")}
          >
            <span>⚙️</span>
            Settings
          </div>
        </div>

        <div className="content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Home;

// Removed conflicting local useEffect function
