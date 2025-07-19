import React, { useMemo } from "react";
import PropTypes from "prop-types";
/**
 * PUBLIC_INTERFACE
 * Displays the top 10 apps by total votes across all weeks, as an attractive list with images and app links.
 * @param {Array} apps - List of all app objects.
 */
const TopApps = ({ apps }) => {
  // Aggregate votes for apps across all weeks
  const byAppName = useMemo(() => {
    const stats = {};
    apps.forEach(app => {
      if (!app.name) return;
      if (!stats[app.name]) {
        stats[app.name] = {
          name: app.name,
          img: app.image || "",
          url: app.url || "",
          totalVotes: 0
        };
      }
      stats[app.name].totalVotes += app.votes || 0;
      if (app.image && !stats[app.name].img) stats[app.name].img = app.image;
      if (app.url && !stats[app.name].url) stats[app.name].url = app.url;
    });
    // Transform to array and sort
    return Object.values(stats)
      .sort((a, b) => b.totalVotes - a.totalVotes)
      .slice(0, 10);
  }, [apps]);

  if (!byAppName.length)
    return <div style={{ color: "#aaa", textAlign: "center", padding: 24 }}>No top apps data found.</div>;

  return (
    <div>
      <h2 style={{marginBottom: 16}}>Top 10 Apps (by Votes, All Weeks)</h2>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 24, marginTop: 16,
      }}>
        {byAppName.map(app => (
          <div key={app.name}
            style={{
              background: "#fff", borderRadius: 14, boxShadow: "0 4px 16px #29b6f666", 
              padding: "18px", display: "flex", flexDirection: "column", alignItems: "center"
            }}>
            <img
              src={app.img || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.name)}`}
              alt={app.name}
              style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", marginBottom: 10, border: "2px solid #1976d2" }}
            />
            <a href={app.url || "#"} target="_blank" rel="noopener noreferrer"
              style={{ fontWeight: 700, fontSize: 18, color: "#1976d2", textDecoration: "none" }}>
              {app.name}
            </a>
            <div style={{ fontSize: 17, color: "#3949ab", marginTop: 8 }}>{app.totalVotes} votes</div>
          </div>
        ))}
      </div>
    </div>
  );
};
TopApps.propTypes = { apps: PropTypes.array.isRequired };
export default TopApps;
