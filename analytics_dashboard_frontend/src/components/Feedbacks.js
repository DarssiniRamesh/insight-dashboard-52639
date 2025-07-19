import React, { useState } from "react";
import { colors } from "../theme";
import { applyFilters } from "../utils";
import dataRaw from "../appvote.json";

// The Feedback Card
function FeedbackCard({ feedback, rating, app, idx }) {
  // Faint shimmer highlight for cards
  const style = {
    boxShadow: idx % 2 === 0 ? "0 0 0 2.6px #29b6f688" : undefined,
  };
  return (
    <section className="feedback-card fade-in" style={style}>
      <div className="feedback-message">{feedback}</div>
      <div className="feedback-rating">
        {"★".repeat(Math.round(rating))}{Array(5 - Math.round(rating)).fill("☆")}
        <span style={{ marginLeft: 9, color: colors.textDim }}>({rating.toFixed(1)} / 5)</span>
      </div>
      <div className="feedback-app">App: {app}</div>
    </section>
  );
}

// Pagination
function Pagination({ cur, total, onPage }) {
  let pages = [];
  for (let i = 1; i <= total; i++) pages.push(i);
  return (
    <div className="pagination">
      <button className="pagination-btn" disabled={cur === 1} onClick={() => onPage(cur - 1)}>Prev</button>
      {pages.map(n => (
        <button
          key={n}
          className={"pagination-btn" + (n === cur ? " active" : "")}
          onClick={() => onPage(n)}
        >{n}</button>
      ))}
      <button className="pagination-btn" disabled={cur === total} onClick={() => onPage(cur + 1)}>Next</button>
    </div>
  );
}

/** PUBLIC_INTERFACE
 * Feedbacks page showing feedback entries in cards, paginated, filterable
 */
export default function Feedbacks() {
  const [filters, setFilters] = useState({ searchTerm: "", appFilter: "", ratingMin: null });
  const [page, setPage] = useState(1);

  // Only feedback entries with message & rating
  const feedbacks = dataRaw.filter(
    entry => !!entry.feedback && (entry.feedback.trim().length > 0) && entry.rating
  );

  const filtered = applyFilters(feedbacks, filters);

  // Pagination: 8 per page
  const pageSize = 8;
  const totalPages = Math.ceil(filtered.length / pageSize);
  const shown = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Get all unique app names
  const uniqueApps = Array.from(new Set(feedbacks.map(f => f.app))).filter(Boolean);

  return (
    <div>
      {/* Filters */}
      <div className="filters-bar" style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search feedback/app..."
          value={filters.searchTerm || ""}
          onChange={e => { setFilters(f => ({ ...f, searchTerm: e.target.value })); setPage(1); }}
        />
        <select
          value={filters.appFilter || ""}
          onChange={e => { setFilters(f => ({ ...f, appFilter: e.target.value })); setPage(1); }}
        >
          <option value="">All Apps</option>
          {uniqueApps.map(app => <option key={app} value={app}>{app}</option>)}
        </select>
        <select
          value={filters.ratingMin || ""}
          onChange={e => { setFilters(f => ({ ...f, ratingMin: e.target.value ? Number(e.target.value) : null })); setPage(1); }}
        >
          <option value="">All Ratings</option>
          {[5,4,3,2,1].map(star =>
            <option key={star} value={star}>{star}★ & up</option>
          )}
        </select>
      </div>

      {/* Feedback Cards */}
      <section className="feedback-list">
        {shown.map((f, idx) => (
          <FeedbackCard key={idx} feedback={f.feedback} rating={f.rating} app={f.app} idx={idx} />
        ))}
      </section>

      {totalPages > 1 && (
        <Pagination cur={page} total={totalPages} onPage={setPage} />
      )}
    </div>
  );
}
