import React from "react";
import WordCloud from "./WordCloud";
import { extractIntegrationsFromApps } from "../utils";

/**
 * PUBLIC_INTERFACE
 * Renders a word cloud of integrations used by apps.
 * Never crashes—shows a friendly fallback if no data.
 * @param {Object} props
 * @param {Array} props.apps
 */
const IntegrationsWordCloud = ({ apps }) => {
  const safeApps = Array.isArray(apps) ? apps : [];
  const integrations = extractIntegrationsFromApps(safeApps);
  const safeIntegrations = Array.isArray(integrations) ? integrations : [];

  // Count occurrences of each integration
  const integrationCounts = {};
  safeIntegrations.forEach((integration) => {
    if (integration) {
      integrationCounts[integration] = (integrationCounts[integration] || 0) + 1;
    }
  });

  // Prepare word cloud data
  const wordCloudData = Object.entries(integrationCounts).map(([text, value]) => ({
    text,
    value,
  }));

  const isEmpty = wordCloudData.length === 0;

  return (
    <div>
      <h3>Most Common Integrations</h3>
      {isEmpty ? (
        <div style={{ textAlign: "center", color: "#888", margin: "32px" }}>
          No data available
        </div>
      ) : (
        <WordCloud words={wordCloudData} />
      )}
    </div>
  );
};

export default IntegrationsWordCloud;
