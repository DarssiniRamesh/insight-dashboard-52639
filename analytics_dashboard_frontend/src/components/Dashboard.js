import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, CssBaseline, useTheme, useMediaQuery, Divider, IconButton, Tooltip, Button, Chip } from '@mui/material';
import { BarChart, PieChart, Equalizer, Dashboard as DashboardIcon, Cloud, Widgets, EmojiEvents, EmojiObjects, Menu as MenuIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import IntegrationsWordCloud from './IntegrationsWordCloud';
import UniqueFeatures from './UniqueFeatures';
import TopApps from './TopApps';
import ChallengesCloud from './ChallengesCloud';

// -- Import local JSON directly
import appvoteData from '../appvote.json';

// ===== Theme and Layout =====
const drawerWidth = 230;
const primaryColor = '#1976d2';
const accentColor = '#29b6f6';
const sidebarBg = '#1976d2';
const sidebarActiveBg = '#1565c0';
const cardBg = '#f5fafd';

// Custom sidebar styling
const Sidebar = styled(Drawer)(({ theme }) => ({
  '.MuiDrawer-paper': {
    background: sidebarBg,
    color: 'white',
    width: drawerWidth,
    border: 'none',
    boxShadow: '2px 0 12px 0 #065c9740',
  },
}));

const MainContent = styled('main')(({ theme }) => ({
  flexGrow: 1,
  background: cardBg,
  minHeight: '100vh',
  padding: theme.spacing(4, 3, 3, 3),
  marginLeft: drawerWidth,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  [theme.breakpoints.down('sm')]: {
    marginLeft: 0,
    padding: theme.spacing(1, 1, 2, 1),
  },
}));

// Card style for highlights
const SummaryCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  background: '#e0f2f1',
  boxShadow: '0 2px 8px 0 #2ec0fb1a',
  borderRadius: 12,
  borderLeft: `5px solid ${accentColor}`,
}));

const cardIcons = {
  "Key Outcomes": <DashboardIcon sx={{ color: primaryColor, fontSize: 32 }} />,
  "Submissions": <BarChart sx={{ color: accentColor, fontSize: 32 }} />,
  "Votes": <Equalizer sx={{ color: accentColor, fontSize: 32 }} />,
};

const navItems = [
  { text: 'Dashboard Overview', icon: <DashboardIcon />, section: 'overview' },
  { text: 'Weekwise Submissions', icon: <BarChart />, section: 'submissions' },
  { text: 'Weekwise Votes', icon: <PieChart />, section: 'votes' },
  { text: 'Integrations Cloud', icon: <Cloud />, section: 'integrations-wordcloud' },
  { text: 'Unique Features', icon: <Widgets />, section: 'unique-features' },
  { text: 'Top 10 Apps', icon: <EmojiEvents />, section: 'top-apps' },
  { text: 'Challenges', icon: <EmojiObjects />, section: 'challenges' },
];

const sectionTitles = {
  overview: "Dashboard Overview",
  submissions: "Submissions Analytics",
  votes: "Votes Analytics",
  "integrations-wordcloud": "Integrations Word Cloud",
  "unique-features": "Unique Features",
  "top-apps": "Top 10 Apps",
  challenges: "Challenges Word Cloud"
};

const getInitialSection = () =>
  window.location.hash ? window.location.hash.replace('#', '') : "overview";

