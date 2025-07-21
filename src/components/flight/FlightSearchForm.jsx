// src/components/flight/FlightSearchForm.jsx
import React, { useState, useEffect } from 'react';
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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { styled } from '@mui/material/styles';
import { useAirports } from '../../hooks/useAirports';

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

const FlightSearchForm = ({ 
  initialValues = {}, 
  onSearch, 
  loading = false 
}) => {
  const [tripType, setTripType] = useState(initialValues.tripType || 'roundtrip');
  const [fromAirport, setFromAirport] = useState(initialValues.from || null);
  const [toAirport, setToAirport] = useState(initialValues.to || null);
  const [departureDate, setDepartureDate] = useState(initialValues.departureDate || null);
  const [returnDate, setReturnDate] = useState(initialValues.returnDate || null);
  const [passengers, setPassengers] = useState({
    adults: initialValues.adults || 1,
    children: initialValues.children || 0,
    infants: initialValues.infants || 0,
  });
  const [cabinClass, setCabinClass] = useState(initialValues.cabinClass || 'economy');
  const [showPassengerSelector, setShowPassengerSelector] = useState(false);

  const { searchAirports, loading: airportsLoading } = useAirports();
  const [airportOptions, setAirportOptions] = useState([]);
  const [fromInputValue, setFromInputValue] = useState('');
  const [toInputValue, setToInputValue] = useState('');

  // Search airports when input changes
  useEffect(() => {
    const searchFromAirports = async () => {
      if (fromInputValue.length > 2) {
        const results = await searchAirports(fromInputValue);
        setAirportOptions(results);
      }
    };
    searchFromAirports();
  }, [fromInputValue, searchAirports]);

  useEffect(() => {
    const searchToAirports = async () => {
      if (toInputValue.length > 2) {
        const results = await searchAirports(toInputValue);
        setAirportOptions(results);
      }
    };
    searchToAirports();
  }, [toInputValue, searchAirports]);

  const handleTripTypeChange = (event, newValue) => {
    setTripType(newValue);
    if (newValue === 'oneway') {
      setReturnDate(null);
    }
  };

  const handleSwapAirports = () => {
    const temp = fromAirport;
    setFromAirport(toAirport);
    setToAirport(temp);
    
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

  const handleSearch = () => {
    if (!fromAirport || !toAirport || !departureDate) {
      return;
    }

    const searchParams = {
      tripType,
      from: fromAirport,
      to: toAirport,
      departureDate,
      returnDate: tripType === 'roundtrip' ? returnDate : null,
      passengers,
      cabinClass,
    };

    onSearch && onSearch(searchParams);
  };

  const handleClear = () => {
    setFromAirport(null);
    setToAirport(null);
    setDepartureDate(null);
    setReturnDate(null);
    setPassengers({ adults: 1, children: 0, infants: 0 });
    setCabinClass('economy');
    setFromInputValue('');
    setToInputValue('');
  };

  const isSearchDisabled = !fromAirport || !toAirport || !departureDate || 
    (tripType === 'roundtrip' && !returnDate) || loading;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
              value={fromAirport}
              onChange={(event, newValue) => setFromAirport(newValue)}
              inputValue={fromInputValue}
              onInputChange={(event, newInputValue) => setFromInputValue(newInputValue)}
              options={airportOptions}
              loading={airportsLoading}
              getOptionLabel={(option) => 
                typeof option === 'string' ? option : `${option.name} (${option.code})`
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="From"
                  placeholder="Where from?"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: <FlightTakeoff sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {option.name} ({option.code})
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.city}, {option.country}
                    </Typography>
                  </Box>
                </Box>
              )}
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
              value={toAirport}
              onChange={(event, newValue) => setToAirport(newValue)}
              inputValue={toInputValue}
              onInputChange={(event, newInputValue) => setToInputValue(newInputValue)}
              options={airportOptions}
              loading={airportsLoading}
              getOptionLabel={(option) => 
                typeof option === 'string' ? option : `${option.name} (${option.code})`
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="To"
                  placeholder="Where to?"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: <FlightLand sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {option.name} ({option.code})
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.city}, {option.country}
                    </Typography>
                  </Box>
                </Box>
              )}
            />
          </Grid>

          {/* Departure Date */}
          <Grid item xs={12} md={2}>
            <DatePicker
              label="Departure"
              value={departureDate}
              onChange={setDepartureDate}
              minDate={new Date()}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              )}
            />
          </Grid>

          {/* Return Date */}
          {tripType === 'roundtrip' && (
            <Grid item xs={12} md={2}>
              <DatePicker
                label="Return"
                value={returnDate}
                onChange={setReturnDate}
                minDate={departureDate || new Date()}
                disabled={!departureDate}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                )}
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
        <Box mt={3}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Popular routes:
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {[
              { from: 'New York', to: 'London', code: 'NYC-LON' },
              { from: 'Los Angeles', to: 'Tokyo', code: 'LAX-NRT' },
              { from: 'San Francisco', to: 'Paris', code: 'SFO-CDG' },
              { from: 'Miami', to: 'Barcelona', code: 'MIA-BCN' },
            ].map((route, index) => (
              <Chip
                key={index}
                label={`${route.from} → ${route.to}`}
                variant="outlined"
                size="small"
                clickable
                onClick={() => {
                  // Set popular route (would need to match with airport data)
                  setFromInputValue(route.from);
                  setToInputValue(route.to);
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
          <Button
            startIcon={<Clear />}
            onClick={handleClear}
            variant="text"
            color="secondary"
          >
            Clear all
          </Button>

          <Button
            variant="contained"
            size="large"
            startIcon={<Search />}
            onClick={handleSearch}
            disabled={isSearchDisabled}
            loading={loading}
            sx={{ minWidth: 120 }}
          >
            {loading ? 'Searching...' : 'Search flights'}
          </Button>
        </Box>
      </SearchPaper>
    </LocalizationProvider>
  );
};

export default FlightSearchForm;