import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Chip,
  Paper,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  FormHelperText
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  FlightTakeoff,
  FlightLand,
  Person,
  CreditCard,
  CheckCircle,
  Security,
  Schedule,
  Luggage
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

const BookingContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.grey[50],
}));

const FlightSummaryCard = styled(Card)(({ theme }) => ({
  position: 'sticky',
  top: theme.spacing(2),
  border: `1px solid ${theme.palette.primary.main}`,
}));

const StepContent = styled(Box)(({ theme }) => ({
  minHeight: '400px',
  padding: theme.spacing(3),
}));

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, searchParams } = location.state || {};
  
  const [activeStep, setActiveStep] = useState(0);
  const [passengers, setPassengers] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState({});
  const [bookingComplete, setBookingComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const steps = ['Passenger Details', 'Payment', 'Confirmation'];

  useEffect(() => {
    if (!flight) {
      navigate('/');
      return;
    }
    
    // Initialize passenger data based on search params
    const numPassengers = parseInt(searchParams?.passengers) || 1;
    const initialPassengers = Array.from({ length: numPassengers }, (_, index) => ({
      id: index + 1,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      nationality: 'Indian'
    }));
    setPassengers(initialPassengers);
  }, [flight, searchParams, navigate]);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,15}$/;
    return phoneRegex.test(phone);
  };

  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    return nameRegex.test(name);
  };

  const validateDateOfBirth = (dob) => {
    if (!dob) return false;
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 0 && age <= 120 && birthDate <= today;
  };

  const validateCardNumber = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    const cardRegex = /^\d{13,19}$/;
    return cardRegex.test(cleaned);
  };

  const validateExpiryDate = (expiry) => {
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(expiry)) return false;
    
    const [month, year] = expiry.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    const expiryYear = parseInt(year);
    const expiryMonth = parseInt(month);
    
    if (expiryYear < currentYear) return false;
    if (expiryYear === currentYear && expiryMonth <= currentMonth) return false;
    
    return true;
  };

  const validateCVV = (cvv) => {
    const cvvRegex = /^\d{3,4}$/;
    return cvvRegex.test(cvv);
  };

  const validatePassengerDetails = () => {
    const newErrors = {};
    
    passengers.forEach((passenger, index) => {
      // First Name validation
      if (!passenger.firstName.trim()) {
        newErrors[`passenger${index}_firstName`] = 'First name is required';
      } else if (!validateName(passenger.firstName)) {
        newErrors[`passenger${index}_firstName`] = 'First name must contain only letters and be 2-50 characters';
      }
      
      // Last Name validation
      if (!passenger.lastName.trim()) {
        newErrors[`passenger${index}_lastName`] = 'Last name is required';
      } else if (!validateName(passenger.lastName)) {
        newErrors[`passenger${index}_lastName`] = 'Last name must contain only letters and be 2-50 characters';
      }
      
      // Email validation
      if (!passenger.email.trim()) {
        newErrors[`passenger${index}_email`] = 'Email is required';
      } else if (!validateEmail(passenger.email)) {
        newErrors[`passenger${index}_email`] = 'Please enter a valid email address';
      }
      
      // Phone validation
      if (!passenger.phone.trim()) {
        newErrors[`passenger${index}_phone`] = 'Phone number is required';
      } else if (!validatePhone(passenger.phone)) {
        newErrors[`passenger${index}_phone`] = 'Please enter a valid phone number (10-15 digits)';
      }
      
      // Date of Birth validation
      if (!passenger.dateOfBirth) {
        newErrors[`passenger${index}_dateOfBirth`] = 'Date of birth is required';
      } else if (!validateDateOfBirth(passenger.dateOfBirth)) {
        newErrors[`passenger${index}_dateOfBirth`] = 'Please enter a valid date of birth';
      }
      
      // Gender validation
      if (!passenger.gender) {
        newErrors[`passenger${index}_gender`] = 'Gender selection is required';
      }
      
      // Nationality validation
      if (!passenger.nationality) {
        newErrors[`passenger${index}_nationality`] = 'Nationality is required';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePaymentInfo = () => {
    const newErrors = {};
    
    // Cardholder Name validation
    if (!paymentInfo.cardholderName?.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    } else if (!validateName(paymentInfo.cardholderName)) {
      newErrors.cardholderName = 'Cardholder name must contain only letters and be 2-50 characters';
    }
    
    // Card Number validation
    if (!paymentInfo.cardNumber?.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!validateCardNumber(paymentInfo.cardNumber)) {
      newErrors.cardNumber = 'Please enter a valid card number (13-19 digits)';
    }
    
    // Expiry Date validation
    if (!paymentInfo.expiryDate?.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!validateExpiryDate(paymentInfo.expiryDate)) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY) that is not expired';
    }
    
    // CVV validation
    if (!paymentInfo.cvv?.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (!validateCVV(paymentInfo.cvv)) {
      newErrors.cvv = 'Please enter a valid CVV (3-4 digits)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (activeStep === 0 && !validatePassengerDetails()) return;
    if (activeStep === 1 && !validatePaymentInfo()) return;
    
    if (activeStep === steps.length - 1) {
      handleBookingSubmit();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index][field] = value;
    setPassengers(updatedPassengers);
    
    // Clear specific field error when user starts typing
    if (errors[`passenger${index}_${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`passenger${index}_${field}`];
      setErrors(newErrors);
    }
  };

  const handlePaymentChange = (field, value) => {
    // Format card number and expiry date as user types
    if (field === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    } else if (field === 'expiryDate') {
      value = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      if (value.length > 5) value = value.substring(0, 5);
    } else if (field === 'cvv') {
      value = value.replace(/\D/g, '');
      if (value.length > 4) value = value.substring(0, 4);
    }
    
    setPaymentInfo(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const generateBookingReference = () => {
    return 'BK' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const handleBookingSubmit = async () => {
    setProcessing(true);
    try {
      // Simulate booking API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Save booking to localStorage (in a real app, this would be sent to backend)
      const bookingData = {
        bookingReference: generateBookingReference(),
        flight,
        passengers,
        paymentInfo: {
          cardholderName: paymentInfo.cardholderName,
          cardNumber: '**** **** **** ' + paymentInfo.cardNumber.slice(-4),
        },
        totalAmount: calculateTotalPrice(),
        bookingDate: new Date().toISOString(),
        status: 'confirmed'
      };
      
      const existingBookings = JSON.parse(localStorage.getItem('confirmedBookings') || '[]');
      existingBookings.push(bookingData);
      localStorage.setItem('confirmedBookings', JSON.stringify(existingBookings));
      
      setBookingComplete(true);
    } catch (error) {
      setErrors({ booking: 'Booking failed. Please try again.' });
    } finally {
      setProcessing(false);
    }
  };

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

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const calculateTotalPrice = () => {
    const basePrice = flight?.price || 0;
    const numPassengers = passengers.length;
    const taxes = basePrice * 0.12;
    const fees = 500; 
    return (basePrice * numPassengers) + taxes + fees;
  };

  if (!flight) {
    return null;
  }

  const renderPassengerDetails = () => (
    <StepContent>
      <Typography variant="h6" gutterBottom>
        Passenger Information
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Please enter details as they appear on your government-issued ID
      </Typography>

      {passengers.map((passenger, index) => (
        <Card key={index} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Passenger {index + 1}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name *"
                  value={passenger.firstName}
                  onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                  error={!!errors[`passenger${index}_firstName`]}
                  helperText={errors[`passenger${index}_firstName`]}
                  inputProps={{ maxLength: 50 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name *"
                  value={passenger.lastName}
                  onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                  error={!!errors[`passenger${index}_lastName`]}
                  helperText={errors[`passenger${index}_lastName`]}
                  inputProps={{ maxLength: 50 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address *"
                  type="email"
                  value={passenger.email}
                  onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                  error={!!errors[`passenger${index}_email`]}
                  helperText={errors[`passenger${index}_email`]}
                  inputProps={{ maxLength: 100 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number *"
                  value={passenger.phone}
                  onChange={(e) => handlePassengerChange(index, 'phone', e.target.value)}
                  error={!!errors[`passenger${index}_phone`]}
                  helperText={errors[`passenger${index}_phone`]}
                  placeholder="+91 98765 43210"
                  inputProps={{ maxLength: 15 }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Date of Birth *"
                  type="date"
                  value={passenger.dateOfBirth}
                  onChange={(e) => handlePassengerChange(index, 'dateOfBirth', e.target.value)}
                  error={!!errors[`passenger${index}_dateOfBirth`]}
                  helperText={errors[`passenger${index}_dateOfBirth`]}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ 
                    max: new Date().toISOString().split('T')[0],
                    min: new Date(new Date().getFullYear() - 120, 0, 1).toISOString().split('T')[0]
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth error={!!errors[`passenger${index}_gender`]}>
                  <InputLabel>Gender *</InputLabel>
                  <Select
                    value={passenger.gender}
                    onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                    label="Gender *"
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                  {errors[`passenger${index}_gender`] && (
                    <FormHelperText>{errors[`passenger${index}_gender`]}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth error={!!errors[`passenger${index}_nationality`]}>
                  <InputLabel>Nationality *</InputLabel>
                  <Select
                    value={passenger.nationality}
                    onChange={(e) => handlePassengerChange(index, 'nationality', e.target.value)}
                    label="Nationality *"
                  >
                    <MenuItem value="Indian">Indian</MenuItem>
                    <MenuItem value="American">American</MenuItem>
                    <MenuItem value="British">British</MenuItem>
                    <MenuItem value="Canadian">Canadian</MenuItem>
                    <MenuItem value="Australian">Australian</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                  {errors[`passenger${index}_nationality`] && (
                    <FormHelperText>{errors[`passenger${index}_nationality`]}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </StepContent>
  );

  const renderPaymentDetails = () => (
    <StepContent>
      <Typography variant="h6" gutterBottom>
        Payment Information
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Your payment information is secure and encrypted
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Cardholder Name *"
            value={paymentInfo.cardholderName || ''}
            onChange={(e) => handlePaymentChange('cardholderName', e.target.value)}
            error={!!errors.cardholderName}
            helperText={errors.cardholderName}
            placeholder="John Doe"
            inputProps={{ maxLength: 50 }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Card Number *"
            value={paymentInfo.cardNumber || ''}
            onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
            error={!!errors.cardNumber}
            helperText={errors.cardNumber}
            placeholder="1234 5678 9012 3456"
            inputProps={{ maxLength: 23 }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Expiry Date *"
            value={paymentInfo.expiryDate || ''}
            onChange={(e) => handlePaymentChange('expiryDate', e.target.value)}
            error={!!errors.expiryDate}
            helperText={errors.expiryDate}
            placeholder="MM/YY"
            inputProps={{ maxLength: 5 }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="CVV *"
            value={paymentInfo.cvv || ''}
            onChange={(e) => handlePaymentChange('cvv', e.target.value)}
            error={!!errors.cvv}
            helperText={errors.cvv}
            placeholder="123"
            inputProps={{ maxLength: 4 }}
          />
        </Grid>
        <Grid item xs={12}>
          <Alert severity="info" icon={<Security />}>
            Your payment is protected by 256-bit SSL encryption
          </Alert>
        </Grid>
      </Grid>
    </StepContent>
  );

  const renderConfirmation = () => (
    <StepContent>
      <Box textAlign="center">
        {processing ? (
          <>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Processing your booking...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please do not close this window
            </Typography>
          </>
        ) : bookingComplete ? (
          <>
            <CheckCircle color="success" sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Booking Confirmed!
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              Your booking has been successfully confirmed. You will receive a confirmation email shortly.
            </Typography>
            <Chip label="Booking Reference: BK123456789" variant="outlined" sx={{ mb: 3 }} />
            <Box>
              <Button
                variant="contained"
                onClick={() => navigate('/trips')}
                sx={{ mr: 2 }}
              >
                View My Trips
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/')}
              >
                Book Another Flight
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              Review & Confirm
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Please review your booking details before confirming
            </Typography>
            
            <Paper sx={{ p: 2, mb: 3, textAlign: 'left' }}>
              <Typography variant="subtitle2" gutterBottom>
                Passengers:
              </Typography>
              {passengers.map((passenger, index) => (
                <Typography key={index} variant="body2">
                  {passenger.firstName} {passenger.lastName}
                </Typography>
              ))}
            </Paper>

            {errors.booking && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.booking}
              </Alert>
            )}
          </>
        )}
      </Box>
    </StepContent>
  );

  return (
    <BookingContainer>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* Main Booking Flow */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {activeStep === 0 && renderPassengerDetails()}
                {activeStep === 1 && renderPaymentDetails()}
                {activeStep === 2 && renderConfirmation()}

                {!bookingComplete && (
                  <Box display="flex" justifyContent="space-between" mt={3}>
                    <Button
                      onClick={handleBack}
                      disabled={activeStep === 0 || processing}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      disabled={processing}
                    >
                      {activeStep === steps.length - 1 ? 'Confirm Booking' : 'Next'}
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Flight Summary Sidebar */}
          <Grid item xs={12} md={4}>
            <FlightSummaryCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Flight Summary
                </Typography>
                
                {/* Flight Details */}
                <Box mb={3}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      {flight.airline.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1">
                        {flight.airline}
                      </Typography>
                      <Rating value={flight.rating} size="small" readOnly />
                    </Box>
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box textAlign="center">
                      <Typography variant="h6" fontWeight="bold">
                        {formatTime(flight.departure)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {flight.origin}
                      </Typography>
                    </Box>
                    
                    <Box textAlign="center">
                      <Typography variant="body2" color="text.secondary">
                        {formatDuration(flight.duration)}
                      </Typography>
                      <FlightTakeoff color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop`}
                      </Typography>
                    </Box>
                    
                    <Box textAlign="center">
                      <Typography variant="h6" fontWeight="bold">
                        {formatTime(flight.arrival)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {flight.destination}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Price Breakdown */}
                <Typography variant="h6" gutterBottom>
                  Price Breakdown
                </Typography>
                
                <Box mb={2}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">
                      Base fare ({passengers.length} passenger{passengers.length > 1 ? 's' : ''})
                    </Typography>
                    <Typography variant="body2">
                      {formatPrice(flight.price * passengers.length)}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Taxes & Fees</Typography>
                    <Typography variant="body2">
                      {formatPrice(flight.price * 0.12 + 500)}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6" fontWeight="bold">
                    Total Amount
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {formatPrice(calculateTotalPrice())}
                  </Typography>
                </Box>

                {/* Additional Info */}
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Free cancellation up to 24 hours before departure
                  </Typography>
                </Alert>
              </CardContent>
            </FlightSummaryCard>
          </Grid>
        </Grid>
      </Container>
    </BookingContainer>
  );
};

export default BookingPage;