//
// Analytics data aggregation utility methods for the dashboard.
//

import { parseISO, format, isSameWeek, isValid } from "date-fns";

/**
 * Summarizes key dashboard outcomes: total submissions, votes, feedbacks, top apps.
 * @param {Array} data 
 * @returns {Object}
 */
// PUBLIC_INTERFACE
export function getSummary(data) {
  let totalSubmissions = data.length;
  let totalVotes = 0;
  let feedbacks = 0;
  let appVoteMap = {};
  let appRatings = {};

  data.forEach(entry => {
    // Each entry: { app, votes, date, feedback, rating, ... }
    if (entry.votes) totalVotes += entry.votes;
    if (entry.feedback && entry.feedback.trim().length > 0) feedbacks++;
    if (entry.app) {
      appVoteMap[entry.app] = (appVoteMap[entry.app] || 0) + (entry.votes || 0);
      if (entry.rating) {
        if (!appRatings[entry.app]) appRatings[entry.app] = [];
        appRatings[entry.app].push(entry.rating);
      }
    }
  });

  // Top apps by votes
  let topApps = Object.entries(appVoteMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([app, votes]) => ({ app, votes }));

  // Also allow getting top by average rating when called
  return { totalSubmissions, totalVotes, feedbacks, topApps, appRatings };
}

/**
 * Aggregates data week-wise for submissions or votes.
 * @param {Array} data 
 * @param {"votes"|"submissions"} type 
 * @returns {Array<{ week: string, total: number }>}
 */
/**
 * Aggregates data week-wise for submissions or votes, robust to null/invalid dates.
 * @param {Array} data 
 * @param {"votes"|"submissions"} type 
 * @returns {Array<{ week: string, total: number }>}
 */
// PUBLIC_INTERFACE
export function getWeekwiseData(data, type) {
  // Group by ISO week
  let weeks = {};

  data.forEach(entry => {
    if (!entry.date) return; // skip missing date field
    let date = parseISO(entry.date);
    if (!(date instanceof Date) || !isValid(date)) {
      // Optionally log error for developer insight
      if (process && process.env && process.env.NODE_ENV === 'development') {
        // This silent fallback is for browser-side. Remove process.env in React for prod builds
        // console.warn('Skipping entry with invalid date:', entry);
      }
      return; // skip invalid dates
    }
    // Week key: `${year}-W${weekNo}`
    let weekKey;
    try {
      weekKey = format(date, "yyyy-'W'II");
    } catch (error) {
      // format can still throw if date is not parsable. Skip this entry as safeguard.
      // Optionally log error for debugging.
      return;
    }
    if (!weeks[weekKey]) weeks[weekKey] = { week: weekKey, submissions: 0, votes: 0 };
    weeks[weekKey].submissions++;
    weeks[weekKey].votes += entry.votes || 0;
  });

  // Sort weeks ascending
  let arr = Object.values(weeks).sort((a, b) => (a.week < b.week ? -1 : 1));
  if (type === "votes") return arr.map(x => ({ week: x.week, total: x.votes }));
  return arr.map(x => ({ week: x.week, total: x.submissions }));
}

/**
 * Returns filtered data based on search and filter options.
 * @param {Array} data 
 * @param {Object} filters 
 * @returns {Array}
 */
// PUBLIC_INTERFACE
export function applyFilters(data, filters) {
  const { searchTerm, appFilter, ratingMin } = filters || {};
  return data.filter(entry => {
    let match = true;
    if (searchTerm && searchTerm.length > 0) {
      const term = searchTerm.toLowerCase();
      if (!(
        (entry.feedback && entry.feedback.toLowerCase().includes(term)) ||
        (entry.app && entry.app.toLowerCase().includes(term))
      )) {
        match = false;
      }
    }
    if (appFilter && appFilter.length > 0) {
      match = match && entry.app && entry.app === appFilter;
    }
    if (ratingMin != null) {
      match = match && entry.rating && entry.rating >= ratingMin;
    }
    return match;
  });
}

/**
 * Gets top apps sorted by votes or average rating.
 * @param {Array} data 
 * @param {"votes"|"rating"} by 
 * @returns {Array<{ app, votes, avgRating }>}
 */
// PUBLIC_INTERFACE
export function getTopApps(data, by="votes") {
  let appMap = {};
  data.forEach(entry => {
    if (!entry.app) return;
    if (!appMap[entry.app]) appMap[entry.app] = { votes: 0, ratings: [] };
    appMap[entry.app].votes += entry.votes || 0;
    if (entry.rating) appMap[entry.app].ratings.push(entry.rating);
  });

  let result = Object.entries(appMap).map(([app, rec]) => ({
    app,
    votes: rec.votes,
    avgRating: rec.ratings.length
      ? rec.ratings.reduce((a, b) => a + b, 0) / rec.ratings.length
      : 0
  }));

  if (by === "rating")
    result.sort((a, b) => b.avgRating - a.avgRating);
  else
    result.sort((a, b) => b.votes - a.votes);

  return result;
}
