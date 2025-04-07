import React from 'react';
import { useState } from "react";

const LivingRoom: React.FC = () => {

    const [deviceStates, setDeviceStates] = useState({
        "Smart TV": false,
        Speaker: false,
        Router: false,
        WiFi: true,
        Heater: false,
        Socket: true,
        "Air Conditioner": false,
    });

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
                <div className="device-card">
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

                <div className="device-card">
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

                <div className="device-card">
                    <div className="device-icon">📶</div>
                    <div className="device-name">Router</div>
                    <div className="device-status">Active for 5 hours</div>
                    <div className="device-power">5Kwh</div>
                    <label
                        className="toggle-switch"
                        style={{ position: "absolute", top: "15px", right: "15px" }}
                    >
                        <input type="checkbox" />
                        <span className="slider"></span>
                    </label>
                </div>

                <div className="device-card">
                    <div className="device-icon">📡</div>
                    <div className="device-name">Wifi</div>
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

                <div className="device-card">
                    <div className="device-icon">🔥</div>
                    <div className="device-name">Heater</div>
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

                <div className="device-card">
                    <div className="device-icon">🔌</div>
                    <div className="device-name">Socket</div>
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
            </div>

            <div className="light-controls" style={{ marginTop: "30px" }}>

                <div className="light-item">
                    <div className="light-info">
                        <div className="light-name">Light 1</div>
                        <div className="light-icon">💡</div>
                    </div>
                    <div className="light-brightness">
                        <div className="brightness-dots">
                            <div className="dot active"></div>
                            <div className="dot active"></div>
                            <div className="dot active"></div>
                            <div className="dot active"></div>
                            <div className="dot active"></div>
                            <div className="dot active"></div>
                            <div className="dot active"></div>
                            <div className="dot active"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                        </div>
                        <div className="brightness-value">80%</div>
                    </div>
                </div>

                <div className="light-item">
                    <div className="light-info">
                        <div className="light-name">Light 2</div>
                        <div className="light-icon">💡</div>
                    </div>
                    <div className="light-brightness">
                        <div className="brightness-dots">
                            <div className="dot active"></div>
                            <div className="dot active"></div>
                            <div className="dot active"></div>
                            <div className="dot active"></div>
                            <div className="dot active"></div>
                            <div className="dot active"></div>
                            <div className="dot active"></div>
                            <div className="dot active"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                        </div>
                        <div className="brightness-value">80%</div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LivingRoom;
// Custom hook to manage state

