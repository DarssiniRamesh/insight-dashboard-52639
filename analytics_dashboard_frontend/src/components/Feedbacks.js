import React from "react";

/**
 * PUBLIC_INTERFACE
 * Renders up to 5 top feedbacks, robust to missing array.
 * @param {Object} props
 * @param {Array} props.feedbacks
 */
const Feedbacks = ({ feedbacks }) => {
  const safeFeedbacks = Array.isArray(feedbacks) ? feedbacks : [];
  // Show up to 5 latest feedbacks
  const topFeedbacks =
    safeFeedbacks.length > 0
      ? [...safeFeedbacks]
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 5)
      : [];

  const isEmpty = topFeedbacks.length === 0;

  return (
    <div>
      <h3>Top Feedbacks</h3>
      {isEmpty ? (
        <div style={{ textAlign: "center", color: "#888", margin: "32px" }}>
          No data available
        </div>
      ) : (
        <ul>
          {topFeedbacks.map((fb, idx) => (
            <li key={idx}>
              "{fb && fb.message ? fb.message : "No message"}" – Rating: <b>{fb && fb.rating ? fb.rating : "N/A"}</b>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Feedbacks;
