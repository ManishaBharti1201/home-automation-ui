import React, { useState } from "react";
import "../styles/Home.css"; // Adjust the path as needed
import Dashboard from "./menuItems/Dashboard"; // Adjust the path as needed
import Usage from "./menuItems/Usage"; // Import the Usage component
import Security from "./menuItems/Security"; // Import the Security component
import { useEffect } from "react";
import { Settings } from "lucide-react";
import { fetchWeatherApi } from "openmeteo";
import Weather from "./apis/Weather";

const Home: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState<string>("Dashboard");
  const [currentDateTime, setCurrentDateTime] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false); // State for theme toggle
  const [weather, setWeather] = useState<{ condition: string; temperature: string }>({
    condition: "Loading...",
    temperature: "--°C",
  });


  useEffect(() => {
    // Automatically set theme based on time
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour < 18) {
      setIsDarkMode(false); // Light mode during the day (6 AM to 6 PM)
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

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    console.log(currentHour);
    if (currentHour < 12) {
      return "Good Morning Bhanu";
    } else if (currentHour < 15) {
      return "Good Afternoon Bhanu";
    } else if (currentHour < 20) {
      return "Good Evening Bhanu";
    } else {
      return "Good Night Bhanu";
    }
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "Dashboard":
        return <Dashboard />;
      case "Usage":
        return <Usage />;
      case "Security":
        return <Security />;
      case "Setting":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`app-container ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <div className="header">
        <div className="weather">
          {/* Replace with a valid Weather component or remove */}
          <Weather />

        </div>
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
          <div className="user-avatar">B</div>
        </div>
      </div>

      <div className="main-content">
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
