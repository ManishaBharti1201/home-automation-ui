import React, { useState } from "react";
import "../styles/Home.css"; // Adjust the path as needed
import Dashboard from "../components/Dashboard";

const Home: React.FC = () => {


  return (
    <div className="app-container">
      <div className="header">
        <div className="logo">
          <span className="logo-icon">B</span>
          Bhanu
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
          <i className="fas fa-search"></i>
        </div>
        <div className="user-actions">
          <button className="icon-button">?</button>
          <button className="icon-button">🔔</button>
          <div className="user-avatar">B</div>
        </div>
      </div>

      <Dashboard />
      {/* Sidebar */}

      <div className="sidebar">
        <div className="sidebar-item active">
          <span>🏠</span>
          Dashboard
        </div>
        <div className="sidebar-item">
          <span>🕒</span>
          Recent
        </div>
        <div className="sidebar-item">
          <span>🔖</span>
          Bookmark
        </div>
        <div className="sidebar-item">
          <span>⬇️</span>
          Downloaded
        </div>
        <div className="sidebar-item">
          <span>❓</span>
          Support
        </div>
        <div className="sidebar-item">
          <span>⚙️</span>
          Setting
        </div>
      </div>
    </div>
  );
};

export default Home; // Export the component for use in other files
