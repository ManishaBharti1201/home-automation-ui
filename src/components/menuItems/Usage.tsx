import React from 'react';

const Usage: React.FC = () => {
  return (
    <div>
      <h3 style={{ margin: "30px 0 20px" }}>Utility used Over an Year</h3>
      <div
        className="dashboard-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "20px 0",
        }}
      >
      </div>

      <div className="dashboard-grid">
        <div className="usage-card">

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
            <span></span>
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



    </div>
  );
};

export default Usage;