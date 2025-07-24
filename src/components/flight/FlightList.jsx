import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Pagination,
  Skeleton,
  Alert,
  Chip,
  Button
} from '@mui/material';
import {
  ViewList,
  ViewModule,
  Sort,
  TrendingUp,
  Schedule,
  Star,
  LocalOffer
} from '@mui/icons-material';
import FlightCard from './FlightCard';
import { styled } from '@mui/material/styles';

const SortControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.shape.borderRadius,
  flexWrap: 'wrap',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: theme.spacing(1),
  },
}));

const ResultsSummary = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(2),
  flexWrap: 'wrap',
  gap: theme.spacing(1),
}));

const FlightList = ({
  flights = [],
  loading = false,
  error = null,
  filters = {},
  searchParams = {},
  onFlightSelect,
  onFlightFavorite,
  onFlightShare
}) => {
  const [sortBy, setSortBy] = useState('price');
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState(new Set());

  const itemsPerPage = 20;

  // Sort flights
  const sortedFlights = useMemo(() => {
    if (!flights.length) return [];

    return [...flights].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'duration':
          return a.duration - b.duration;
        case 'departure':
          return new Date(a.departure.time) - new Date(b.departure.time);
        case 'arrival':
          return new Date(a.arrival.time) - new Date(b.arrival.time);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'stops':
          return a.stops - b.stops;
        default:
          return 0;
      }
    });
  }, [flights, sortBy]);

  // Filter flights
  const filteredFlights = useMemo(() => {
    return sortedFlights.filter(flight => {
      // Price filter
      if (filters.priceRange) {
        const [minPrice, maxPrice] = filters.priceRange;
        if (flight.price < minPrice || flight.price > maxPrice) return false;
      }

      // Duration filter
      if (filters.durationRange) {
        const [minDuration, maxDuration] = filters.durationRange;
        if (flight.duration < minDuration || flight.duration > maxDuration) return false;
      }

      // Stops filter
      if (filters.stops && filters.stops.length > 0) {
        if (!filters.stops.includes(flight.stops)) return false;
      }

      // Airlines filter
      if (filters.airlines && filters.airlines.length > 0) {
        if (!filters.airlines.includes(flight.airline.code)) return false;
      }

      // Amenities filter
      if (filters.amenities && filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity =>
          flight.amenities?.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }

      // Rating filter
      if (filters.rating && (flight.rating || 0) < filters.rating) {
        return false;
      }

      // Departure time filter
      if (filters.departureTime) {
        const hour = new Date(flight.departure.time).getHours();
        switch (filters.departureTime) {
          case 'morning':
            if (hour < 6 || hour >= 12) return false;
            break;
          case 'afternoon':
            if (hour < 12 || hour >= 18) return false;
            break;
          case 'evening':
            if (hour < 18 || hour >= 24) return false;
            break;
          case 'night':
            if (hour >= 6) return false;
            break;
        }
      }

      return true;
    });
  }, [sortedFlights, filters]);

  // Pagination
  const paginatedFlights = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredFlights.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredFlights, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredFlights.length / itemsPerPage);

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setCurrentPage(1);
  };

  const handleViewModeChange = (event, newViewMode) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFlightFavorite = (flightId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(flightId)) {
        newFavorites.delete(flightId);
      } else {
        newFavorites.add(flightId);
      }
      return newFavorites;
    });
    onFlightFavorite && onFlightFavorite(flightId);
  };

  const getSortIcon = (sortType) => {
    switch (sortType) {
      case 'price':
        return <LocalOffer fontSize="small" />;
      case 'duration':
        return <Schedule fontSize="small" />;
      case 'rating':
        return <Star fontSize="small" />;
      case 'departure':
      case 'arrival':
        return <TrendingUp fontSize="small" />;
      default:
        return <Sort fontSize="small" />;
    }
  };

  const formatRouteText = (searchParams) => {
    if (!searchParams.from || !searchParams.to) return '';
    return `${searchParams.from} → ${searchParams.to}`;
  };

  // Loading state
  if (loading) {
    return (
      <Box>
        <SortControls>
          <Skeleton variant="rectangular" width={200} height={40} />
          <Skeleton variant="rectangular" width={150} height={40} />
        </SortControls>
        {Array.from(new Array(5)).map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            height={200}
            sx={{ mb: 2, borderRadius: 1 }}
          />
        ))}
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  // No results
  if (!loading && filteredFlights.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" gutterBottom>
          No flights found
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Try adjusting your search criteria or filters
        </Typography>
        <Button variant="outlined" onClick={() => window.location.reload()}>
          Reset Search
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Results Summary */}
      <ResultsSummary>
        <Box>
          <Typography variant="h6">
            {filteredFlights.length} flights found
          </Typography>
          {searchParams.from && searchParams.to && (
            <Typography variant="body2" color="text.secondary">
              {formatRouteText(searchParams)} • {searchParams.departureDate}
              {searchParams.returnDate && ` • ${searchParams.returnDate}`}
            </Typography>
          )}
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <Chip
            label={`Page ${currentPage} of ${totalPages}`}
            size="small"
            variant="outlined"
          />
        </Box>
      </ResultsSummary>

      {/* Sort Controls */}
      <SortControls>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortBy}
            onChange={handleSortChange}
            label="Sort by"
            startAdornment={getSortIcon(sortBy)}
          >
            <MenuItem value="price">
              <Box display="flex" alignItems="center" gap={1}>
                <LocalOffer fontSize="small" />
                Price (Low to High)
              </Box>
            </MenuItem>
            <MenuItem value="duration">
              <Box display="flex" alignItems="center" gap={1}>
                <Schedule fontSize="small" />
                Duration (Shortest)
              </Box>
            </MenuItem>
            <MenuItem value="departure">
              <Box display="flex" alignItems="center" gap={1}>
                <TrendingUp fontSize="small" />
                Departure Time
              </Box>
            </MenuItem>
            <MenuItem value="arrival">
              <Box display="flex" alignItems="center" gap={1}>
                <TrendingUp fontSize="small" />
                Arrival Time
              </Box>
            </MenuItem>
            <MenuItem value="rating">
              <Box display="flex" alignItems="center" gap={1}>
                <Star fontSize="small" />
                Rating (High to Low)
              </Box>
            </MenuItem>
            <MenuItem value="stops">
              <Box display="flex" alignItems="center" gap={1}>
                <Sort fontSize="small" />
                Stops (Fewest)
              </Box>
            </MenuItem>
          </Select>
        </FormControl>

        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          size="small"
        >
          <ToggleButton value="list" aria-label="list view">
            <ViewList />
          </ToggleButton>
          <ToggleButton value="grid" aria-label="grid view">
            <ViewModule />
          </ToggleButton>
        </ToggleButtonGroup>

        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2" color="text.secondary">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredFlights.length)} - {Math.min(currentPage * itemsPerPage, filteredFlights.length)} of {filteredFlights.length}
          </Typography>
        </Box>
      </SortControls>

      {/* Flight Cards */}
      <Box>
        {paginatedFlights.map((flight) => (
          <FlightCard
            key={flight.id}
            flight={flight}
            onSelect={onFlightSelect}
            onFavorite={handleFlightFavorite}
            onShare={onFlightShare}
            isFavorite={favorites.has(flight.id)}
          />
        ))}
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
};

export default FlightList;