import React from "react";
import Dashboard from "./components/Dashboard";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import themeSettings from "./theme";

// Create MUI theme from provided theme settings
const muiTheme = createTheme(themeSettings);

// PUBLIC_INTERFACE
function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Dashboard />
    </ThemeProvider>
  );
}

export default App;
