const theme = {
  palette: {
    primary: {
      main: "#1976d2", // Tealish blue for primary
      contrastText: "#fff",
    },
    secondary: {
      main: "#424242",
    },
    accent: {
      main: "#29b6f6",
      contrastText: "#fff",
    },
    background: {
      default: "#f5fafd",
      paper: "#fafcff",
    },
    text: {
      primary: "#222",
      secondary: "#7a7a7a",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: "'Roboto', 'Segoe UI', 'Arial', sans-serif",
    h6: {
      fontWeight: 600,
      color: "#1976d2",
    },
    h4: {
      fontWeight: 700,
      color: "#1976d2",
    },
    subtitle1: {
      color: "#29b6f6",
      fontWeight: 500,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
};

export default theme;
