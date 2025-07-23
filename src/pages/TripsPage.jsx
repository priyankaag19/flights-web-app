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
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Snackbar,
  TextField,
  IconButton
} from '@mui/material';
import {
  FlightTakeoff,
  FlightLand,
  Schedule,
  Person,
  ConfirmationNumber,
  Cancel,
  Edit,
  Save,
  Close
} from '@mui/icons-material';

const TripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [cancelDialog, setCancelDialog] = useState({
    open: false,
    tripIndex: null,
    bookingReference: ''
  });
  const [editDialog, setEditDialog] = useState({
    open: false,
    tripIndex: null,
    passengers: [],
    bookingReference: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

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

  const handleCancelBooking = (tripIndex, bookingReference) => {
    setCancelDialog({
      open: true,
      tripIndex,
      bookingReference
    });
  };

  const handleManageBooking = (tripIndex, bookingReference) => {
    const trip = trips[tripIndex];
    setEditDialog({
      open: true,
      tripIndex,
      passengers: trip.passengers.map(p => ({ ...p })), // Create deep copy
      bookingReference
    });
  };

  const handlePassengerChange = (passengerIndex, field, value) => {
    const updatedPassengers = [...editDialog.passengers];
    updatedPassengers[passengerIndex] = {
      ...updatedPassengers[passengerIndex],
      [field]: value
    };
    setEditDialog({
      ...editDialog,
      passengers: updatedPassengers
    });
  };

  const savePassengerChanges = () => {
    const { tripIndex, passengers } = editDialog;
    
    // Validate that all required fields are filled
    const isValid = passengers.every(passenger => 
      passenger.firstName?.trim() && 
      passenger.lastName?.trim() && 
      passenger.email?.trim() && 
      passenger.phone?.trim()
    );

    if (!isValid) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields for all passengers.',
        severity: 'error'
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const hasValidEmails = passengers.every(passenger => 
      emailRegex.test(passenger.email)
    );

    if (!hasValidEmails) {
      setSnackbar({
        open: true,
        message: 'Please enter valid email addresses for all passengers.',
        severity: 'error'
      });
      return;
    }

    // Update the trip with new passenger details
    const updatedTrips = [...trips];
    updatedTrips[tripIndex] = {
      ...updatedTrips[tripIndex],
      passengers: passengers,
      lastModified: new Date().toISOString()
    };
    
    // Update state and localStorage
    setTrips(updatedTrips);
    localStorage.setItem('confirmedBookings', JSON.stringify(updatedTrips));
    
    // Close dialog and show success message
    setEditDialog({ open: false, tripIndex: null, passengers: [], bookingReference: '' });
    setSnackbar({
      open: true,
      message: `Passenger details updated successfully for booking ${editDialog.bookingReference}.`,
      severity: 'success'
    });

    // In a real app, you would also make an API call here
    // Example: await updatePassengerDetailsAPI(editDialog.bookingReference, passengers);
  };

  const closeEditDialog = () => {
    setEditDialog({ open: false, tripIndex: null, passengers: [], bookingReference: '' });
  };

  const confirmCancellation = () => {
    const { tripIndex } = cancelDialog;
    
    // Update the trip status to cancelled
    const updatedTrips = [...trips];
    updatedTrips[tripIndex] = {
      ...updatedTrips[tripIndex],
      status: 'cancelled',
      cancelledDate: new Date().toISOString()
    };
    
    // Update state and localStorage
    setTrips(updatedTrips);
    localStorage.setItem('confirmedBookings', JSON.stringify(updatedTrips));
    
    // Close dialog and show success message
    setCancelDialog({ open: false, tripIndex: null, bookingReference: '' });
    setSnackbar({
      open: true,
      message: `Booking ${cancelDialog.bookingReference} has been cancelled successfully.`,
      severity: 'success'
    });

    // In a real app, you would also make an API call here
    // Example: await cancelBookingAPI(cancelDialog.bookingReference);
  };

  const closeCancelDialog = () => {
    setCancelDialog({ open: false, tripIndex: null, bookingReference: '' });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const canCancelBooking = (trip) => {
    // Only allow cancellation if status is 'confirmed' and flight is in the future
    const flightDate = new Date(trip.flight.departure);
    const now = new Date();
    const hoursDifference = (flightDate - now) / (1000 * 60 * 60);
    
    return trip.status !== 'cancelled' && 
           trip.status !== 'completed' && 
           hoursDifference > 24; // Allow cancellation only if more than 24 hours before flight
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
            <Card sx={{ 
              overflow: 'visible',
              opacity: trip.status === 'cancelled' ? 0.7 : 1,
              position: 'relative'
            }}>
              {trip.status === 'cancelled' && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    zIndex: 1,
                    bgcolor: 'error.main',
                    color: 'white',
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    transform: 'rotate(15deg)',
                    fontWeight: 'bold',
                    fontSize: '0.875rem'
                  }}
                >
                  CANCELLED
                </Box>
              )}
              
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
                        {trip.cancelledDate && (
                          <span> • Cancelled on {formatDate(trip.cancelledDate)}</span>
                        )}
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
                  <Button 
                    variant="outlined" 
                    size="small"
                    startIcon={<Edit />}
                    disabled={trip.status === 'cancelled'}
                    onClick={() => handleManageBooking(index, trip.bookingReference)}
                  >
                    Manage Booking
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    color="error"
                    startIcon={<Cancel />}
                    disabled={!canCancelBooking(trip)}
                    onClick={() => handleCancelBooking(index, trip.bookingReference)}
                  >
                    {trip.status === 'cancelled' ? 'Cancelled' : 'Cancel Booking'}
                  </Button>
                </Box>

                {/* Cancellation Policy Info */}
                {canCancelBooking(trip) && (
                  <Box mt={2}>
                    <Typography variant="caption" color="text.secondary">
                      * Free cancellation available up to 24 hours before departure
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Cancellation Confirmation Dialog */}
      <Dialog
        open={cancelDialog.open}
        onClose={closeCancelDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Cancel Booking Confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel booking <strong>{cancelDialog.bookingReference}</strong>?
            <br /><br />
            This action cannot be undone. Once cancelled, you may be eligible for a refund 
            according to the airline's cancellation policy.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={closeCancelDialog} variant="outlined">
            Keep Booking
          </Button>
          <Button 
            onClick={confirmCancellation} 
            color="error" 
            variant="contained"
            startIcon={<Cancel />}
          >
            Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Passenger Details Dialog */}
      <Dialog
        open={editDialog.open}
        onClose={closeEditDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { minHeight: '60vh' }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Edit color="primary" />
          Edit Passenger Details - {editDialog.bookingReference}
          <IconButton
            onClick={closeEditDialog}
            sx={{ marginLeft: 'auto' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Update passenger information for your booking. All fields are required.
          </Typography>
          
          <Grid container spacing={3}>
            {editDialog.passengers.map((passenger, index) => (
              <Grid item xs={12} key={index}>
                <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person color="primary" />
                    Passenger {index + 1}
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        value={passenger.firstName || ''}
                        onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                        required
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={passenger.lastName || ''}
                        onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                        required
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={passenger.email || ''}
                        onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                        required
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        value={passenger.phone || ''}
                        onChange={(e) => handlePassengerChange(index, 'phone', e.target.value)}
                        required
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'info.main', color: 'info.contrastText', borderRadius: 1 }}>
            <Typography variant="body2">
              <strong>Important:</strong> Changes to passenger details may be subject to airline policies. 
              Please ensure all information matches official identification documents.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={closeEditDialog} variant="outlined">
            Cancel Changes
          </Button>
          <Button 
            onClick={savePassengerChanges}
            color="primary" 
            variant="contained"
            startIcon={<Save />}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TripsPage;