import React from "react";
import { colors } from "../theme";
import dataRaw from "../appvote.json";

/**
 * PUBLIC_INTERFACE
 * Feedbacks page showing feedback entries in cards, paginated, filterable
 */
export default function Feedbacks() {
  // Since src/appvote.json does NOT contain feedback or rating fields, we check for them gently:
  const hasFeedback = dataRaw.some(entry => entry.feedback && entry.feedback.trim().length > 0);
  // Modern dashboard: if feedbacks exist, show them; else, show empty state with real-data message.

  if (!hasFeedback) {
    return (
      <div style={{
        margin: "48px auto",
        textAlign: "center",
        color: colors.textDim,
        background: colors.card,
        maxWidth: 480,
        padding: "2rem",
        borderRadius: 16,
        boxShadow: "0 4px 12px #0001"
      }}>
        <div style={{ fontSize: 38, opacity: 0.44 }}>💬</div>
        <div style={{ fontWeight: 600, margin: "14px 0 0" }}>No feedback entries to show</div>
        <div style={{ color: colors.textDim, marginTop: 10, fontSize: "1rem" }}>
          There are currently no feedback comments or ratings in the analytics data.<br />
          When feedback submissions are added to your <b>appvote.json</b>, they will display here automatically.
        </div>
      </div>
    );
  }

  // Optional: Render cards if feedbacks actually exist (backward-compatible, future-proof)
  const feedbacks = dataRaw.filter(
    entry => !!entry.feedback && (entry.feedback.trim().length > 0)
  );

  return (
    <div>
      <div className="feedback-list">
        {feedbacks.map((f, idx) => (
          <section className="feedback-card fade-in" key={idx}>
            <div className="feedback-message">{f.feedback}</div>
            {f.rating && (
              <div className="feedback-rating">
                {"★".repeat(Math.round(f.rating))}{Array(5 - Math.round(f.rating)).fill("☆")}
                <span style={{ marginLeft: 9, color: colors.textDim }}>({f.rating.toFixed(1)} / 5)</span>
              </div>
            )}
            <div className="feedback-app">App: {f.app_name || f.app}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
