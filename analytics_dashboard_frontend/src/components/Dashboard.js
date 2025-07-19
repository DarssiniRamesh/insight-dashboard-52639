import React from "react";
import TopApps from "./TopApps";

/**
 * Dashboard page to show just Top Apps leaderboard according to new requirements.
 * @param {Array} apps - List of all app objects.
 */
const Dashboard = ({ apps = [] }) => {
  return (
    <div className="dashboard-root" style={{padding: "32px 16px"}}>
      <h1 style={{color: "#1976d2", borderBottom: "2px solid #29b6f6", paddingBottom: 12, marginBottom: 32}}>Analytics Dashboard</h1>
      <TopApps apps={apps} />
    </div>
  );
};

export default Dashboard;
