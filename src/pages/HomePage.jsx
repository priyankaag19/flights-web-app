import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Avatar,
  useTheme,
  useMediaQuery,
  Skeleton,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  FlightTakeoff,
  TrendingUp,
  Star,
  LocationOn,
  CalendarToday,
  Group,
  LocalOffer,
} from '@mui/icons-material';
import FlightSearchForm from '../components/flight/FlightSearchForm';
import { useFlights } from '../hooks/useFlights';
import { useFlightContext } from '../context/FlightContext';

// Mock data for popular destinations
const popularDestinations = [
  {
    id: 1,
    city: 'New York',
    country: 'United States',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=300&h=200&fit=crop',
    price: '₹45,000',
    description: 'The city that never sleeps',
    skyId: 'NYCA',
    entityId: '27537542',
  },
  {
    id: 2,
    city: 'London',
    country: 'United Kingdom',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300&h=200&fit=crop',
    price: '₹55,000',
    description: 'Historic charm meets modern culture',
    skyId: 'LOND',
    entityId: '27544008',
  },
  {
    id: 3,
    city: 'Tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&h=200&fit=crop',
    price: '₹42,000',
    description: 'Where tradition meets innovation',
    skyId: 'TYOA',
    entityId: '27539793',
  },
  {
    id: 4,
    city: 'Dubai',
    country: 'United Arab Emirates',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=300&h=200&fit=crop',
    price: '₹35,000',
    description: 'Luxury in the desert',
    skyId: 'DXBA',
    entityId: '95673457',
  },
  {
    id: 5,
    city: 'Paris',
    country: 'France',
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=300&h=200&fit=crop",
    price: '₹58,000',
    description: 'The city of lights and love',
    skyId: 'PARI',
    entityId: '27539733',
  },
  {
    id: 6,
    city: 'Singapore',
    country: 'Singapore',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=300&h=200&fit=crop',
    price: '₹25,000',
    description: 'Garden city of Asia',
    skyId: 'SIN',
    entityId: '95673736',
  },
];

