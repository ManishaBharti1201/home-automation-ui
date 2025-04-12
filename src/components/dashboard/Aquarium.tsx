import React, { useEffect, useState } from "react";
import food from "../../assets/fish-food.png"; // Import the food button image
import fishFood from "../../assets/fish-food.png"; // Import the fish food image

interface AquariumProps {
    devices: any[];
}

const Aquarium: React.FC<AquariumProps> = ({ devices }) => {
    const [lastFoodGiven, setLastFoodGiven] = useState<string>("March 02"); // Default last food given date
    const [backgroundColor, setBackgroundColor] = useState<string>("#252525"); // State to track the current background color

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
                            <input type="checkbox" />
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
                            <input type="checkbox" checked />
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
                            <input type="checkbox" checked />
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
        </div>
    );
};

export default Aquarium;