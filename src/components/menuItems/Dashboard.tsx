import React from "react";
import { useState } from "react";
import LivingRoom from "../dashboard/LivingRoom";
import Aquarium from "../dashboard/Aquarium";

const Dashboard: React.FC = () => {
  const [rooms, setRooms] = useState<string[]>([
    "Living Room",
    "Aquarium",
    "Garage",
  ]);
  const [activeRoom, setActiveRoom] = useState(rooms[0]);
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");

  const renderRoomContent = () => {
    switch (activeRoom) {
      case "Living Room":
        return <LivingRoom />;
      case "Aquarium":
        return <Aquarium   />;
      case "Garage":
        return <div>Garage Component Coming Soon!</div>; // Placeholder for Garage
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
          + Add Room
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
