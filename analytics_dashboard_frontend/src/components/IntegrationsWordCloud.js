import React, { useMemo } from "react";
import PropTypes from "prop-types";
import CustomWordCloud from "./WordCloud";

/**
 * PUBLIC_INTERFACE
 * Shows a word cloud visualization of third-party integrations based on appvote data.
 * @param {Array} apps - List of app objects with integration data field.
 */
const IntegrationsWordCloud = ({ apps }) => {
  // Aggregate integration frequencies
  const integrationFrequency = useMemo(() => {
    const freq = {};
    apps.forEach(app => {
      if (app.integrations && Array.isArray(app.integrations)) {
        app.integrations.forEach(intg => {
          const key = intg.trim().toLowerCase();
          freq[key] = (freq[key] || 0) + 1;
        });
      }
    });
    return Object.entries(freq)
      .map(([k, v]) => ({ text: k, value: v }))
      .sort((a, b) => b.value - a.value);
  }, [apps]);

  return (
    <div>
      <h2 style={{marginBottom: 24}}>Key Third-Party Integrations Tried</h2>
      <CustomWordCloud words={integrationFrequency} height={330} width={700} />
    </div>
  );
};
IntegrationsWordCloud.propTypes = { apps: PropTypes.array.isRequired };
export default IntegrationsWordCloud;
