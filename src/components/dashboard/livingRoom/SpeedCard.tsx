import React, { useEffect, useState } from "react";
import wifi from "../../../assets/wifi/wifi.png";
import noWifi from "../../../assets/wifi/no-wifi.png";
import { log } from "console";

const SpeedCard = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true); // State to track internet status


  const checkInternetStatus = async () => {
    try {
      // Make a lightweight request to check internet connectivity
      await fetch("https://www.google.com", { method: "HEAD", mode: "no-cors" });
      setIsOnline(true);
    } catch (error) {
      setIsOnline(false);
    }
  };

    useEffect(() => {

        checkInternetStatus();

        const statusInterval = setInterval(checkInternetStatus, 5000); // Check internet status every 5 seconds

        return () => {
            
            clearInterval(statusInterval);
        };
    }, []);

  return (
    <div
      className="device-card"
      style={{
        backgroundColor: isOnline ? "green" : "#C41E3A", // Change background color based on online status
        color: "white", // Ensure text is visible on both red and green backgrounds
      }}
    >
      <div className="device-icon" style={{ borderRadius: "10px" }}>
        <img
          src={isOnline ? wifi : noWifi}
          alt={isOnline ? "WiFi Icon" : "No WiFi Icon"}
          style={{ width: "20px", height: "20px" }}
        />
      </div>
      <div className="device-name">WiFi</div>
      <div>
        {isOnline ? "Internet is Active" : "Internet is Inactive"}
      </div>
      {/* <div className="device-power">
        <p>Download: {speed.download} Mbps</p>
        <p>Upload: {speed.upload} Mbps</p>
      </div> */}
    </div>
  );
};

export default SpeedCard;