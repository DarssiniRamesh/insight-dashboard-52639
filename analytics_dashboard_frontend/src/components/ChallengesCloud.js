import React from "react";
import WordCloud from "./WordCloud";

/**
 * PUBLIC_INTERFACE
 * Displays a word cloud for reported challenges.
 * Shows graceful fallback if data missing.
 * @param {Object} props
 * @param {Array} props.challenges
 */
const ChallengesCloud = ({ challenges }) => {
  const safeChallenges = Array.isArray(challenges) ? challenges : [];

  // Count occurrences of each challenge
  const challengeCounts = {};
  safeChallenges.forEach((challenge) => {
    if (challenge) {
      challengeCounts[challenge] = (challengeCounts[challenge] || 0) + 1;
    }
  });

  const wordCloudData = Object.entries(challengeCounts).map(([text, value]) => ({
    text,
    value,
  }));

  const isEmpty = wordCloudData.length === 0;

  return (
    <div>
      <h3>Reported Challenges</h3>
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

export default ChallengesCloud;
