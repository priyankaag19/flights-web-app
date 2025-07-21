// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { FlightProvider } from './context/FlightContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import HomePage from './pages/HomePage';
import SearchResults from './pages/SearchResults';
import BookingPage from './pages/BookingPage';
import TripsPage from './pages/TripsPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';
import { useMediaQuery } from '@mui/material';

// Create custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
        contained: {
          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          borderRadius: 12,
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        },
      },
    },
  },
});

function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FlightProvider>
        <Router>
          <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* Navigation Bar */}
            <Navbar onMenuClick={handleSidebarToggle} />
            
            {/* Sidebar */}
            <Sidebar
              open={sidebarOpen}
              onClose={handleSidebarClose}
              variant={isMobile ? 'temporary' : 'persistent'}
            />

            {/* Main Content */}
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                width: { sm: `calc(100% - ${sidebarOpen && !isMobile ? 280 : 0}px)` },
                ml: { md: sidebarOpen ? 0 : 0 },
                transition: theme.transitions.create(['margin', 'width'], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
                mt: 8, // Account for AppBar height
              }}
            >
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/trips" element={<TripsPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/hotels" element={<ComingSoonPage service="Hotels" />} />
                <Route path="/cars" element={<ComingSoonPage service="Car Rentals" />} />
                <Route path="/trains" element={<ComingSoonPage service="Trains" />} />
                <Route path="/alerts" element={<ComingSoonPage service="Price Alerts" />} />
                <Route path="/payments" element={<ComingSoonPage service="Payment Methods" />} />
                <Route path="/security" element={<ComingSoonPage service="Privacy & Security" />} />
                <Route path="/language" element={<ComingSoonPage service="Language Settings" />} />
                <Route path="/help" element={<ComingSoonPage service="Help Center" />} />
                <Route path="/settings" element={<ComingSoonPage service="Settings" />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </FlightProvider>
    </ThemeProvider>
  );
}

// Coming Soon Component for incomplete features
const ComingSoonPage = ({ service }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      textAlign="center"
      p={3}
    >
      <Box
        sx={{
          fontSize: '4rem',
          mb: 2,
          opacity: 0.7,
        }}
      >
        🚧
      </Box>
      <Typography variant="h4" gutterBottom>
        {service} - Coming Soon!
      </Typography>
      <Typography variant="body1" color="text.secondary" maxWidth={500}>
        We're working hard to bring you this feature. Stay tuned for updates!
      </Typography>
    </Box>
  );
};

export default App;