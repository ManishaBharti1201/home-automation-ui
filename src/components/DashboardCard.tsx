import React from 'react';
import './dashboard.css';

interface DashboardCardProps {
  title: string;
  content: string;
  icon?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, content, icon }) => {
  return (
    <div className="dashboard-card">
      {icon && <div className="card-icon">{icon}</div>}
      <h3 className="card-title">{title}</h3>
      <p className="card-content">{content}</p>
    </div>
  );
};

export default DashboardCard;