import React from "react";

/**
 * PUBLIC_INTERFACE
 * Lists top 10 apps by usage.
 * Always robust to missing/non-array data.
 * @param {Object} props
 * @param {Array} props.apps
 */
const TopApps = ({ apps }) => {
  const safeApps = Array.isArray(apps) ? apps : [];
  // Sort and take top 10 if possible
  const sortedApps = safeApps.length > 0
    ? [...safeApps].sort((a, b) => (b.usage || 0) - (a.usage || 0)).slice(0, 10)
    : [];

  const isEmpty = sortedApps.length === 0;

  return (
    <div>
      <h3>Top 10 Apps</h3>
      {isEmpty ? (
        <div style={{ textAlign: "center", color: "#888", margin: "32px" }}>
          No data available
        </div>
      ) : (
        <ul>
          {sortedApps.map((app, idx) => (
            <li key={app && app.name ? app.name : idx}>
              {app && app.name ? app.name : "Unnamed"} — <b>{app && app.usage ? app.usage : 0}</b>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopApps;
