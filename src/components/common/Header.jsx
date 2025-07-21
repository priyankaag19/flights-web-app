// src/components/layout/Header.jsx
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
} from '@mui/material';
import {
  Flight,
  AccountCircle,
  Menu as MenuIcon,
  Explore,
  CardTravel,
} from '@mui/icons-material';

const Header = ({ onMenuClick }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleClose();
  };

  const handleExplore = () => {
    navigate('/explore');
  };

  const handleTrips = () => {
    navigate('/trips');
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
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
            cursor: 'pointer',
            '&:hover': { opacity: 0.8 }
          }}
          onClick={() => navigate('/')}
        >
          Google Flights
        </Typography>

        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              color="inherit"
              startIcon={<Explore />}
              onClick={handleExplore}
              sx={{ 
                '&:hover': { 
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
              sx={{ 
                '&:hover': { 
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
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => handleNavigation('/profile')}>
              Profile
            </MenuItem>
            <MenuItem onClick={() => handleNavigation('/my-trips')}>
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
  );
};

export default Header;