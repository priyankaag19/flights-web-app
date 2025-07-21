// src/components/layout/Sidebar.jsx
import React, { useState } from 'react';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  IconButton,
  Collapse,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  FlightTakeoff,
  Hotel,
  DirectionsCar,
  Train,
  LocalTaxi,
  Explore,
  History,
  BookmarkBorder,
  Settings,
  Help,
  ExpandLess,
  ExpandMore,
  MenuOpen,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const DRAWER_WIDTH = 280;

const menuItems = [
  {
    id: 'flights',
    label: 'Flights',
    icon: <FlightTakeoff />,
    path: '/',
    primary: true,
  },
  {
    id: 'hotels',
    label: 'Hotels',
    icon: <Hotel />,
    path: '/hotels',
    disabled: true,
  },
  {
    id: 'cars',
    label: 'Car Rentals',
    icon: <DirectionsCar />,
    path: '/cars',
    disabled: true,
  },
  {
    id: 'trains',
    label: 'Trains',
    icon: <Train />,
    path: '/trains',
    disabled: true,
  },
  {
    id: 'taxi',
    label: 'Taxi',
    icon: <LocalTaxi />,
    path: '/taxi',
    disabled: true,
  },
];

const secondaryItems = [
  {
    id: 'explore',
    label: 'Explore',
    icon: <Explore />,
    path: '/explore',
    disabled: true,
  },
  {
    id: 'history',
    label: 'Trip History',
    icon: <History />,
    path: '/history',
    disabled: true,
  },
  {
    id: 'saved',
    label: 'Saved Trips',
    icon: <BookmarkBorder />,
    path: '/saved',
    disabled: true,
  },
];

const bottomItems = [
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings />,
    path: '/settings',
    disabled: true,
  },
  {
    id: 'help',
    label: 'Help & Support',
    icon: <Help />,
    path: '/help',
    disabled: true,
  },
];

const Sidebar = ({ open, onClose, variant = 'temporary' }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [expandedSections, setExpandedSections] = useState({});

  const handleItemClick = (item) => {
    if (item.disabled) return;
    
    if (item.children) {
      setExpandedSections(prev => ({
        ...prev,
        [item.id]: !prev[item.id]
      }));
    } else {
      navigate(item.path);
      if (isMobile && onClose) {
        onClose();
      }
    }
  };

  const isItemActive = (path) => {
    return location.pathname === path;
  };

  const renderMenuItem = (item, depth = 0) => {
    const isActive = isItemActive(item.path);
    const isExpanded = expandedSections[item.id];

    return (
      <React.Fragment key={item.id}>
        <ListItem disablePadding sx={{ pl: depth * 2 }}>
          <ListItemButton
            onClick={() => handleItemClick(item)}
            disabled={item.disabled}
            selected={isActive}
            sx={{
              minHeight: 48,
              borderRadius: 2,
              mx: 1,
              mb: 0.5,
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.light + '20',
                color: theme.palette.primary.main,
                '& .MuiListItemIcon-root': {
                  color: theme.palette.primary.main,
                },
                '&:hover': {
                  backgroundColor: theme.palette.primary.light + '30',
                },
              },
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
              '&.Mui-disabled': {
                opacity: 0.6,
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: isActive ? theme.palette.primary.main : 'inherit',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label}
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 400,
              }}
            />
            {item.children && (
              isExpanded ? <ExpandLess /> : <ExpandMore />
            )}
          </ListItemButton>
        </ListItem>
        
        {item.children && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map(child => renderMenuItem(child, depth + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <FlightTakeoff 
          sx={{ 
            color: theme.palette.primary.main, 
            fontSize: 32 
          }} 
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: theme.palette.primary.main,
            fontSize: '1.25rem',
          }}
        >
          FlightFinder
        </Typography>
        {isMobile && onClose && (
          <IconButton
            onClick={onClose}
            sx={{ ml: 'auto' }}
            size="small"
          >
            <MenuOpen />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ mx: 2 }} />

      {/* Primary Navigation */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 1 }}>
        <List>
          {menuItems.map(item => renderMenuItem(item))}
        </List>

        <Divider sx={{ mx: 2, my: 2 }} />

        {/* Secondary Navigation */}
        <List>
          <ListItem sx={{ px: 3, py: 1 }}>
            <Typography
              variant="overline"
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: theme.palette.text.secondary,
              }}
            >
              Planning
            </Typography>
          </ListItem>
          {secondaryItems.map(item => renderMenuItem(item))}
        </List>

        <Divider sx={{ mx: 2, my: 2 }} />

        {/* Bottom Navigation */}
        <List>
          {bottomItems.map(item => renderMenuItem(item))}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            display: 'block',
            textAlign: 'center',
          }}
        >
          © 2024 FlightFinder
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            display: 'block',
            textAlign: 'center',
            mt: 0.5,
          }}
        >
          Version 1.0.0
        </Typography>
      </Box>
    </Box>
  );

  if (variant === 'permanent') {
    return (
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: 1,
            borderColor: 'divider',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      variant={variant}
      ModalProps={{
        keepMounted: true, // Better mobile performance
      }}
      sx={{
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;