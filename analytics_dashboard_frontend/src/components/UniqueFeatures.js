import React, { useMemo } from "react";
import PropTypes from "prop-types";

/**
 * PUBLIC_INTERFACE
 * Lists unique features grouped by week, for the top 20 voted apps per week.
 * @param {Array} apps - List of all app objects.
 */
const UniqueFeatures = ({ apps }) => {
  // Extract week=>apps mapping, sort apps in week by votes desc, take top 20.
  const featuresByWeek = useMemo(() => {
    if (!Array.isArray(apps)) return {};
    // Assume each app has a 'week' key and a 'unique_features' array
    const weekMap = {};
    apps.forEach(app => {
      const wk = app.week || "Unknown";
      if (!weekMap[wk]) weekMap[wk] = [];
      weekMap[wk].push(app);
    });
    // For each week, take top 20 apps by votes
    const res = {};
    Object.entries(weekMap).forEach(([wk, wkApps]) => {
      const sorted = [...wkApps].sort((a, b) => (b.votes || 0) - (a.votes || 0));
      res[wk] = sorted.slice(0, 20).flatMap(app => 
        (app.unique_features || []).map(str => ({
          text: str,
          appName: app.name,
          votes: app.votes || 0,
        }))
      );
    });
    return res;
  }, [apps]);

  if (!featuresByWeek || Object.keys(featuresByWeek).length === 0)
    return <div style={{ color: "#aaa", textAlign: "center", padding: 24 }}>No unique features data found.</div>;

  return (
    <div>
      <h2 style={{marginBottom: 16}}>Unique Features (Top 20 Voted Apps Per Week)</h2>
      {Object.entries(featuresByWeek).map(([week, features]) => (
        <div key={week} style={{
          border: "1px solid #1976d2", borderRadius: 10, margin: "24px 0", background: "#f0f7fa", boxShadow: "0 2px 10px #e3e8ee55"
        }}>
          <div style={{padding: "10px 16px", fontWeight: "bold", color: "#1976d2", fontSize: 20}}>Week {week}</div>
          <ul style={{display: "flex", flexWrap: "wrap", gap: 12, listStyle: "none", margin: 0, padding: "12px 16px"}}>
            {features.length === 0 ?
                <li style={{color: "#bbb"}}>No data for this week.</li>
              :
              features.map((feat, i) => (
                <li key={i} style={{
                  padding: "8px 14px", borderRadius: 20,
                  background: "#fff", boxShadow: "0 2px 6px #b0bec540",
                  fontWeight: 600, color: "#424242", fontSize: 16,
                  border: "2px solid #29b6f6", margin: 0
                }}>
                  <span style={{color: "#1976d2"}}>{feat.text}</span> 
                  <span style={{fontSize: 13, color: "#888", marginLeft: 10}}>
                    ({feat.appName}, {feat.votes} votes)
                  </span>
                </li>
              ))
            }
          </ul>
        </div>
      ))}
    </div>
  );
};
UniqueFeatures.propTypes = { apps: PropTypes.array.isRequired };
export default UniqueFeatures;
