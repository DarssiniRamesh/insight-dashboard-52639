import React from "react";
import PropTypes from "prop-types";

/**
 * PUBLIC_INTERFACE
 * Nicely stacked list of feedbacks, grouped by week, with attributions if present.
 * @param {Array} apps - List of appvote app objects (each with feedbacks array per app)
 */
const Feedbacks = ({ apps }) => {
  // Group feedbacks by week
  const feedbacksByWeek = {};
  apps.forEach(app => {
    const week = app.week || "Unknown";
    if (!feedbacksByWeek[week]) feedbacksByWeek[week] = [];
    if (Array.isArray(app.feedbacks)) {
      app.feedbacks.forEach(fb => feedbacksByWeek[week].push({
        appName: app.name,
        text: fb.text || fb,
        user: fb.author || fb.by || "Anonymous",
        date: fb.date || "",
      }));
    }
  });

  if (Object.keys(feedbacksByWeek).length === 0)
    return <div style={{ color: "#aaa", textAlign: "center", padding: 30 }}>No feedbacks found.</div>;

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Feedbacks</h2>
      {Object.entries(feedbacksByWeek).sort().map(([week, fbs]) => (
        <div key={week} style={{marginBottom: 34}}>
          <div style={{ fontWeight: "bold", color: "#1976d2", fontSize: 18, marginBottom: 8 }}>Week {week}</div>
          <div>
            {
              fbs.length === 0 ?
                <div style={{ color: "#bbb" }}>No feedbacks for this week.</div> :
                <ul style={{margin: 0, paddingLeft: 0}}>
                  {fbs.map((fb, idx) => (
                    <li key={idx} style={{
                      marginBottom: 20, listStyle: "none",
                      background: "#f1fafe",
                      borderRadius: 8,
                      boxShadow: "0 1px 4px #1976d211",
                      padding: "18px 22px",
                      borderLeft: "6px solid #29b6f6"
                    }}>
                      <div style={{ fontSize: 16, color: "#222" }}>{fb.text}</div>
                      <div style={{fontSize: 13, color: "#888", marginTop: 7}}>
                        <span>App: {fb.appName}</span>
                        <span style={{marginLeft: 15}}>By: {fb.user}</span>
                        {fb.date && <span style={{marginLeft: 15}}>{fb.date}</span>}
                      </div>
                    </li>
                  ))}
                </ul>
            }
          </div>
        </div>
      ))}
    </div>
  );
};
Feedbacks.propTypes = { apps: PropTypes.array.isRequired };
export default Feedbacks;
