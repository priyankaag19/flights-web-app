import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  Rating,
  Divider,
  Button,
  Paper
} from '@mui/material';
import {
  FlightTakeoff,
  FlightLand,
  Schedule,
  Person,
  ConfirmationNumber
} from '@mui/icons-material';

const TripsPage = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    // Get bookings from localStorage (in a real app, this would be from an API)
    const savedBookings = localStorage.getItem('confirmedBookings');
    if (savedBookings) {
      setTrips(JSON.parse(savedBookings));
    }
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatTime = (dateTime) => {
    return new Date(dateTime).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (dateTime) => {
    return new Date(dateTime).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'default';
      default:
        return 'primary';
    }
  };

  if (trips.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Trips
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Alert severity="info">
            You don't have any trips yet. Start searching for flights to plan your next adventure!
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Trips
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your bookings and view trip details
      </Typography>

      <Grid container spacing={3}>
        {trips.map((trip, index) => (
          <Grid item xs={12} key={index}>
            <Card sx={{ overflow: 'visible' }}>
              <CardContent sx={{ p: 3 }}>
                {/* Header with booking reference and status */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <ConfirmationNumber color="primary" />
                    <Box>
                      <Typography variant="h6">
                        Booking Reference: {trip.bookingReference}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Booked on {formatDate(trip.bookingDate)}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={trip.status || 'Confirmed'}
                    color={getStatusColor(trip.status || 'confirmed')}
                    variant="outlined"
                  />
                </Box>

                {/* Flight Details */}
                <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      {trip.flight.airline.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {trip.flight.airline}
                      </Typography>
                      <Rating value={trip.flight.rating} size="small" readOnly />
                    </Box>
                    <Box ml="auto">
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        {formatPrice(trip.totalAmount)}
                      </Typography>
                    </Box>
                  </Box>

                  <Grid container spacing={3} alignItems="center">
                    {/* Departure */}
                    <Grid item xs={12} sm={3}>
                      <Box textAlign="center">
                        <Typography variant="h5" fontWeight="bold">
                          {formatTime(trip.flight.departure)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(trip.flight.departure)}
                        </Typography>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {trip.flight.origin}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Flight Path */}
                    <Grid item xs={12} sm={6}>
                      <Box textAlign="center">
                        <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                          <FlightTakeoff color="action" sx={{ mr: 1 }} />
                          <Box
                            sx={{
                              flexGrow: 1,
                              height: '2px',
                              bgcolor: 'primary.main',
                              mx: 2
                            }}
                          />
                          <FlightLand color="action" sx={{ ml: 1 }} />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {formatDuration(trip.flight.duration)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {trip.flight.stops === 0 ? 'Non-stop' : `${trip.flight.stops} stop(s)`}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Arrival */}
                    <Grid item xs={12} sm={3}>
                      <Box textAlign="center">
                        <Typography variant="h5" fontWeight="bold">
                          {formatTime(trip.flight.arrival)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(trip.flight.arrival)}
                        </Typography>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {trip.flight.destination}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Passenger Details */}
                <Box mb={3}>
                  <Typography variant="h6" gutterBottom display="flex" alignItems="center">
                    <Person sx={{ mr: 1 }} />
                    Passengers ({trip.passengers.length})
                  </Typography>
                  <Grid container spacing={2}>
                    {trip.passengers.map((passenger, passengerIndex) => (
                      <Grid item xs={12} sm={6} md={4} key={passengerIndex}>
                        <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {passenger.firstName} {passenger.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {passenger.email}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {passenger.phone}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Action Buttons */}
                <Box display="flex" gap={2} flexWrap="wrap">
                  <Button variant="outlined" size="small">
                    View E-Ticket
                  </Button>
                  <Button variant="outlined" size="small">
                    Manage Booking
                  </Button>
                  <Button variant="outlined" size="small" color="error">
                    Cancel Booking
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TripsPage;