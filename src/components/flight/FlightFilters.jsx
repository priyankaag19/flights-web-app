// src/components/flight/FlightFilters.jsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Slider,
  FormControlLabel,
  Checkbox,
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Rating
} from '@mui/material';
import {
  ExpandMore,
  FilterList,
  Clear
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const FilterCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiAccordion-root': {
    boxShadow: 'none',
    '&:before': {
      display: 'none',
    },
  },
  '& .MuiAccordionSummary-root': {
    padding: theme.spacing(1, 2),
    '&.Mui-expanded': {
      minHeight: 48,
    },
  },
  '& .MuiAccordionDetails-root': {
    padding: theme.spacing(0, 2, 2, 2),
  },
}));

const FlightFilters = ({ filters, onFiltersChange, onClearAll }) => {
  const [expanded, setExpanded] = useState({
    price: true,
    stops: true,
    airlines: true,
    departure: false,
    duration: false,
    amenities: false,
  });

  const handleExpandChange = (panel) => (event, isExpanded) => {
    setExpanded(prev => ({
      ...prev,
      [panel]: isExpanded
    }));
  };

  const handleFilterChange = (filterType, value) => {
    onFiltersChange({
      ...filters,
      [filterType]: value
    });
  };

  const handlePriceChange = (event, newValue) => {
    handleFilterChange('priceRange', newValue);
  };

  const handleDurationChange = (event, newValue) => {
    handleFilterChange('durationRange', newValue);
  };

  const handleStopsChange = (stops) => {
    const currentStops = filters.stops || [];
    const newStops = currentStops.includes(stops)
      ? currentStops.filter(s => s !== stops)
      : [...currentStops, stops];
    handleFilterChange('stops', newStops);
  };

  const handleAirlineChange = (airline) => {
    const currentAirlines = filters.airlines || [];
    const newAirlines = currentAirlines.includes(airline)
      ? currentAirlines.filter(a => a !== airline)
      : [...currentAirlines, airline];
    handleFilterChange('airlines', newAirlines);
  };

  const handleAmenityChange = (amenity) => {
    const currentAmenities = filters.amenities || [];
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    handleFilterChange('amenities', newAmenities);
  };

  const formatPrice = (value) => `$${value}`;
  const formatDuration = (value) => `${Math.floor(value / 60)}h ${value % 60}m`;

  const airlines = [
    { code: 'AA', name: 'American Airlines' },
    { code: 'DL', name: 'Delta Airlines' },
    { code: 'UA', name: 'United Airlines' },
    { code: 'SW', name: 'Southwest Airlines' },
    { code: 'JB', name: 'JetBlue Airways' },
    { code: 'AS', name: 'Alaska Airlines' },
  ];

  const amenitiesList = [
    'Wi-Fi',
    'Power outlets',
    'Entertainment',
    'Meals included',
    'Extra legroom',
    'Priority boarding',
    'Lie-flat seats',
    'Lounge access'
  ];

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.stops?.length > 0) count++;
    if (filters.airlines?.length > 0) count++;
    if (filters.amenities?.length > 0) count++;
    if (filters.priceRange && (filters.priceRange[0] > 0 || filters.priceRange[1] < 2000)) count++;
    if (filters.durationRange && (filters.durationRange[0] > 0 || filters.durationRange[1] < 1440)) count++;
    if (filters.departureTime) count++;
    if (filters.arrivalTime) count++;
    if (filters.rating && filters.rating > 0) count++;
    return count;
  };

  return (
    <Box>
      {/* Filter Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <FilterList />
          <Typography variant="h6">Filters</Typography>
          {getActiveFiltersCount() > 0 && (
            <Chip 
              label={getActiveFiltersCount()} 
              size="small" 
              color="primary" 
            />
          )}
        </Box>
        <Button 
          startIcon={<Clear />}
          onClick={onClearAll}
          size="small"
          variant="text"
        >
          Clear all
        </Button>
      </Box>

      <FilterCard>
        {/* Price Range */}
        <Accordion 
          expanded={expanded.price} 
          onChange={handleExpandChange('price')}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle2" fontWeight={600}>
              Price Range
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box px={1}>
              <Slider
                value={filters.priceRange || [0, 2000]}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                valueLabelFormat={formatPrice}
                min={0}
                max={2000}
                step={50}
                marks={[
                  { value: 0, label: '$0' },
                  { value: 500, label: '$500' },
                  { value: 1000, label: '$1000' },
                  { value: 1500, label: '$1500' },
                  { value: 2000, label: '$2000+' },
                ]}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        <Divider />

        {/* Stops */}
        <Accordion 
          expanded={expanded.stops} 
          onChange={handleExpandChange('stops')}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle2" fontWeight={600}>
              Stops
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {[
                { value: 0, label: 'Nonstop', count: 12 },
                { value: 1, label: '1 stop', count: 24 },
                { value: 2, label: '2+ stops', count: 8 },
              ].map(({ value, label, count }) => (
                <FormControlLabel
                  key={value}
                  control={
                    <Checkbox
                      checked={filters.stops?.includes(value) || false}
                      onChange={() => handleStopsChange(value)}
                    />
                  }
                  label={
                    <Box display="flex" justifyContent="space-between" width="100%">
                      <Typography variant="body2">{label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        ({count})
                      </Typography>
                    </Box>
                  }
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>

        <Divider />

        {/* Airlines */}
        <Accordion 
          expanded={expanded.airlines} 
          onChange={handleExpandChange('airlines')}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle2" fontWeight={600}>
              Airlines
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {airlines.map(({ code, name }) => (
                <FormControlLabel
                  key={code}
                  control={
                    <Checkbox
                      checked={filters.airlines?.includes(code) || false}
                      onChange={() => handleAirlineChange(code)}
                    />
                  }
                  label={
                    <Box display="flex" justifyContent="space-between" width="100%">
                      <Typography variant="body2">{name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        ({code})
                      </Typography>
                    </Box>
                  }
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>

        <Divider />

        {/* Departure Time */}
        <Accordion 
          expanded={expanded.departure} 
          onChange={handleExpandChange('departure')}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle2" fontWeight={600}>
              Departure Time
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth size="small">
              <InputLabel>Departure Time</InputLabel>
              <Select
                value={filters.departureTime || ''}
                onChange={(e) => handleFilterChange('departureTime', e.target.value)}
                label="Departure Time"
              >
                <MenuItem value="">Any time</MenuItem>
                <MenuItem value="morning">Morning (6AM - 12PM)</MenuItem>
                <MenuItem value="afternoon">Afternoon (12PM - 6PM)</MenuItem>
                <MenuItem value="evening">Evening (6PM - 12AM)</MenuItem>
                <MenuItem value="night">Night (12AM - 6AM)</MenuItem>
              </Select>
            </FormControl>
          </AccordionDetails>
        </Accordion>

        <Divider />

        {/* Flight Duration */}
        <Accordion 
          expanded={expanded.duration} 
          onChange={handleExpandChange('duration')}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle2" fontWeight={600}>
              Flight Duration
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box px={1}>
              <Slider
                value={filters.durationRange || [0, 1440]}
                onChange={handleDurationChange}
                valueLabelDisplay="auto"
                valueLabelFormat={formatDuration}
                min={0}
                max={1440}
                step={30}
                marks={[
                  { value: 0, label: '0h' },
                  { value: 360, label: '6h' },
                  { value: 720, label: '12h' },
                  { value: 1080, label: '18h' },
                  { value: 1440, label: '24h+' },
                ]}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        <Divider />

        {/* Amenities */}
        <Accordion 
          expanded={expanded.amenities} 
          onChange={handleExpandChange('amenities')}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle2" fontWeight={600}>
              Amenities
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {amenitiesList.map((amenity) => (
                <FormControlLabel
                  key={amenity}
                  control={
                    <Checkbox
                      checked={filters.amenities?.includes(amenity) || false}
                      onChange={() => handleAmenityChange(amenity)}
                    />
                  }
                  label={<Typography variant="body2">{amenity}</Typography>}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>

        <Divider />

        {/* Rating */}
        <Box p={2}>
          <Typography variant="subtitle2" fontWeight={600} mb={2}>
            Minimum Rating
          </Typography>
          <Rating
            value={filters.rating || 0}
            onChange={(event, newValue) => {
              handleFilterChange('rating', newValue);
            }}
            precision={0.5}
          />
        </Box>
      </FilterCard>
    </Box>
  );
};

export default FlightFilters;