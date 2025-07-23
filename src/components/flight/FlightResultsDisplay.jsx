import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Grid,
  Slider,
  Collapse,
  IconButton,
  Divider,
  Paper,
  CircularProgress,
  Alert,
  Container,
  Stack,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  ArrowBack,
  Flight,
  FilterList,
  Schedule,
  AttachMoney,
  FlightTakeoff,
  FlightLand,
  AccessTime,
  Stop,
  Star,
  ExpandMore,
  ExpandLess,
  ClearAll // Add this import for clear icon
} from '@mui/icons-material';
import { useFlightContext } from '../../context/FlightContext';


const FlightResultsDisplay = () => {
  const navigate = useNavigate(); // Add this hook
  const {
    flights,
    loading,
    error,
    searchParams,
    clearSearch,
    searchPerformed,
  } = useFlightContext();

  const [sortBy, setSortBy] = useState('price');
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 50000]);

  // Helper function to safely format dates
  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch (e) {
      return 'N/A';
    }
  };

  // Helper function to format duration
  const formatDuration = (minutes) => {
    if (!minutes || minutes === 0) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Helper function to get airport info safely
  const getAirportInfo = (segment, type) => {
    if (!segment) return { iata: 'N/A', city: 'N/A', name: 'N/A' };

    const location = type === 'origin' ? segment.origin : segment.destination;
    if (!location) return { iata: 'N/A', city: 'N/A', name: 'N/A' };

    return {
      iata: location.displayCode || location.flightPlaceId || 'N/A',
      city: location.parent?.name || location.name || 'N/A',
      name: location.name || 'N/A'
    };
  };

  // Transform flight data to match component expectations
  const transformedFlights = useMemo(() => {
    return flights.map(flight => {
      // Handle the case where flight might have segments array or direct properties
      const firstSegment = flight.segments?.[0] || flight;
      const lastSegment = flight.segments?.[flight.segments.length - 1] || flight;

      const origin = getAirportInfo(firstSegment, 'origin');
      const destination = getAirportInfo(lastSegment, 'destination');

      return {
        id: flight.id,
        airline: flight.airline || flight.carrierName || 'Unknown Airline',
        price: {
          amount: flight.price?.amount || 0,
          formatted: flight.price?.amount ? `₹${Math.round(flight.price.amount).toLocaleString()}` : 'N/A'
        },
        outbound: {
          flightNumber: flight.flightNumber || firstSegment?.flightNumber || 'N/A',
          from: {
            iata: origin.iata,
            city: origin.city,
            name: origin.name
          },
          to: {
            iata: destination.iata,
            city: destination.city,
            name: destination.name
          },
          departure: flight.departure?.time || firstSegment?.departure || null,
          arrival: flight.arrival?.time || lastSegment?.arrival || null,
          durationInMinutes: flight.durationInMinutes || 0,
          stops: flight.stops ?? 0
        },
        // Add additional fields for booking page
        rating: 4.2, // You can make this dynamic based on your data
        duration: flight.durationInMinutes || 0,
        origin: origin.iata,
        destination: destination.iata,
        departure: flight.departure?.time || firstSegment?.departure || null,
        arrival: flight.arrival?.time || lastSegment?.arrival || null,
        stops: flight.stops ?? 0
      };
    });
  }, [flights]);

  const { minPrice, maxPrice } = useMemo(() => {
    const prices = transformedFlights
      .map((f) => f.price?.amount || 0)
      .filter((p) => p > 0);
    return {
      minPrice: prices.length ? Math.min(...prices) : 0,
      maxPrice: prices.length ? Math.max(...prices) : 50000,
    };
  }, [transformedFlights]);

  useEffect(() => {
    if (transformedFlights.length) {
      setPriceRange([minPrice, maxPrice]);
    }
  }, [minPrice, maxPrice, transformedFlights]);

  if (!searchPerformed) return null;

  const sortedFlights = [...transformedFlights].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return (a.price?.amount || 0) - (b.price?.amount || 0);
      case 'duration':
        return (a.outbound?.durationInMinutes || 0) - (b.outbound?.durationInMinutes || 0);
      case 'departure':
        { const dateA = new Date(a.outbound?.departure || 0);
        const dateB = new Date(b.outbound?.departure || 0);
        return dateA - dateB; }
      default:
        return 0;
    }
  });

  const filteredFlights = sortedFlights.filter((flight) => {
    const price = flight.price?.amount || 0;
    return price >= priceRange[0] && price <= priceRange[1];
  });

  const handleBack = () => {
    clearSearch();
    // navigate('/'); // Uncomment if using React Router
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  // Add clear filters function
  const handleClearFilters = () => {
    setPriceRange([minPrice, maxPrice]);
    setSortBy('price');
  };

  // Add select flight function
  const handleSelectFlight = (flight) => {
    navigate('/booking', {
      state: {
        flight: {
          ...flight,
          price: flight.price?.amount || 0
        },
        searchParams
      }
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{ mb: 2 }}
          variant="text"
          color="primary"
        >
          Back to Search
        </Button>

        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Flight Results
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {searchParams?.from?.name || searchParams?.from || 'Paris'} → {searchParams?.to?.name || searchParams?.to || 'London'}
          {searchParams?.departureDate && ` • ${new Date(searchParams.departureDate).toLocaleDateString()}`}
        </Typography>
      </Box>

      {/* Controls */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                label="Sort by"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="price">Price</MenuItem>
                <MenuItem value="duration">Duration</MenuItem>
                <MenuItem value="departure">Departure Time</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Button
              startIcon={<FilterList />}
              onClick={() => setFilterOpen(!filterOpen)}
              variant="outlined"
              endIcon={filterOpen ? <ExpandLess /> : <ExpandMore />}
            >
              Filters
            </Button>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Button
              startIcon={<ClearAll />}
              onClick={handleClearFilters}
              variant="outlined"
              color="secondary"
            >
              Clear Filters
            </Button>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="text.secondary" textAlign={{ xs: 'left', md: 'right' }}>
              {filteredFlights.length} of {transformedFlights.length} flight(s) found
            </Typography>
          </Grid>
        </Grid>

        <Collapse in={filterOpen}>
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography gutterBottom>
              Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
            </Typography>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={minPrice}
              max={maxPrice}
              step={500}
              valueLabelFormat={(value) => `₹${value.toLocaleString()}`}
            />
          </Box>
        </Collapse>
      </Paper>

      {/* Loading */}
      {loading && (
        <Box textAlign="center" py={8}>
          <CircularProgress size={48} />
          <Typography variant="h6" sx={{ mt: 2 }} color="text.secondary">
            Searching for flights...
          </Typography>
        </Box>
      )}

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* No Results */}
      {!loading && !error && filteredFlights.length === 0 && (
        <Paper sx={{ p: 8, textAlign: 'center' }}>
          <Flight sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No flights match your filters
          </Typography>
          <Button
            onClick={handleClearFilters}
            variant="outlined"
            sx={{ mt: 2 }}
            startIcon={<ClearAll />}
          >
            Clear Filters to Show All Flights
          </Button>
        </Paper>
      )}

      {/* Flight Results */}
      <Stack spacing={2}>
        {filteredFlights.map((flight, index) => {
          const outbound = flight.outbound;
          return (
            <Card key={flight.id || index} elevation={2} sx={{
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                elevation: 4,
                transform: 'translateY(-2px)'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={3} alignItems="center">
                  {/* Flight Info */}
                  <Grid item xs={12} md={8}>
                    <Stack spacing={2}>
                      {/* Airline & Flight Number */}
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                          <Flight fontSize="small" />
                        </Avatar>
                        <Typography variant="h6" color="primary.main" fontWeight="bold">
                          {flight.airline}
                        </Typography>
                        <Chip label={outbound?.flightNumber || 'N/A'} size="small" variant="outlined" />
                      </Box>

                      {/* Route */}
                      <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                        <Box textAlign="center">
                          <Typography variant="h5" fontWeight="bold">
                            {formatTime(outbound?.departure)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {outbound?.from?.iata || 'N/A'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {outbound?.from?.city || 'N/A'}
                          </Typography>
                        </Box>

                        <Box sx={{ flex: 1, textAlign: 'center', minWidth: 120 }}>
                          <Typography variant="body2" color="text.secondary">
                            {formatDuration(outbound?.durationInMinutes)}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 1 }}>
                            <FlightTakeoff fontSize="small" color="action" />
                            <Box sx={{ height: 2, bgcolor: 'grey.300', flex: 1, mx: 1 }} />
                            <FlightLand fontSize="small" color="action" />
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {outbound?.stops === 0 ? 'Non-stop' : `${outbound?.stops} stop(s)`}
                          </Typography>
                        </Box>

                        <Box textAlign="center">
                          <Typography variant="h5" fontWeight="bold">
                            {formatTime(outbound?.arrival)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {outbound?.to?.iata || 'N/A'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {outbound?.to?.city || 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </Grid>

                  {/* Price & Select */}
                  <Grid item xs={12} md={4}>
                    <Box textAlign={{ xs: 'left', md: 'right' }}>
                      <Typography variant="h4" color="success.main" fontWeight="bold">
                        {flight.price?.formatted || 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        per person
                      </Typography>
                      <Button
                        variant="contained"
                        size="large"
                        fullWidth={{ xs: true, md: false }}
                        sx={{ minWidth: 140 }}
                        onClick={() => handleSelectFlight(flight)}
                      >
                        Select Flight
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Container>
  );
};

export default FlightResultsDisplay;