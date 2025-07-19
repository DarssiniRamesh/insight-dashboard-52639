import React, { useState, useEffect } from "react";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Feedbacks from "./components/Feedbacks";
import IntegrationsWordCloud from "./components/IntegrationsWordCloud";
import UniqueFeatures from "./components/UniqueFeatures";
import ChallengesCloud from "./components/ChallengesCloud";

// Injected navigation bar for the new UI
const NAV_LINKS = [
  {key: "dashboard", label: "Top Apps", page: "dashboard"},
  {key: "feedbacks", label: "Feedbacks", page: "feedbacks"},
  {key: "integrations", label: "Integrations Cloud", page: "integrations"},
  {key: "unique", label: "Unique Features", page: "unique"},
  {key: "challenges", label: "Challenges Cloud", page: "challenges"},
];

function App() {
  const [apps, setApps] = useState([]);
  const [page, setPage] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  // Load data from appvote.json
  useEffect(() => {
    fetch("/src/appvote.json")
      .then(resp => resp.json())
      .then(data => {
        setApps(data || []);
      })
      .catch(() => setApps([]))
      .finally(() => setLoading(false));
  }, []);

  const renderPage = () => {
    // Pass loaded apps to each page component
    switch (page) {
      case "feedbacks": return <Feedbacks apps={apps} />;
      case "integrations": return <IntegrationsWordCloud apps={apps} />;
      case "unique": return <UniqueFeatures apps={apps} />;
      case "challenges": return <ChallengesCloud apps={apps} />;
      default: return <Dashboard apps={apps} />;
    }
  };

  return (
    <div className="App">
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "18px 4px",
          background: "#f5faff",
          borderBottom: "2px solid #1976d2",
          marginBottom: 22
        }}
      >
        {NAV_LINKS.map(nav => (
          <button
            key={nav.key}
            style={{
              padding: "10px 28px",
              background: page === nav.page ? "#1976d2" : "#fff",
              color: page === nav.page ? "#fff" : "#1976d2",
              border: "2px solid #1976d2",
              borderRadius: "22px",
              fontWeight: 700,
              margin: "0 8px",
              cursor: "pointer",
              boxShadow: page === nav.page ? "0 2px 12px #1976d230" : "none",
              fontSize: 18,
              outline: "none",
              transition: "all 0.17s"
            }}
            onClick={() => setPage(nav.page)}
            aria-current={page === nav.page ? "page" : undefined}
          >
            {nav.label}
          </button>
        ))}
      </nav>
      <main style={{maxWidth: 1400, margin: "0 auto", minHeight: 530, paddingBottom: 40}}>
        {loading
          ? <div style={{textAlign: "center", color: "#1976d2", fontSize: 22}}>Loading analytics...</div>
          : renderPage()}
      </main>
    </div>
  );
}

export default App;
