import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import "./index.css";
import Dashboard from "./components/Dashboard";
import Feedbacks from "./components/Feedbacks";
import { colors } from "./theme";

function Sidebar() {
  return (
    <aside className="sidebar fade-in">
      <div className="sidebar-header">Analytics</div>
      <nav>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}><span className="label">Dashboard</span></NavLink>
        <NavLink to="/feedbacks" className={({ isActive }) => isActive ? "active" : ""}><span className="label">Feedbacks</span></NavLink>
      </nav>
    </aside>
  );
}

function TopNav() {
  return (
    <div className="topnav">
      <span className="nav-title">App Voting Dashboard</span>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  return (
    <Router>
      <Sidebar />
      <TopNav />
      <main className="main-content fade-in">
        <Suspense fallback={<div>Loading ...</div>}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/feedbacks" element={<Feedbacks />} />
          </Routes>
        </Suspense>
      </main>
    </Router>
  );
}

export default App;
