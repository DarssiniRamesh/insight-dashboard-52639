import React from "react";

/**
 * PUBLIC_INTERFACE
 * Shows a bullet list of unique features. Never crashes due to absent arrays.
 * @param {Object} props
 * @param {Array} props.features
 */
const UniqueFeatures = ({ features }) => {
  const safeFeatures = Array.isArray(features) ? features : [];

  // Count occurrences
  const featureCounts = {};
  safeFeatures.forEach((feat) => {
    if (feat) {
      featureCounts[feat] = (featureCounts[feat] || 0) + 1;
    }
  });

  // Only show features that occurred once
  const uniqueFeatures = Object.entries(featureCounts)
    .filter(([_, count]) => count === 1)
    .map(([text]) => text);

  const isEmpty = uniqueFeatures.length === 0;

  return (
    <div>
      <h3>Unique Features</h3>
      {isEmpty ? (
        <div style={{ textAlign: "center", color: "#888", margin: "32px" }}>
          No data available
        </div>
      ) : (
        <ul>
          {uniqueFeatures.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UniqueFeatures;
