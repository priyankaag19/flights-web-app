import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Button,
  useTheme,
  useMediaQuery,
  Modal,
  Paper,
  Fade,
} from '@mui/material';
import {
  Flight,
  AccountCircle,
  Menu as MenuIcon,
  Explore,
  CardTravel,
  Login,
} from '@mui/icons-material';

const Header = ({ onMenuClick }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenu = (event) => {
    if (isLoggedOut) return; // Prevent menu from opening when logged out
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    if (path === '/logout') {
      setIsLoggedOut(true);
      handleClose();
      return;
    }
    navigate(path);
    handleClose();
  };

  const handleExplore = () => {
    if (isLoggedOut) return;
    navigate('/explore');
  };

  const handleTrips = () => {
    if (isLoggedOut) return;
    navigate('/trips');
  };

  const handleLogin = () => {
    setIsLoggedOut(false);
    navigate('/');
  };

  const handleLogoClick = () => {
    if (isLoggedOut) return;
    navigate('/');
  };

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          filter: isLoggedOut ? 'grayscale(100%) opacity(0.5)' : 'none',
          pointerEvents: isLoggedOut ? 'none' : 'auto',
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={onMenuClick}
              sx={{ mr: 2 }}
              disabled={isLoggedOut}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Flight sx={{ mr: 2 }} />

          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              cursor: isLoggedOut ? 'default' : 'pointer',
              '&:hover': isLoggedOut ? {} : { opacity: 0.8 }
            }}
            onClick={handleLogoClick}
          >
            Google Flights
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                color="inherit"
                startIcon={<Explore />}
                onClick={handleExplore}
                disabled={isLoggedOut}
                sx={{
                  '&:hover': isLoggedOut ? {} : {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Explore
              </Button>

              <Button
                color="inherit"
                startIcon={<CardTravel />}
                onClick={handleTrips}
                disabled={isLoggedOut}
                sx={{
                  '&:hover': isLoggedOut ? {} : {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Trips
              </Button>
            </Box>
          )}

          <Box sx={{ ml: 2 }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
              disabled={isLoggedOut}
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl) && !isLoggedOut}
              onClose={handleClose}
            >
              <MenuItem onClick={() => handleNavigation('/profile')}>
                Profile
              </MenuItem>
              <MenuItem onClick={() => handleNavigation('/trips')}>
                My Trips
              </MenuItem>
              <MenuItem onClick={() => handleNavigation('/settings')}>
                Settings
              </MenuItem>
              <MenuItem onClick={() => handleNavigation('/logout')}>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Logout Overlay Modal */}
      <Modal
        open={isLoggedOut}
        closeAfterTransition
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(144, 238, 144, 0.9)',
        }}
      >
        <Fade in={isLoggedOut}>
          <Paper
            elevation={24}
            sx={{
              p: 6,
              borderRadius: 4,
              textAlign: 'center',
              maxWidth: 500,
              mx: 2,
              backgroundColor: 'white',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                  mb: 2,
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Adventurer
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                  mb: 1,
                  fontStyle: 'italic',
                }}
              >
                "Hey, you logged out something!"
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 3,
                }}
              >
                Don't worry, your journey continues with just one click.
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="large"
              startIcon={<Login />}
              onClick={handleLogin}
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                boxShadow: '0 8px 24px rgba(25, 118, 210, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                  boxShadow: '0 12px 32px rgba(25, 118, 210, 0.4)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Login to Continue
            </Button>

            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mt: 3,
                color: theme.palette.text.secondary,
                fontStyle: 'italic',
              }}
            >
              Ready to explore amazing destinations again?
            </Typography>
          </Paper>
        </Fade>
      </Modal>
    </>
  );
};

export default Header;