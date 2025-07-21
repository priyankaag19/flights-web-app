// src/pages/SearchResults.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Rating,
  Divider,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  IconButton,
  Collapse
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  FlightTakeoff,
  FlightLand,
  AccessTime,
  SwapHoriz,
  FilterList,
  Sort,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import FlightSearchForm from '../components/search/FlightSearchForm';
import { FlightService } from '../services/flightService';

const ResultsContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.grey[50],
}));

const SearchHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(1),
}));

const FlightCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'translateY(-2px)',
  },
}));

const AirlineAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  backgroundColor: theme.palette.primary.main,
}));

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('price');
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams, setSearchParams] = useState({});

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const params = Object.fromEntries(urlParams.entries());
    setSearchParams(params);
    searchFlights(params);
  }, [location.search]);

  const searchFlights = async (params) => {
    setLoading(true);
    setError(null);

    try {
      const results = await FlightService.searchFlights(params);
      setFlights(results);
    } catch (err) {
      setError(err.message);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (event) => {
    const sortValue = event.target.value;
    setSortBy(sortValue);
    
    const sortedFlights = [...flights].sort((a, b) => {
      switch (sortValue) {
        case 'price':
          return a.price - b.price;
        case 'duration':
          return a.duration - b.duration;
        case 'departure':
          return new Date(a.departure) - new Date(b.departure);
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
    setFlights(sortedFlights);
  };

  const handleFlightSelect = (flight) => {
    navigate('/booking', { state: { flight, searchParams } });
  };

  const handleNewSearch = (newSearchData) => {
    const params = new URLSearchParams(newSearchData);
    navigate(`/search?${params.toString()}`);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
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

  if (loading) {
    return (
      <ResultsContainer>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <Box textAlign="center">
              <CircularProgress size={60} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Searching for the best flights...
              </Typography>
            </Box>
          </Box>
        </Container>
      </ResultsContainer>
    );
  }

  return (
    <ResultsContainer>
      <Container maxWidth="lg" sx={{ py: 2 }}>
        {/* Search Form Header */}
        <SearchHeader elevation={2}>
          <FlightSearchForm 
            onSearch={handleNewSearch} 
            initialData={searchParams}
            compact={true}
          />
        </SearchHeader>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Results Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" component="h1">
            {flights.length > 0 ? `${flights.length} flights found` : 'No flights found'}
          </Typography>
          
          <Box display="flex" gap={2} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                onChange={handleSortChange}
                label="Sort by"
              >
                <MenuItem value="price">Price</MenuItem>
                <MenuItem value="duration">Duration</MenuItem>
                <MenuItem value="departure">Departure</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
              </Select>
            </FormControl>
            
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
          </Box>
        </Box>

        {/* Filters Panel */}
        <Collapse in={showFilters}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Filter Results
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Airline</InputLabel>
                  <Select label="Airline">
                    <MenuItem value="">All Airlines</MenuItem>
                    <MenuItem value="indigo">IndiGo</MenuItem>
                    <MenuItem value="spicejet">SpiceJet</MenuItem>
                    <MenuItem value="airindia">Air India</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Stops</InputLabel>
                  <Select label="Stops">
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="nonstop">Non-stop</MenuItem>
                    <MenuItem value="1stop">1 Stop</MenuItem>
                    <MenuItem value="2+stops">2+ Stops</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Price Range</InputLabel>
                  <Select label="Price Range">
                    <MenuItem value="">All Prices</MenuItem>
                    <MenuItem value="0-10000">Under ₹10,000</MenuItem>
                    <MenuItem value="10000-25000">₹10,000 - ₹25,000</MenuItem>
                    <MenuItem value="25000+">Above ₹25,000</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Duration</InputLabel>
                  <Select label="Duration">
                    <MenuItem value="">All Durations</MenuItem>
                    <MenuItem value="0-2">Under 2h</MenuItem>
                    <MenuItem value="2-5">2h - 5h</MenuItem>
                    <MenuItem value="5+">Above 5h</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Collapse>

        {/* Flight Results */}
        <Box>
          {flights.map((flight, index) => (
            <FlightCard key={index} onClick={() => handleFlightSelect(flight)}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  {/* Airline Info */}
                  <Grid item xs={12} sm={2}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                      <AirlineAvatar>
                        {flight.airline.charAt(0)}
                      </AirlineAvatar>
                      <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                        {flight.airline}
                      </Typography>
                      <Rating value={flight.rating} size="small" readOnly />
                    </Box>
                  </Grid>

                  {/* Flight Times */}
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box textAlign="center">
                        <Typography variant="h6" fontWeight="bold">
                          {formatTime(flight.departure)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {flight.origin}
                        </Typography>
                      </Box>

                      <Box textAlign="center" flex={1} mx={2}>
                        <Typography variant="body2" color="text.secondary">
                          {formatDuration(flight.duration)}
                        </Typography>
                        <Box display="flex" alignItems="center" justifyContent="center" my={1}>
                          <FlightTakeoff fontSize="small" color="action" />
                          <Box 
                            sx={{ 
                              borderTop: 1, 
                              borderColor: 'divider', 
                              flex: 1, 
                              mx: 1 
                            }} 
                          />
                          <FlightLand fontSize="small" color="action" />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
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
                  </Grid>

                  {/* Price and Action */}
                  <Grid item xs={12} sm={4}>
                    <Box display="flex" flexDirection="column" alignItems="flex-end" height="100%">
                      <Typography variant="h5" color="primary" fontWeight="bold">
                        {formatPrice(flight.price)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        per person
                      </Typography>
                      
                      <Box mt={2} display="flex" gap={1} flexWrap="wrap">
                        {flight.amenities?.wifi && (
                          <Chip label="WiFi" size="small" variant="outlined" />
                        )}
                        {flight.amenities?.meals && (
                          <Chip label="Meals" size="small" variant="outlined" />
                        )}
                        {flight.amenities?.entertainment && (
                          <Chip label="Entertainment" size="small" variant="outlined" />
                        )}
                      </Box>

                      <Button
                        variant="contained"
                        sx={{ mt: 2, minWidth: 120 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFlightSelect(flight);
                        }}
                      >
                        Select Flight
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </FlightCard>
          ))}
        </Box>

        {flights.length === 0 && !loading && (
          <Box textAlign="center" py={8}>
            <FlightTakeoff sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No flights found
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
              Try adjusting your search criteria or dates
            </Typography>
            <Button 
              variant="outlined" 
              onClick={() => setShowFilters(true)}
            >
              Modify Search
            </Button>
          </Box>
        )}
      </Container>
    </ResultsContainer>
  );
};

export default SearchResults;