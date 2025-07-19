import React, { useMemo } from "react";
import PropTypes from "prop-types";
import CustomWordCloud from "./WordCloud";

/**
 * PUBLIC_INTERFACE
 * Renders a sentence/phrase cloud for challenges faced by apps (all apps, all weeks combined).
 * Phrases appearing more often are rendered larger.
 * @param {Array} apps - List of all app objects.
 */
const ChallengesCloud = ({ apps }) => {
  // Flatten and count all challenge phrases across all apps
  const phraseFreq = useMemo(() => {
    const freq = {};
    apps.forEach(app => {
      if (app.challenges && Array.isArray(app.challenges)) {
        app.challenges.forEach(phrase => {
          const norm = phrase.trim();
          freq[norm] = (freq[norm] || 0) + 1;
        });
      }
    });
    return Object.entries(freq)
      .map(([text, value]) => ({ text, value }))
      .sort((a, b) => b.value - a.value);
  }, [apps]);

  return (
    <div>
      <h2 style={{marginBottom: 24}}>Challenges Faced (Sentence Cloud)</h2>
      <CustomWordCloud words={phraseFreq} height={330} width={900} isPhraseCloud />
    </div>
  );
};

ChallengesCloud.propTypes = { apps: PropTypes.array.isRequired };
export default ChallengesCloud;
