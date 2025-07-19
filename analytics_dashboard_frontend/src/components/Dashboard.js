import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from "recharts";
import { colors, chartColors } from "../theme";
import { getSummary, getWeekwiseData, getTopApps, applyFilters } from "../utils";
import dataRaw from "../appvote.json";

function SummaryCard({ title, value, footer, icon }) {
  return (
    <section className="card fade-in">
      <div className="card-title">{icon}&nbsp;{title}</div>
      <div className="card-value">{value}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </section>
  );
}

// Helper: extract unique app names
function getAppNames(data) {
  return Array.from(new Set(data.map(entry => entry.app))).filter(Boolean);
}

function FiltersBar({ filters, setFilters, appNames }) {
  return (
    <div className="filters-bar">
      <input
        type="text"
        placeholder="Search feedback/app..."
        value={filters.searchTerm || ""}
        onChange={e => setFilters(f => ({ ...f, searchTerm: e.target.value }))}
      />
      <select
        value={filters.appFilter || ""}
        onChange={e => setFilters(f => ({ ...f, appFilter: e.target.value }))}
      >
        <option value="">All Apps</option>
        {appNames.map(app => <option key={app} value={app}>{app}</option>)}
      </select>
      <select
        value={filters.ratingMin || ""}
        onChange={e => setFilters(f => ({ ...f, ratingMin: e.target.value ? Number(e.target.value) : null }))}
      >
        <option value="">All Ratings</option>
        {[5,4,3,2,1].map(star =>
          <option key={star} value={star}>{star}★ & up</option>
        )}
      </select>
    </div>
  );
}

function TopApps({ data, appDetailsMap }) {
  const highlight = { boxShadow: "0 0 0 4px #29d6f688" };
  return (
    <div style={{ marginBottom: 5 }}>
      <div style={{ fontSize: "1.19rem", fontWeight: 600, color: colors.accentHighlight, marginBottom: 12 }}>Top Apps</div>
      <section className="top-apps-grid">
        {data.map((app, idx) => (
          <div className="top-app-card fade-in" style={idx === 0 ? highlight : {}} key={app.app}>
            <img
              className="app-thumb"
              src={appDetailsMap?.[app.app]?.img || "https://img.icons8.com/color/96/000000/application-window.png"}
              alt="app"
            />
            <div className="app-name">{app.app}</div>
            <div className="stat">{app.votes} votes</div>
            <div className="stat">{app.avgRating.toFixed(2)}★ avg</div>
            {appDetailsMap?.[app.app]?.link && (
              <a href={appDetailsMap[app.app].link} target="_blank" rel="noopener noreferrer">Open App</a>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

// Chart style helpers
const chartPalette = chartColors;
const chartCardStyle = { marginBottom: "2.4rem" };

// Attempt basic app image/link mapping.
const appImageMap = {
  "AppX": { img: "https://img.icons8.com/color/96/000000/windows-10.png", link: "https://appx.example.com" },
  "AppY": { img: "https://img.icons8.com/color/96/000000/android-os.png", link: "https://appy.example.com" },
  "AppZ": { img: "https://img.icons8.com/fluency/96/000000/apple-app-store.png", link: "https://appz.example.com" },
  // extend as needed
};

/** PUBLIC_INTERFACE
 * Dashboard page displaying summary cards, charts, top apps, etc.
 */
export default function Dashboard() {
  const [filters, setFilters] = useState({ searchTerm: "", appFilter: "", ratingMin: null });
  const [data, setData] = useState(dataRaw);

  // Filtered data according to current filters.
  const filtered = applyFilters(data, filters);

  // All summary stats for _filtered_ data.
  const summary = getSummary(filtered);
  const weekVotes = getWeekwiseData(filtered, "votes");
  const weekSubs = getWeekwiseData(filtered, "submissions");
  const topApps = getTopApps(filtered, "votes").slice(0, 5);
  const appsList = getAppNames(data);

  // Pie chart: submission by app
  let submitByApp = {};
  filtered.forEach(e => { submitByApp[e.app] = (submitByApp[e.app] || 0) + 1; });
  const submitAppArr = Object.entries(submitByApp).map(([app, n], idx) => ({
    app, value: n, fill: chartPalette[idx % chartPalette.length]
  }));

  return (
    <div>
      <FiltersBar filters={filters} setFilters={setFilters} appNames={appsList} />

      <section className="summary-grid">
        <SummaryCard title="Total Submissions" value={summary.totalSubmissions} footer="Entries" icon="🗳️" />
        <SummaryCard title="Total Votes" value={summary.totalVotes} footer="All apps" icon="👍" />
        <SummaryCard title="Weekwise Submissions" value={weekSubs.length} footer="Weeks" icon="🗓️" />
        <SummaryCard title="Feedbacks" value={summary.feedbacks} footer="With comment" icon="💬" />
        <SummaryCard title="Tracked Apps" value={appsList.length} footer="Apps" icon="📱" />
      </section>

      {/* Charts */}
      <div className="chart-container fade-in" style={chartCardStyle}>
        <div style={{ color: colors.accent, fontWeight: 600, marginBottom: 8 }}>Submissions Weekwise</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weekSubs}>
            <XAxis dataKey="week" tick={{ fill: colors.textDim, fontSize: 13 }} />
            <YAxis tick={{ fill: colors.textDim }} />
            <Tooltip contentStyle={{ background: colors.card, border: 0, color: "#fff" }} />
            <Bar dataKey="total" fill={colors.accent} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container fade-in" style={chartCardStyle}>
        <div style={{ color: colors.accent, fontWeight: 600, marginBottom: 8 }}>Votes Weekwise</div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={weekVotes}>
            <XAxis dataKey="week" tick={{ fill: colors.textDim, fontSize: 13 }} />
            <YAxis tick={{ fill: colors.textDim }} />
            <Tooltip contentStyle={{ background: colors.card, border: 0, color: "#fff" }} />
            <Line type="monotone" dataKey="total" stroke={colors.accentHighlight} strokeWidth={3.1} />
            <CartesianGrid strokeDasharray="3 8" stroke="#265d7c33" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container fade-in" style={chartCardStyle}>
        <div style={{ color: colors.accent, fontWeight: 600, marginBottom: 8 }}>Submissions by App</div>
        <ResponsiveContainer width="100%" height={225}>
          <PieChart>
            <Pie
              dataKey="value"
              isAnimationActive={true}
              data={submitAppArr}
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={36}
              label={({ app, value }) => `${app}: ${value}`}
            >
              {submitAppArr.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={entry.fill} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" height={16} wrapperStyle={{ color: colors.textDim }} />
            <Tooltip contentStyle={{ background: colors.card, border: 0, color: "#fff" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <TopApps data={topApps} appDetailsMap={appImageMap} />
    </div>
  );
}