// Mock travel tips
const travelTips = [
  {
    id: 1,
    title: 'Book 2-8 weeks ahead',
    description: 'domestic flights....,2-3 weeks ahead.international, 6-8 weeks.',
    icon: <CalendarToday />,
  },
  {
    id: 2,
    title: 'Compare prices',
    description: 'Check prices across different dates to find the best deals.',
    icon: <TrendingUp />,
  },
  {
    id: 3,
    title: 'Flexible dates save money',
    description: 'Being flexible with travel dates can save up to 40% on flights.',
    icon: <LocalOffer />,
  },
  {
    id: 4,
    title: 'Check baggage policies',
    description: 'Review airline baggage policies before book to avoid risk.',
    icon: <Group />,
  },
];

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { searchFlights, loading, error } = useFlights();
  const { searchParams } = useFlightContext();
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [loadingDestinations, setLoadingDestinations] = useState(true);

  useEffect(() => {
    // Simulate loading popular destinations
    const timer = setTimeout(() => {
      setLoadingDestinations(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleDestinationClick = (destination) => {
    // Auto-fill search form with selected destination
    setNotification({
      open: true,
      message: `Selected ${destination.city} as destination!`,
      severity: 'info',
    });
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const renderDestinationCard = (destination) => (
    <Grid item xs={12} sm={6} md={4} key={destination.id}>
      <Card
        sx={{
          height: '100%',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[8],
          },
        }}
        onClick={() => handleDestinationClick(destination)}
      >
        <Box
          sx={{
            height: 200,
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${destination.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            p: 2,
            color: 'white',
          }}
        >

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            {destination.city}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {destination.country}
          </Typography>
        </Box>
        <CardContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
              From {destination.price}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Star sx={{ color: '#FFB400', fontSize: 16 }} />
              <Typography variant="caption" color="text.secondary">
                4.5
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {destination.description}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );

  const renderDestinationSkeleton = () => (
    <Grid item xs={12} sm={6} md={4}>
      <Card>
        <Skeleton variant="rectangular" height={200} />
        <CardContent>
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="text" width="40%" height={24} />
          <Skeleton variant="text" width="80%" height={20} />
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Box sx={{
      minHeight: '100vh', backgroundColor: 'background.default', overflowX: 'hidden', // Prevents horizontal scroll
      width: '100%',
      maxWidth: '100vw',
    }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
          py: { xs: 4, md: 6 },
          mb: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          maxWidth: '100vw',
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Title Section - Centered */}
          <Box
            sx={{
              maxWidth: 800,
              width: '100%',
              textAlign: 'center',
              mb: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant={isMobile ? 'h4' : 'h3'}
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 2,
              }}
            >
              Find Your Perfect Flight
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 400,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Compare prices from hundreds of airlines and travel agencies
            </Typography>
          </Box>

          {/* Search Form - Centered */}
          <Box
            sx={{
              width: '100%',
              maxWidth: 1200,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: 'background.paper',
                boxShadow: theme.shadows[10],
                width: '100%',
              }}
            >
              <FlightSearchForm onSearch={searchFlights} loading={loading} />
            </Paper>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 2 }}>
        {/* Popular Destinations Section */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
            <Avatar
              sx={{
                backgroundColor: theme.palette.primary.main,
                width: 40,
                height: 40,
              }}
            >
              <LocationOn />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                Popular Destinations
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Explore trending travel destinations with the best deals
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {loadingDestinations
              ? Array.from({ length: 6 }, (_, index) => (
                <React.Fragment key={index}>
                  {renderDestinationSkeleton()}
                </React.Fragment>
              ))
              : popularDestinations.map(renderDestinationCard)
            }
          </Grid>
        </Box>
        {/* Travel Tips Section */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
            <Avatar
              sx={{
                backgroundColor: theme.palette.secondary.main,
                width: 40,
                height: 40,
              }}
            >
              <TrendingUp />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                Travel Tips
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Smart tips to help you save money and travel better
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
            {travelTips.map((tip) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                key={tip.id}
                sx={{
                  display: 'flex',
                  minWidth: 0,
                }}
              >
                <Paper
                  sx={{
                    p: 2.5,
                    width: '100%',
                    height: 200,
                    maxWidth: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                    '&:hover': {
                      boxShadow: theme.shadows[6],
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 0 }}>
                    <Avatar
                      sx={{
                        backgroundColor: theme.palette.primary.light,
                        color: theme.palette.primary.main,
                        width: 48,
                        height: 48,
                        mb: 1.5,
                        flexShrink: 0,
                      }}
                    >
                      {tip.icon}
                    </Avatar>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        height: '2.8em',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontSize: '1rem',
                        lineHeight: 1.2,
                      }}
                    >
                      {tip.title}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: 1.3,
                      overflow: 'hidden',
                      textAlign: 'center',
                      fontSize: '0.875rem',
                      px: 0.5,
                      hyphens: 'auto',
                      wordBreak: 'break-word',
                    }}
                  >
                    {tip.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Features Section */}
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}08 100%)`,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, textAlign: 'center', mb: 3 }}>
            Why Choose FlightFinder?
          </Typography>

          <Grid container spacing={4} sx={{ textAlign: 'center' }}>
            <Grid item xs={12} md={4}>
              <FlightTakeoff
                sx={{
                  fontSize: 48,
                  color: theme.palette.primary.main,
                  mb: 2,
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Best Prices
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Compare hundreds of airlines and travel sites to find the best deals
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Star
                sx={{
                  fontSize: 48,
                  color: theme.palette.primary.main,
                  mb: 2,
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Trusted Service
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Millions of travelers trust us to find the perfect flight for their journey
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Group
                sx={{
                  fontSize: 48,
                  color: theme.palette.primary.main,
                  mb: 2,
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                24/7 Support
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our customer service team is here to help you every step of the way
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Error Notification */}
      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={5000}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default HomePage;