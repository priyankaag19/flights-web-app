// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, useMediaQuery } from '@mui/material';
import { FlightProvider } from './context/FlightContext';

// Components
import Header from './components/common/Header';
import Sidebar from './components/layout/Sidebar';
import FlightSearchForm from './components/flight/FlightSearchForm';

// Pages (you'll need to create these)
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import TripsPage from './pages/TripsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FlightProvider>
        <Router>
          <Box sx={{ display: 'flex' }}>
            <Header onMenuClick={handleDrawerToggle} />
            
            {!isMobile && (
              <Sidebar
                mobileOpen={mobileOpen}
                handleDrawerToggle={handleDrawerToggle}
              />
            )}
            
            {isMobile && (
              <Sidebar
                mobileOpen={mobileOpen}
                handleDrawerToggle={handleDrawerToggle}
                temporary
              />
            )}

            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                mt: 8, // Account for AppBar height
                ml: isMobile ? 0 : '280px', // Account for sidebar width
                transition: theme.transitions.create(['margin'], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
              }}
            >
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<FlightSearchForm />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/trips" element={<TripsPage />} />
                <Route path="/my-trips" element={<TripsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </FlightProvider>
    </ThemeProvider>
  );
}

export default App;