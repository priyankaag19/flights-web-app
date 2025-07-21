// src/components/flight/FlightCard.jsx
import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  Chip,
  Avatar,
  Divider,
  IconButton,
  Rating
} from '@mui/material';
import {
  FlightTakeoff,
  FlightLand,
  AccessTime,
  Person,
  FavoriteIcon,
  ShareIcon,
  InfoOutlined
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[8],
  },
}));

const PriceBox = styled(Box)(({ theme }) => ({
  textAlign: 'right',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  justifyContent: 'center',
}));

const FlightRoute = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
  '& .route-line': {
    flex: 1,
    height: '2px',
    background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      right: '-4px',
      top: '-3px',
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

const FlightCard = ({ 
  flight, 
  onSelect, 
  onFavorite, 
  onShare,
  isFavorite = false 
}) => {
  const {
    id,
    airline,
    flightNumber,
    departure,
    arrival,
    duration,
    stops,
    price,
    currency,
    aircraft,
    rating,
    amenities,
    baggage,
    isRefundable,
    carbonEmission
  } = flight;

  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString('en-US', {
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

  const getStopsText = (stops) => {
    if (stops === 0) return 'Nonstop';
    if (stops === 1) return '1 stop';
    return `${stops} stops`;
  };

  const handleCardClick = () => {
    onSelect && onSelect(flight);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onFavorite && onFavorite(id);
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    onShare && onShare(flight);
  };

  return (
    <StyledCard onClick={handleCardClick}>
      <CardContent>
        {/* Airline Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar
              src={airline.logo}
              alt={airline.name}
              sx={{ width: 32, height: 32 }}
            >
              {airline.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight={600}>
                {airline.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {flightNumber} • {aircraft}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <IconButton 
              size="small" 
              onClick={handleFavoriteClick}
              color={isFavorite ? 'error' : 'default'}
            >
              <FavoriteIcon />
            </IconButton>
            <IconButton size="small" onClick={handleShareClick}>
              <ShareIcon />
            </IconButton>
          </Box>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          {/* Flight Route */}
          <Box flex={1} mr={3}>
            <FlightRoute>
              <Box textAlign="center">
                <Typography variant="h6" fontWeight={600}>
                  {formatTime(departure.time)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {departure.airport}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {departure.city}
                </Typography>
              </Box>

              <Box flex={1} textAlign="center" position="relative">
                <div className="route-line" />
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ 
                    position: 'absolute',
                    top: '-20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {formatDuration(duration)}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ 
                    position: 'absolute',
                    bottom: '-15px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {getStopsText(stops)}
                </Typography>
              </Box>

              <Box textAlign="center">
                <Typography variant="h6" fontWeight={600}>
                  {formatTime(arrival.time)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {arrival.airport}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {arrival.city}
                </Typography>
              </Box>
            </FlightRoute>

            {/* Flight Details */}
            <Box display="flex" gap={1} mt={2} flexWrap="wrap">
              {rating && (
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Rating value={rating} size="small" readOnly />
                  <Typography variant="caption">({rating})</Typography>
                </Box>
              )}
              
              {isRefundable && (
                <Chip 
                  label="Refundable" 
                  size="small" 
                  variant="outlined" 
                  color="success" 
                />
              )}

              {baggage?.included && (
                <Chip 
                  label={`${baggage.weight}kg included`} 
                  size="small" 
                  variant="outlined" 
                />
              )}

              {carbonEmission && (
                <Chip 
                  label={`${carbonEmission}kg CO₂`} 
                  size="small" 
                  variant="outlined" 
                  color="info" 
                />
              )}
            </Box>

            {/* Amenities */}
            {amenities && amenities.length > 0 && (
              <Box display="flex" gap={1} mt={1} flexWrap="wrap">
                {amenities.slice(0, 3).map((amenity, index) => (
                  <Typography key={index} variant="caption" color="text.secondary">
                    • {amenity}
                  </Typography>
                ))}
                {amenities.length > 3 && (
                  <Typography variant="caption" color="primary">
                    +{amenities.length - 3} more
                  </Typography>
                )}
              </Box>
            )}
          </Box>

          {/* Price Section */}
          <PriceBox>
            <Typography variant="h5" fontWeight={700} color="primary">
              {currency}{price.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              per person
            </Typography>
            {price < 500 && (
              <Chip 
                label="Great Deal!" 
                size="small" 
                color="success" 
                variant="outlined"
                sx={{ mt: 1 }}
              />
            )}
          </PriceBox>
        </Box>
      </CardContent>

      <Divider />

      <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
        <Button 
          startIcon={<InfoOutlined />}
          variant="text" 
          size="small"
        >
          View Details
        </Button>
        <Button 
          variant="contained" 
          color="primary"
          size="medium"
          sx={{ minWidth: 120 }}
        >
          Select Flight
        </Button>
      </CardActions>
    </StyledCard>
  );
};

export default FlightCard;