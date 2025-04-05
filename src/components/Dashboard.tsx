import React from "react";
import { useState } from "react";

const Dashboard: React.FC = () => {
  const [activeRoom, setActiveRoom] = useState("Kitchen Room");
  const [temperature, setTemperature] = useState(24);
  const [deviceStates, setDeviceStates] = useState({
    "Smart TV": false,
    Speaker: false,
    Router: false,
    WiFi: true,
    Heater: false,
    Socket: true,
    "Air Conditioner": false,
  });

  const rooms = [
    "Living Room",
    "Bath Room",
    "Bed Room",
    "Movie Room",
    "Game Room",
  ];

  type DeviceKey = keyof typeof deviceStates;

  // Monthly energy usage data for the chart
  const energyData = [45, 58, 62, 78, 90, 110, 95, 82, 70, 64, 68, 72];
  const maxEnergy = Math.max(...energyData);

  const toggleDevice = (device: keyof typeof deviceStates) => {
    setDeviceStates((prev) => ({
      ...prev,
      [device]: !prev[device],
    }));
  };

  return (
    <div className="main-content">
      <div className="room-tabs">
        <div className="room-tab active">Living Room</div>
        <div className="room-tab">Kitchen Room</div>
        <div className="room-tab">Bed Room</div>
        <div className="room-tab">Movie Room</div>
        <div className="room-tab">Game Room</div>
        <button className="add-device-button">+ Add Room</button>
      </div>
      <div className="sidebar">
        <div className="sidebar-header">Rooms</div>
        {rooms.map((room) => (
          <div
            key={room}
            className={`sidebar-item ${activeRoom === room ? "active" : ""}`}
            onClick={() => setActiveRoom(room)}
          >
            {room}
          </div>
        ))}
      </div>

      <div
        className="dashboard-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "20px 0",
        }}
      >
        <h2>{activeRoom}</h2>
        <button className="add-device-button">+ Add Device</button>
      </div>

      <div className="dashboard-grid">
        <div className="air-conditioner-card">
          <div className="card-header">
            <h3>Air Conditioner</h3>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={deviceStates["Air Conditioner"]}
                onChange={() => toggleDevice("Air Conditioner")}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="temperature">24°C</div>
          <div className="temperature-caption">Temperature</div>

          <input
            type="range"
            min="16"
            max="32"
            value={temperature}
            className="temperature-slider"
            onChange={(e) => setTemperature(Number(e.target.value))}
          />

          <div className="temperature-range">
            <span>32°C</span>
            <span>16°C</span>
          </div>

          <div className="mode-buttons">
            <button className="mode-button active">❄️</button>
            <button className="mode-button">🌀</button>
            <button className="mode-button">💨</button>
            <button className="mode-button">💧</button>
            <button className="mode-button">🌙</button>
          </div>
        </div>

        <div className="usage-card">
          <div className="usage-header">
            <h3>Usage Status</h3>
            <div>
              <button className="icon-button">⚙️</button>
              <button className="icon-button">📊</button>
              <span>Today ▼</span>
            </div>
          </div>

          <div className="usage-stats">
            <div className="usage-stat">
              <div className="usage-value">35.02Kwh</div>
              <div className="usage-label">Total spend</div>
            </div>
            <div className="usage-stat">
              <div className="usage-value">32h</div>
              <div className="usage-label">Total hours</div>
            </div>
          </div>

          <div className="chart-container">
            <div
              className="chart-bar"
              style={{ height: "30%", left: "0%" }}
            ></div>
            <div
              className="chart-bar"
              style={{ height: "40%", left: "7%" }}
            ></div>
            <div
              className="chart-bar"
              style={{ height: "60%", left: "14%" }}
            ></div>
            <div
              className="chart-bar"
              style={{ height: "50%", left: "21%" }}
            ></div>
            <div
              className="chart-bar"
              style={{ height: "45%", left: "28%" }}
            ></div>
            <div
              className="chart-bar active"
              style={{ height: "90%", left: "35%" }}
            >
              <span
                style={{
                  position: "absolute",
                  top: "-20px",
                  left: "-8px",
                  fontSize: "10px",
                  color: "#8875FF",
                }}
              >
                30kw
              </span>
            </div>
            <div
              className="chart-bar"
              style={{ height: "40%", left: "42%" }}
            ></div>
            <div
              className="chart-bar"
              style={{ height: "60%", left: "49%" }}
            ></div>
            <div
              className="chart-bar"
              style={{ height: "50%", left: "56%" }}
            ></div>
            <div
              className="chart-bar"
              style={{ height: "70%", left: "63%" }}
            ></div>
            <div
              className="chart-bar"
              style={{ height: "40%", left: "70%" }}
            ></div>
            <div
              className="chart-bar"
              style={{ height: "50%", left: "77%" }}
            ></div>
            <div
              className="chart-bar"
              style={{ height: "40%", left: "84%" }}
            ></div>
            <div
              className="chart-bar"
              style={{ height: "80%", left: "91%" }}
            ></div>
          </div>

          <div className="chart-labels">
            <span>9:00</span>
            <span>10:00</span>
            <span>11:00</span>
            <span>12:00</span>
            <span>13:00</span>
            <span>14:00</span>
            <span>15:00</span>
            <span>16:00</span>
            <span>17:00</span>
            <span>18:00</span>
          </div>
        </div>
      </div>

      <h3 style={{ margin: "30px 0 20px" }}>My Devices</h3>

      <div className="devices-grid">
        <div className="device-card">
          <div className="device-icon">📺</div>
          <div className="device-name">Smart TV</div>
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
          <div className="device-icon">🔊</div>
          <div className="device-name">Speaker</div>
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
        <h3 style={{ marginBottom: "20px" }}>Light</h3>

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

        <div className="light-item">
          <div className="light-info">
            <div className="light-name">Light 3</div>
            <div className="light-icon">💡</div>
          </div>
          <div className="light-brightness">
            <div className="brightness-dots">
              <div className="dot active"></div>
              <div className="dot active"></div>
              <div className="dot active"></div>
              <div className="dot active"></div>
              <div className="dot active"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
            <div className="brightness-value">45%</div>
          </div>
        </div>

        <div className="light-item">
          <div className="light-info">
            <div className="light-name">Light 4</div>
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
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
            <div className="brightness-value">60%</div>
          </div>
        </div>

        <div className="light-item">
          <div className="light-info">
            <div className="light-name">Light 5</div>
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
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
            <div className="brightness-value">60%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
