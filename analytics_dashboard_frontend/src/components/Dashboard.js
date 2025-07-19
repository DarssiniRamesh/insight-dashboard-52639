import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from "recharts";
import { colors, chartColors } from "../theme";
import dataRaw from "../appvote.json";

// PUBLIC_INTERFACE
function SummaryCard({ title, value, footer, icon }) {
  return (
    <section className="card fade-in">
      <div className="card-title">{icon}&nbsp;{title}</div>
      <div className="card-value">{value}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </section>
  );
}

// Return unique app names
function getAppNames(data) {
  return Array.from(new Set(data.map(entry => entry.app_name))).filter(Boolean);
}

function FiltersBar({ filters, setFilters, appNames }) {
  return (
    <div className="filters-bar">
      <input
        type="text"
        placeholder="Search app name or developer..."
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
    </div>
  );
}

// Return image and link from JSON entry, fallback if missing
function getAppDetailsMap(appsData) {
  const map = {};
  for (const app of appsData) {
    map[app.app_name] = {
      img: app.image_url ?? "https://img.icons8.com/color/96/000000/application-window.png",
      link: app.app_link ?? null,
    };
  }
  return map;
}

function TopApps({ data, appDetailsMap }) {
  const highlight = { boxShadow: "0 0 0 4px #29d6f688" };
  if (!data.length) {
    return (
      <section className="top-apps-grid empty-state gentle-empty">
        <div>No voted apps yet.</div>
      </section>
    );
  }
  return (
    <div style={{ marginBottom: 5 }}>
      <div style={{ fontSize: "1.19rem", fontWeight: 600, color: colors.accentHighlight, marginBottom: 12 }}>
        Top Apps (by votes)
      </div>
      <section className="top-apps-grid">
        {data.map((app, idx) => (
          <div className="top-app-card fade-in" style={idx === 0 ? highlight : {}} key={app.app_id}>
            <img
              className="app-thumb"
              src={appDetailsMap?.[app.app_name]?.img}
              alt="app"
            />
            <div className="app-name">{app.app_name}</div>
            <div className="stat">{app.vote_count || 0} votes</div>
            <div className="stat">
              by {app.username || "Unknown"}
            </div>
            {appDetailsMap?.[app.app_name]?.link && (
              <a href={appDetailsMap[app.app_name].link} target="_blank" rel="noopener noreferrer">Open App</a>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

// Chart styling helpers
const chartPalette = chartColors;
const chartCardStyle = { marginBottom: "2.4rem" };

// Helpers for week/contest grouping
function getWeekSummary(data, countKey) {
  // Returns [{week: 'Week 1', total: xx}, ...] for countKey in each contest week
  const weekMap = {};
  for (const entry of data) {
    const w = entry.contest_week_name || "Unknown";
    if (!weekMap[w]) weekMap[w] = 0;
    weekMap[w] += countKey === "votes" ? (entry.vote_count || 0) : 1;
  }
  return Object.entries(weekMap).map(([week, total]) => ({ week, total }));
}

// PUBLIC_INTERFACE
/**
 * Dashboard page displaying summary cards, charts, top apps, etc.
 */
export default function Dashboard() {
  const [filters, setFilters] = useState({ searchTerm: "", appFilter: "" });
  const [data, setData] = useState(dataRaw || []);
  // Filtering
  const filtered = data.filter(app =>
    (!filters.searchTerm || app.app_name?.toLowerCase().includes(filters.searchTerm.toLowerCase()) || app.username?.toLowerCase().includes(filters.searchTerm.toLowerCase())) &&
    (!filters.appFilter || app.app_name === filters.appFilter)
  );

  // Summary stats (real data)
  const totalSubmissions = data.length;
  const totalVotes = data.reduce((sum, a) => sum + (a.vote_count || 0), 0);
  const allApps = getAppNames(data);
  // For tracked apps, all unique app_names
  const trackedApps = allApps.length;

  // Week summaries
  const weekSubs = getWeekSummary(filtered, "submissions");
  const weekVotes = getWeekSummary(filtered, "votes");

  // Top apps (by vote_count)
  const topApps = [...filtered]
    .filter(a => !!a.vote_count)
    .sort((a, b) => b.vote_count - a.vote_count)
    .slice(0, 5);

  // Pie chart: submissions by app_name
  const submitByApp = {};
  filtered.forEach(e => {
    submitByApp[e.app_name] = (submitByApp[e.app_name] || 0) + 1;
  });
  const submitAppArr = Object.entries(submitByApp).map(([app, n], idx) => ({
    app, value: n, fill: chartPalette[idx % chartPalette.length]
  }));

  // App image and link details
  const appDetailsMap = getAppDetailsMap(data);

  return (
    <div>
      <FiltersBar filters={filters} setFilters={setFilters} appNames={allApps} />

      <section className="summary-grid">
        <SummaryCard title="Total Submissions" value={totalSubmissions} footer="Entries" icon="🗳️" />
        <SummaryCard title="Total Votes" value={totalVotes} footer="All apps" icon="👍" />
        <SummaryCard title="Weekwise Submissions" value={weekSubs.length} footer="Weeks" icon="🗓️" />
        <SummaryCard title="Tracked Apps" value={trackedApps} footer="Apps" icon="📱" />
      </section>

      {!weekSubs.length && !weekVotes.length ? (
        <div className="gentle-empty" style={{ margin: 48, textAlign: "center", color: colors.textDim }}>
          No analytics data available. Upload or provide real analytics JSON to view dashboard insights.
        </div>
      ) : (
      <>
      {/* Charts */}
      <div className="chart-container fade-in" style={chartCardStyle}>
        <div style={{ color: colors.accent, fontWeight: 600, marginBottom: 8 }}>
          Submissions Weekwise
        </div>
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
        <div style={{ color: colors.accent, fontWeight: 600, marginBottom: 8 }}>
          Votes Weekwise
        </div>
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
        <div style={{ color: colors.accent, fontWeight: 600, marginBottom: 8 }}>
          Submissions by App
        </div>
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
      </>
      )}

      <TopApps data={topApps} appDetailsMap={appDetailsMap} />
    </div>
  );
}
