import React, { useEffect, useState } from "react";
import recycle from "../../../assets/recycle.png";
import useSound from 'use-sound';
import notify  from "../../../assets/sound/notify.mp3"; // Import the sound file


interface TrashProps {
    data: {
        pickUpDate: string,
        lastPickUp: string;
        lastStatus: boolean;
    };
}

const Trash: React.FC<TrashProps> = ({ data }) => {
    const [isBlinking, setIsBlinking] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState<string>("#252525"); // State to track the current background color
    const [audio] = useState(new Audio(notify));

    useEffect(() => {
        if (!data) return;

        const checkRecycleTime = () => {
            const currentTime = new Date();
            const recycleTime = new Date();


            // Check if the current time matches the recycle time (to the minute)
            if (
                currentTime.getFullYear() === recycleTime.getFullYear() &&
                currentTime.getMonth() === recycleTime.getMonth() &&
                currentTime.getDate() === recycleTime.getDate() &&
                currentTime.getHours() === recycleTime.getHours() &&
                currentTime.getMinutes() === recycleTime.getMinutes()
            ) {
                // audio.play();
                setIsBlinking(true);

                // Stop blinking after 1 minute
                setTimeout(() => {
                    clearInterval(interval); // Stop toggling after 5 seconds
                    setBackgroundColor("#252525"); // Reset to default color
                }, 10000);
            }
        };

        // Check every second
        let isBlue = false;
        const interval = setInterval(() => {
            checkRecycleTime();

            setBackgroundColor(isBlue ? "#252525" : "#8875FF");
            isBlue = !isBlue;
        }, 500); // Toggle every 500ms

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [data?.pickUpDate]);

    return (
        <div
            className="device-card"
            style={{
                backgroundColor: backgroundColor, // Dynamically set background color
                transition: "background-color 0.5s ease", // Smooth transition for blinking effect
            }}
        >
            <div className="device-icon">
                <img
                    src={recycle}
                    alt="Recycle Icon"
                    style={{ width: "20px", height: "20px" }}
                />
            </div>
            <div className="device-name">Trash</div>
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