// PUBLIC_INTERFACE
export default function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // UI and Section State
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(getInitialSection());
  useEffect(() => {
    if (window.location.hash)
      setCurrentSection(window.location.hash.replace('#', ''));
    window.onhashchange = () => {
      setCurrentSection(window.location.hash.replace('#', ''));
      setMobileOpen(false);
    };
    // eslint-disable-next-line
  }, []);

  // Data State
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Data extraction logic from appvote.json, with fallback empty data
  useEffect(() => {
    try {
      setParsedData(appvoteData);
      setLoading(false);
    } catch {
      setParsedData({});
      setLoading(false);
    }
  }, []);

  // Sidebar Navigation Handlers
  const handleNavClick = (section) => {
    window.location.hash = section;
    setCurrentSection(section);
    setMobileOpen(false);
  };

  // --- Analytics Extraction ---
  // Key statistics
  let numSubmissions = 0, totalVotes = 0, results = [], weekwiseSubmissions = {}, weekwiseVotes = {};
  let integrationList = [], featuresList = [], challengesList = [], appVotes = {}, appNames = [];
  let keyOutcomes = [];

  // Defensive: cast/validate source (parsedData could be array or object for various formats)
  let entriesRaw = undefined;

  if (Array.isArray(parsedData)) {
    // If parsedData was loaded as an array (e.g., directly from JSON array)
    entriesRaw = parsedData;
  } else if (parsedData && Array.isArray(parsedData.entries)) {
    entriesRaw = parsedData.entries;
  } else if (parsedData && Array.isArray(parsedData.results)) {
    // Defensive fallback for possible 'results'
    entriesRaw = parsedData.results;
  } else if (parsedData && Array.isArray(parsedData.data)) {
    entriesRaw = parsedData.data;
  }

  // Additionally, support the actual appvote.json format -- which appears to be an array of app objects
  if (!entriesRaw && parsedData && Array.isArray(parsedData)) {
    entriesRaw = parsedData;
  }
  // Finally, if user loaded JSON as single-level array
  if (!entriesRaw && Array.isArray(parsedData)) {
    entriesRaw = parsedData;
  }

  // If appvote data looks like an array of objects (real format), use that
  if (!entriesRaw && parsedData && typeof parsedData === 'object' && !parsedData.entries && !parsedData.results && !parsedData.data && Array.isArray(Object.values(parsedData))) {
    // Defensive: if all top-level values are objects with app_name or similar marker use as entries
    const allObjs = Object.values(parsedData);
    if (allObjs.every(x => typeof x === 'object')) {
      entriesRaw = allObjs;
    }
  }

  if (!Array.isArray(entriesRaw)) entriesRaw = [];
  results = entriesRaw;

  numSubmissions = Array.isArray(results) ? results.length : 0;
  totalVotes = Array.isArray(results)
    ? results.reduce((acc, curr) => {
        // Defensive: Support both {votes} and {vote_count}
        const v = curr.votes || curr.vote_count || 0;
        return acc + (parseInt(v, 10) || 0);
      }, 0)
    : 0;

  try {
    keyOutcomes = (parsedData && parsedData.key_outcomes && Array.isArray(parsedData.key_outcomes))
      ? parsedData.key_outcomes
      : [];
  } catch { keyOutcomes = []; }

  // Weekwise analytics (assume week field or submissionDate for grouping)
  if (Array.isArray(results) && results.length > 0) {
    results.forEach(entry => {
      // Try common week/date fields: 'week', 'contest_week_name', or 'submissionDate'
      let wk = entry.week || entry.contest_week_name;
      if (!wk && entry.submissionDate) {
        // Derive week number e.g. 2023-W19
        const dateObj = new Date(entry.submissionDate);
        const getWeekNumber = d => {
          const onejan = new Date(d.getFullYear(),0,1);
          const today = new Date(d.getFullYear(),d.getMonth(),d.getDate());
          const diff = (today - onejan + 86400000)/86400000;
          return Math.ceil(diff/7);
        };
        wk = `${dateObj.getFullYear()}-W${getWeekNumber(dateObj)}`;
      }
      // Defensive: also support 'start_date' or 'app_created_at'
      if (!wk && (entry.start_date || entry.app_created_at)) {
        const dateStr = entry.start_date || entry.app_created_at;
        try {
          const dateObj = new Date(dateStr);
          const getWeekNumber = d => {
            const onejan = new Date(d.getFullYear(),0,1);
            const today = new Date(d.getFullYear(),d.getMonth(),d.getDate());
            const diff = (today - onejan + 86400000)/86400000;
            return Math.ceil(diff/7);
          };
          wk = `${dateObj.getFullYear()}-W${getWeekNumber(dateObj)}`;
        } catch {}
      }
      if (!wk) wk = 'Unknown';

      // Weekwise submissions
      weekwiseSubmissions[wk] = (weekwiseSubmissions[wk] || 0) + 1;

      // Weekwise votes -- look for votes, or vote_count as in appvote.json
      const v = entry.votes || entry.vote_count || 0;
      weekwiseVotes[wk] = (weekwiseVotes[wk] || 0) + (parseInt(v,10) || 0);

      // Integrations, features, challenges extraction -- support several naming conventions
      // 'integrations', 'third_party_integrations'
      let integrations = entry.integrations || entry.third_party_integrations;
      if (integrations && typeof integrations === 'string') {
        // If comma/line separated string, split to array
        integrationList = integrationList.concat(integrations.split(/[,\\n]+/).map(s => s.trim()).filter(Boolean));
      } else if (Array.isArray(integrations)) {
        integrationList = integrationList.concat(integrations);
      }

      // 'uniqueFeatures', 'unique_features', 'feature_list'
      let features = entry.uniqueFeatures || entry.unique_features || entry.feature_list;
      if (features && typeof features === 'string') {
        featuresList = featuresList.concat(features.split(/[,\\n]+/).map(s => s.trim()).filter(Boolean));
      } else if (Array.isArray(features)) {
        featuresList = featuresList.concat(features);
      }

      // 'challenges', 'challenges_faced'
      let challenges = entry.challenges || entry.challenges_faced;
      if (challenges && typeof challenges === 'string') {
        challengesList = challengesList.concat(challenges.split(/[,\\n]+/).map(s => s.trim()).filter(Boolean));
      } else if (Array.isArray(challenges)) {
        challengesList = challengesList.concat(challenges);
      }

      // For Top Apps: Use appName, app_name etc.
      const app = entry.appName || entry.app_name || 'Unnamed App';
      appNames.push(app);
      appVotes[app] = (appVotes[app] || 0) + (parseInt(v,10) || 0);
    });
  }

  // Top 10 Apps (by votes)
  const topApps = Object.entries(appVotes)
    .map(([name, votes]) => ({ name, votes }))
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 10);

  // --- Chart Section Components ---
  // PUBLIC_INTERFACE
  const WeekwiseBarChart = ({ data, label, color }) => {
    // Very simple lightweight chart implementation
    const weeks = Object.keys(data).sort();
    const maxVal = Math.max(...Object.values(data), 1);
    return (
      <Box sx={{ width: "100%", mt: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, color: primaryColor }}>{label}</Typography>
        <Box sx={{ display: "flex", gap: 1, alignItems: 'end', height: 160, alignSelf: 'flex-end'}}>
          {weeks.map(week => (
            <Box key={week} sx={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', width: 30
            }}>
              <Box sx={{
                background: color,
                height: `${Math.round((data[week] / maxVal) * 120)}px`,
                width: "75%",
                borderRadius: 6,
                marginBottom: 0.5,
                minHeight: 8
              }} />
              <Typography sx={{fontSize: '0.72rem', textAlign: "center"}}>{week.replace(/202\d-W/, 'W')}</Typography>
              <Chip size="small" label={data[week]} sx={{mt:0.3, bgcolor:'#e0f7fa'}} />
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  // Pie chart as a donut for total votes distribution
  const VotesPie = ({ submissions, votes }) => {
    if (!submissions || !votes) return null;
    // Arbitrary split: voted vs unvoted submissions
    const voted = votes;
    const unvoted = parseInt(submissions, 10) * 5 - votes; // If 5 votes max per entry
    const cx = 40, cy = 40, r = 36, total = voted + unvoted;
    const angle = (voted / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(0), y1 = cy + r * Math.sin(0);
    const x2 = cx + r * Math.cos(angle), y2 = cy + r * Math.sin(angle);
    const largeArcFlag = voted / total > 0.5 ? 1 : 0;
    // Simple SVG donut chart
    return (
      <Box sx={{ width: 90, height: 90 }}>
        <svg width="90" height="90">
          <circle cx={cx} cy={cy} r={r} fill="#e3f2fd" />
          <path
            d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArcFlag} 1 ${x2},${y2} Z`}
            fill={accentColor}
          />
          <circle cx={cx} cy={cy} r={25} fill={cardBg} />
          <text x={cx} y={cy} textAnchor="middle" dy="0.3em" fontSize="17" fontWeight="bold" fill={primaryColor}>
            {Math.round((voted / total) * 100)}%
          </text>
        </svg>
        <Typography align="center" variant="body2">
          Voted
        </Typography>
      </Box>
    );
  };

  // Render summary cards
  const renderSummaryCards = () => (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12} md={4}>
        <SummaryCard>
          {cardIcons["Key Outcomes"]}
          <Box sx={{ ml: 2 }}>
            <Typography sx={{ color: primaryColor, fontWeight: 600 }}>Key Outcomes</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
              {keyOutcomes && keyOutcomes.length > 0 ?
                keyOutcomes.map((k, idx) => <Chip size="small" key={idx} label={k} sx={{ bgcolor: accentColor, color: "#fff" }} />)
                : <Typography variant="body2">No outcomes</Typography>
              }
            </Box>
          </Box>
        </SummaryCard>
      </Grid>
      <Grid item xs={6} md={4}>
        <SummaryCard>
          {cardIcons["Submissions"]}
          <Box sx={{ ml: 2 }}>
            <Typography sx={{ color: accentColor, fontWeight: 600 }}>Total Submissions</Typography>
            <Typography sx={{ fontWeight: 700, fontSize: 28 }}>
              {numSubmissions}
            </Typography>
          </Box>
        </SummaryCard>
      </Grid>
      <Grid item xs={6} md={4}>
        <SummaryCard>
          {cardIcons["Votes"]}
          <Box sx={{ ml: 2 }}>
            <Typography sx={{ color: accentColor, fontWeight: 600 }}>Total Votes</Typography>
            <Typography sx={{ fontWeight: 700, fontSize: 28 }}>
              {totalVotes}
            </Typography>
          </Box>
        </SummaryCard>
      </Grid>
    </Grid>
  );

  const renderSection = () => {
    // Gentle empty state message for all charts/cards/clouds
    const noData = (!Array.isArray(results) || results.length === 0);

    if (noData) {
      return (
        <Box sx={{ textAlign: 'center', p: 3, color: '#b3b3b3' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            No analytics data available yet.
          </Typography>
          <Typography variant="body2">
            Please upload or provide valid data to see analytics summaries and visualizations.
          </Typography>
        </Box>
      );
    }
    switch (currentSection) {
      case "overview":
        return (
          <Box>
            {renderSummaryCards()}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, bgcolor: '#fafcff', borderRadius: 2 }}>
                  <WeekwiseBarChart data={weekwiseSubmissions} label="Weekwise Submissions" color={primaryColor} />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, bgcolor: '#fafcff', borderRadius: 2 }}>
                  <WeekwiseBarChart data={weekwiseVotes} label="Weekwise Votes" color={accentColor} />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <Paper sx={{ p: 2, bgcolor: '#fafcff', borderRadius: 2, height: '100%' }}>
                  <VotesPie submissions={numSubmissions} votes={totalVotes} />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6} lg={9}>
                <Paper sx={{ p: 2, bgcolor: '#fafcff', borderRadius: 2 }}>
                  <IntegrationsWordCloud data={integrationList} />
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
      case "submissions":
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, color: primaryColor }}>Weekwise Submissions</Typography>
            <Paper sx={{ p: 2, background: cardBg }}>
              <WeekwiseBarChart data={weekwiseSubmissions} label="Weekwise Submissions" color={primaryColor} />
            </Paper>
          </Box>
        );
      case "votes":
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, color: accentColor }}>Weekwise Votes</Typography>
            <Paper sx={{ p: 2, background: cardBg }}>
              <WeekwiseBarChart data={weekwiseVotes} label="Weekwise Votes" color={accentColor} />
            </Paper>
          </Box>
        );
      case "integrations-wordcloud":
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, color: accentColor }}>Integrations Word Cloud</Typography>
            <Paper sx={{ p: 2, background: cardBg }}>
              <IntegrationsWordCloud data={integrationList} />
            </Paper>
          </Box>
        );
      case "unique-features":
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, color: primaryColor }}>Unique Features</Typography>
            <Paper sx={{ p: 2, background: cardBg }}>
              <UniqueFeatures data={featuresList} />
            </Paper>
          </Box>
        );
      case "top-apps":
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, color: accentColor }}>Top 10 Apps</Typography>
            <Paper sx={{ p: 2, background: cardBg }}>
              <TopApps data={topApps} />
            </Paper>
          </Box>
        );
      case "challenges":
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, color: primaryColor }}>Challenges Word Cloud</Typography>
            <Paper sx={{ p: 2, background: cardBg }}>
              <ChallengesCloud data={challengesList} />
            </Paper>
          </Box>
        );
      default:
        return <Typography>Section Not Found</Typography>;
    }
  };

  // Top navigation bar
  const TopBar = (
    <AppBar
      position="fixed"
      elevation={4}
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        background: `linear-gradient(90deg, ${primaryColor} 70%, ${accentColor} 100%)`,
      }}>
      <Toolbar>
        {isMobile &&
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
        }
        <Typography variant="h5" sx={{ fontWeight: 600, letterSpacing: '0.04em', flex: 1 }}>
          Analytics Dashboard
        </Typography>
        <Tooltip title="Download Analytics Data">
          <Button
            variant="outlined"
            size="small"
            color="inherit"
            sx={{
              ml: 2, bgcolor: '#fff3', color: "#fff", borderColor: "#fff6",
              '&:hover': { bgcolor: '#fff4' }
            }}
            href="appvote.json"
            download
          >Export JSON</Button>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );

  // Sidebar Navigation
  const drawerContent = (
    <Box sx={{ height: '100%', bgcolor: sidebarBg }}>
      <Toolbar />
      <Divider sx={{ bgcolor: '#36c6ea44', marginY: 1 }} />
      <List>
        {navItems.map(({ text, icon, section }) => (
          <ListItem
            button
            key={text}
            onClick={() => handleNavClick(section)}
            sx={{
              mb: 0.3,
              borderRadius: 2,
              bgcolor: currentSection === section ? sidebarActiveBg : 'transparent',
              color: 'white',
              '&:hover': { bgcolor: '#1686dc' }
            }}>
            <ListItemIcon sx={{ color: '#fff', minWidth: 38 }}>{icon}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider sx={{ bgcolor: '#bae6fd99', mt: 2, mb: 0.5 }} />
      <Box sx={{ p: 1.6, textAlign: "center" }}>
        <Typography sx={{fontSize: '0.98rem', color: "#eee"}}>© {new Date().getFullYear()} AnalyticsApp</Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', background: cardBg }}>
      <CssBaseline />
      {TopBar}

      {/* Sidebar */}
      <Sidebar
        variant={isMobile ? "temporary" : "permanent"}
        open={!isMobile || mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        PaperProps={{ style: { zIndex: isMobile ? 1305 : undefined } }}
      >
        {drawerContent}
      </Sidebar>

      {/* Main Content */}
      <MainContent>
        <Toolbar />
        <Typography variant="h4" sx={{ mb: 3, color: primaryColor }}>
          {sectionTitles[currentSection] || "Dashboard"}
        </Typography>
        {loading ? (
          <Typography>Loading analytics...</Typography>
        ) : (
          renderSection()
        )}
      </MainContent>
    </Box>
  );
}
