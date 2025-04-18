import React, { useEffect } from "react";
import { useState } from "react";
import LivingRoom from "../dashboard/livingRoom/LivingRoom";
import Aquarium from "../dashboard/Aquarium";
import Usage from "./Usage";

interface DashboardProps {
  isDarkMode: boolean; // Define the type for the isDarkMode prop
}

const Dashboard: React.FC<DashboardProps> = ({ isDarkMode }) => {
  const [rooms, setRooms] = useState<string[]>([
    "Living Room",
    "Aquarium",
    "Usage"
  ]);
  const [activeRoom, setActiveRoom] = useState(rooms[0]);
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [Event, setEvent] = useState(""); // State for Living Room devices


  useEffect(() => {
    // Connect to the SSE endpoint
    const eventSource = new EventSource("http://localhost:5000/proxy");

    // Listen for messages
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setEvent(data); // Update the state with the received data
      console.log("Parsed data:", data);
    };

    // Handle errors
    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
      eventSource.close();
    };

    // Cleanup on component unmount
    return () => {
      eventSource.close();
    };
  }, []);

  const renderRoomContent = () => {
    switch (activeRoom) {
      case "Living Room":
        return <LivingRoom isDarkMode={isDarkMode} event={Event} />; // Pass the array as expected
      case "Aquarium":
        return <Aquarium event={Event} />;
      case "Usage":
        return <Usage />;
      default:
        return <div>Select a room to view its content.</div>;
    }
  }

  const handleAddRoom = () => {
    if (newRoomName.trim() && !rooms.includes(newRoomName)) {
      setRooms([...rooms, newRoomName]);
      setNewRoomName("");
      setIsAddingRoom(false);
    } else if (rooms.includes(newRoomName)) {
      alert("Room already exists!");
    } else {
      alert("Room name cannot be empty!");
    }
  };

  return (
    <div>
      <div className="room-tabs">
        {rooms.map((room, index) => (
          <div
            key={index}
            className={`room-tab ${activeRoom === room ? "active" : ""}`}
            onClick={() => setActiveRoom(room)}
          >
            {room}
          </div>
        ))}
        {!isAddingRoom ? (
          <button
            className="add-device-button"
            onClick={() => setIsAddingRoom(true)}
          >
            + Add Component
          </button>
        ) : (
          <div className="add-room-form">
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Enter room name"
            />
            <button onClick={handleAddRoom}>Add</button>
            <button onClick={() => setIsAddingRoom(false)}>Cancel</button>
          </div>
        )}
      </div>
      <div className="room-content">{renderRoomContent()}</div>
    </div>
  );
};

export default Dashboard;
