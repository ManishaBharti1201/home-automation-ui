import React from 'react';
import SpeedCard from './SpeedCard';
import SpotifyCard from './SpotifyCard';
import recycle from  '../../../assets/recycle.png'; // Import your CSS file for styling
import trash from '../../../assets/trash.png'; // Import your CSS file for styling


interface LivingRoomProps {
    isDarkMode: boolean;
    devices: any[]; // Define the type for the isDarkMode prop// Define the type for the devices prop
}

const LivingRoom: React.FC<LivingRoomProps> = ({ isDarkMode,devices }) => {
    // State to manage dark mode

    // Monthly energy usage data for the chart


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
                        <input type="checkbox" />
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
                        <input type="checkbox" checked />
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
                        <input type="checkbox" checked />
                        <span className="slider"></span>
                    </label>
                </div>
                {/* <SpotifyCard /> */}
                <div className={`device-card ${isDarkMode ? "dark-mode" : "light-mode"}`}>
                    <div className="device-icon">
                        <img
                            src= {recycle}
                            alt="Spotify Icon"
                            style={{ width: "20px", height: "20px" }}
                        />
                    </div>
                    <div className="device-name">Recycle</div>
                    <div className="device-status">Last Service:</div>
                    <div className="device-power">07/04, 11:30</div>
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
                            src= {trash}
                            alt="Spotify Icon"
                            style={{ width: "20px", height: "20px" }}
                        />
                    </div>
                    <div className="device-name">Trash</div>
                    <div className="device-status">Last Service:</div>
                    <div className="device-power">07/04, 11:30</div>
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
// Custom hook to manage state

