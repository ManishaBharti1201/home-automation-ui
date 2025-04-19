import React, { useEffect, useState } from "react";
import recycle from "../../../assets/recycle.png";

interface TrashProps {
    data: {
        pickUpDate: string,
        lastPickUp: string;
        lastStatus: boolean;
    };
}

const Trash: React.FC<TrashProps> = ({ data }) => {
    const [isBlinking, setIsBlinking] = useState(false);

    useEffect(() => {
        if (!data) return;

        const checkRecycleTime = () => {
            const currentTime = new Date();
            const recycleTime = new Date(data.pickUpDate);

            // Check if the current time matches the recycle time (to the minute)
            if (
                currentTime.getFullYear() === recycleTime.getFullYear() &&
                currentTime.getMonth() === recycleTime.getMonth() &&
                currentTime.getDate() === recycleTime.getDate() &&
                currentTime.getHours() === recycleTime.getHours() &&
                currentTime.getMinutes() === recycleTime.getMinutes()
            ) {
                setIsBlinking(true);

                // Stop blinking after 1 minute
                setTimeout(() => {
                    setIsBlinking(false);
                }, 60 * 1000);
            }
        };

        // Check every second
        const interval = setInterval(checkRecycleTime, 1000);

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [data?.pickUpDate]);

    return (
        <div
            className={`device-card ${isBlinking ? "blinking" : ""}`}
            style={{
                animation: isBlinking ? "blink 1s infinite" : "none",
            }}
        >
            <div className="device-icon">
                <img
                    src={recycle}
                    alt="Recycle Icon"
                    style={{ width: "20px", height: "20px" }}
                />
            </div>
            <div className="device-name">Recycle</div>
            <div className="device-status">Last Service:</div>
            <div className="device-power">{data?.lastPickUp || "N/A"}</div>
            <label
                className="toggle-switch"
                style={{ position: "absolute", top: "15px", right: "15px" }}
            >{data?.pickUpDate || "04/12 11:40pm"}            
            </label>
        </div>
    );
};

export default Trash;