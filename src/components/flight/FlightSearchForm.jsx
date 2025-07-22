import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  IconButton,
  Typography,
  Collapse,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import {
  SwapHoriz,
  FlightTakeoff,
  FlightLand,
  CalendarToday,
  Person,
  ExpandLess,
  ExpandMore,
  Search,
  Clear
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAirports } from '../../hooks/useAirports';
import { useFlightContext } from '../../context/FlightContext';

const SearchPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
  '& .MuiTextField-root': {
    '& .MuiOutlinedInput-root': {
      backgroundColor: theme.palette.background.paper,
      '&:hover': {
        backgroundColor: theme.palette.grey[50],
      },
    },
  },
}));

const PassengerSelector = styled(Card)(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  zIndex: 1000,
  marginTop: theme.spacing(1),
  boxShadow: theme.shadows[8],
}));

const FlightSearchForm = ({ onSearch, loading: externalLoading, initialValues = {} }) => {
  const navigate = useNavigate();
  const { handleSearch, loading: contextLoading } = useFlightContext();
  
  const {
    airports,
    loading: airportsLoading,
    searchAirports,
    selectedOrigin,
    selectedDestination,
    setSelectedOrigin,
    setSelectedDestination,
    swapAirports,
    popularAirports
  } = useAirports();

  // Form state
  const [tripType, setTripType] = useState(initialValues.tripType || 'roundtrip');
  const [departureDate, setDepartureDate] = useState(
    initialValues.departureDate ? 
    new Date(initialValues.departureDate).toISOString().split('T')[0] : 
    ''
  );
  const [returnDate, setReturnDate] = useState(
    initialValues.returnDate ? 
    new Date(initialValues.returnDate).toISOString().split('T')[0] : 
    ''
  );
  const [passengers, setPassengers] = useState({
    adults: initialValues.adults || 1,
    children: initialValues.children || 0,
    infants: initialValues.infants || 0,
  });
  const [cabinClass, setCabinClass] = useState(initialValues.cabinClass || 'economy');
  const [showPassengerSelector, setShowPassengerSelector] = useState(false);

  const [fromInputValue, setFromInputValue] = useState('');
  const [toInputValue, setToInputValue] = useState('');

  // Use external loading or context loading
  const isLoading = externalLoading || contextLoading;

  // Form submission handler
  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!selectedOrigin || !selectedDestination || !departureDate) {
      alert('Please fill in all required fields');
      return;
    }

    if (tripType === 'roundtrip' && !returnDate) {
      alert('Please select a return date for round trip');
      return;
    }

    // Prepare search parameters
    const searchParams = {
      tripType,
      from: selectedOrigin,
      to: selectedDestination,
      departureDate: new Date(departureDate),
      returnDate: tripType === 'roundtrip' && returnDate ? new Date(returnDate) : null,
      adults: passengers.adults,
      children: passengers.children,
      infants: passengers.infants,
      cabinClass,
    };

    console.log('📤 Submitting search with:', searchParams);

    try {
      // Use context handleSearch if available, otherwise use onSearch prop
      if (handleSearch) {
        await handleSearch(searchParams);
        // Navigate to results page after successful search
        navigate('/flights');
      } else if (onSearch) {
        await onSearch(searchParams);
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed. Please try again.');
    }
  };

  // Debounced airport search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (fromInputValue.length >= 2) {
        searchAirports(fromInputValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [fromInputValue, searchAirports]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (toInputValue.length >= 2) {
        searchAirports(toInputValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [toInputValue, searchAirports]);

  const handleTripTypeChange = (event, newValue) => {
    setTripType(newValue);
    if (newValue === 'oneway') {
      setReturnDate('');
    }
  };

  const handleSwapAirports = () => {
    swapAirports();
    const tempInput = fromInputValue;
    setFromInputValue(toInputValue);
    setToInputValue(tempInput);
  };

  const handlePassengerChange = (type, increment) => {
    setPassengers(prev => {
      const newValue = Math.max(0, prev[type] + increment);
      
      // Ensure at least 1 adult
      if (type === 'adults' && newValue < 1) return prev;
      
      // Limit total passengers
      const total = Object.values({ ...prev, [type]: newValue }).reduce((a, b) => a + b, 0);
      if (total > 9) return prev;
      
      return { ...prev, [type]: newValue };
    });
  };

  const getTotalPassengers = () => {
    return passengers.adults + passengers.children + passengers.infants;
  };

  const getPassengerText = () => {
    const total = getTotalPassengers();
    if (total === 1) return '1 passenger';
    
    const parts = [];
    if (passengers.adults > 0) parts.push(`${passengers.adults} adult${passengers.adults > 1 ? 's' : ''}`);
    if (passengers.children > 0) parts.push(`${passengers.children} child${passengers.children > 1 ? 'ren' : ''}`);
    if (passengers.infants > 0) parts.push(`${passengers.infants} infant${passengers.infants > 1 ? 's' : ''}`);
    
    return parts.join(', ');
  };

  // Get today's date in YYYY-MM-DD format for min date
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const handleClear = () => {
    setSelectedOrigin(null);
    setSelectedDestination(null);
    setDepartureDate('');
    setReturnDate('');
    setPassengers({ adults: 1, children: 0, infants: 0 });
    setCabinClass('economy');
    setFromInputValue('');
    setToInputValue('');
  };

  const isSearchDisabled = !selectedOrigin || !selectedDestination || !departureDate || 
    (tripType === 'roundtrip' && !returnDate) || isLoading;

  // Custom renderOption function for airport autocomplete
  const renderAirportOption = (props, option) => {
    const { key, ...otherProps } = props;
    return (
      <Box component="li" key={key} {...otherProps}>
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {option.name || option.presentation?.title} ({option.skyId || option.entityId})
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {option.hierarchy || `${option.city}, ${option.country}`}
          </Typography>
        </Box>
      </Box>
    );
  };

  const getAirportLabel = (option) => {
    if (typeof option === 'string') return option;
    return `${option.name || option.presentation?.title} (${option.skyId || option.entityId})`;
  };

  const handlePopularRouteClick = (route) => {
    if (route.from && route.to) {
      setSelectedOrigin(route.from);
      setFromInputValue(route.from.name || '');
      setSelectedDestination(route.to);
      setToInputValue(route.to.name || '');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <SearchPaper>
        {/* Trip Type Tabs */}
        <Tabs
          value={tripType}
          onChange={handleTripTypeChange}
          sx={{ mb: 3 }}
        >
          <Tab label="Round trip" value="roundtrip" />
          <Tab label="One way" value="oneway" />
          <Tab label="Multi-city" value="multicity" disabled />
        </Tabs>

        <Grid container spacing={2} alignItems="center">
          {/* From Airport */}
          <Grid item xs={12} md={3}>
            <Autocomplete
              value={selectedOrigin}
              onChange={(event, newValue) => setSelectedOrigin(newValue)}
              inputValue={fromInputValue}
              onInputChange={(event, newInputValue) => setFromInputValue(newInputValue)}
              options={airports}
              loading={airportsLoading}
              getOptionLabel={getAirportLabel}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="From"
                  placeholder="Where from?"
                  fullWidth
                  required
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: <FlightTakeoff sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              )}
              renderOption={renderAirportOption}
              noOptionsText={fromInputValue.length < 2 ? "Type at least 2 characters" : "No airports found"}
            />
          </Grid>

          {/* Swap Button */}
          <Grid item xs={12} md="auto" sx={{ textAlign: 'center' }}>
            <IconButton 
              onClick={handleSwapAirports}
              sx={{ 
                backgroundColor: 'background.paper',
                '&:hover': { backgroundColor: 'grey.100' },
              }}
            >
              <SwapHoriz />
            </IconButton>
          </Grid>

          {/* To Airport */}
          <Grid item xs={12} md={3}>
            <Autocomplete
              value={selectedDestination}
              onChange={(event, newValue) => setSelectedDestination(newValue)}
              inputValue={toInputValue}
              onInputChange={(event, newInputValue) => setToInputValue(newInputValue)}
              options={airports}
              loading={airportsLoading}
              getOptionLabel={getAirportLabel}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="To"
                  placeholder="Where to?"
                  fullWidth
                  required
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: <FlightLand sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              )}
              renderOption={renderAirportOption}
              noOptionsText={toInputValue.length < 2 ? "Type at least 2 characters" : "No airports found"}
            />
          </Grid>

          {/* Departure Date */}
          <Grid item xs={12} md={2}>
            <TextField
              label="Departure"
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: getTodayDate(),
              }}
              InputProps={{
                startAdornment: <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>

          {/* Return Date */}
          {tripType === 'roundtrip' && (
            <Grid item xs={12} md={2}>
              <TextField
                label="Return"
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                fullWidth
                required={tripType === 'roundtrip'}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: departureDate || getTodayDate(),
                }}
                disabled={!departureDate}
                InputProps={{
                  startAdornment: <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
          )}

          {/* Passengers & Class */}
          <Grid item xs={12} md={tripType === 'roundtrip' ? 2 : 4}>
            <Box position="relative">
              <TextField
                label="Passengers & Class"
                value={`${getPassengerText()}, ${cabinClass}`}
                onClick={() => setShowPassengerSelector(!showPassengerSelector)}
                fullWidth
                InputProps={{
                  readOnly: true,
                  startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                  endAdornment: showPassengerSelector ? <ExpandLess /> : <ExpandMore />,
                }}
                sx={{ cursor: 'pointer' }}
              />

              <Collapse in={showPassengerSelector}>
                <PassengerSelector>
                  <CardContent>
                    {/* Passenger Counters */}
                    <Box mb={2}>
                      <Typography variant="subtitle2" gutterBottom>
                        Passengers
                      </Typography>
                      
                      {[
                        { key: 'adults', label: 'Adults', sublabel: '12+ years' },
                        { key: 'children', label: 'Children', sublabel: '2-11 years' },
                        { key: 'infants', label: 'Infants', sublabel: 'Under 2 years' },
                      ].map(({ key, label, sublabel }) => (
                        <Box key={key} display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                          <Box>
                            <Typography variant="body2">{label}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {sublabel}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handlePassengerChange(key, -1)}
                              disabled={key === 'adults' && passengers[key] <= 1}
                            >
                              -
                            </Button>
                            <Typography sx={{ minWidth: 20, textAlign: 'center' }}>
                              {passengers[key]}
                            </Typography>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handlePassengerChange(key, 1)}
                              disabled={getTotalPassengers() >= 9}
                            >
                              +
                            </Button>
                          </Box>
                        </Box>
                      ))}
                    </Box>

                    {/* Cabin Class */}
                    <FormControl fullWidth>
                      <InputLabel>Cabin Class</InputLabel>
                      <Select
                        value={cabinClass}
                        onChange={(e) => setCabinClass(e.target.value)}
                        label="Cabin Class"
                      >
                        <MenuItem value="economy">Economy</MenuItem>
                        <MenuItem value="premium_economy">Premium Economy</MenuItem>
                        <MenuItem value="business">Business</MenuItem>
                        <MenuItem value="first">First Class</MenuItem>
                      </Select>
                    </FormControl>

                    <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
                      <Button
                        size="small"
                        onClick={() => setShowPassengerSelector(false)}
                      >
                        Done
                      </Button>
                    </Box>
                  </CardContent>
                </PassengerSelector>
              </Collapse>
            </Box>
          </Grid>
        </Grid>

        {/* Popular Routes */}
        {popularAirports.length > 0 && (
          <Box mt={3}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Popular routes:
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {popularAirports.map((route, index) => {
                if (!route.from || !route.to) return null;

                return (
                  <Chip
                    key={index}
                    label={`${route?.from?.name || 'From'} → ${route?.to?.name || 'To'}`}
                    variant="outlined"
                    size="small"
                    clickable
                    onClick={() => handlePopularRouteClick(route)}
                  />
                );
              })}
            </Box>
          </Box>
        )}

        {/* Action Buttons */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
          <Button
            startIcon={<Clear />}
            onClick={handleClear}
            variant="text"
            color="secondary"
            type="button"
          >
            Clear all
          </Button>

          <Button
            variant="contained"
            size="large"
            startIcon={<Search />}
            type="submit"
            disabled={isSearchDisabled}
            sx={{ minWidth: 120 }}
          >
            {isLoading ? 'Searching...' : 'Search flights'}
          </Button>
        </Box>
      </SearchPaper>
    </form>
  );
};

export default FlightSearchForm;