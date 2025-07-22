// src/services/FlightService.js
import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export class FlightService {
  static async searchFlights(searchParams) {
    try {
      const isRoundTrip = searchParams.tripType === 'roundtrip' && searchParams.returnDate;

      const endpoint = isRoundTrip
        ? '/flights/search-roundtrip'
        : '/flights/search-one-way';

      const response = await api.get(endpoint, {
        params: {
          fromEntityId: searchParams.from.entityId,
          toEntityId: searchParams.to.entityId,
          departDate: searchParams.departDate,
          returnDate: isRoundTrip ? searchParams.returnDate : undefined,
          adults: searchParams.passengers?.adults || 1,
          children: searchParams.passengers?.children || 0,
          infants: searchParams.passengers?.infants || 0,
          cabinClass: searchParams.cabinClass || 'economy'
        }
      });

      // This depends on how your API returns flights
      return response.data?.data || response.data?.legs || [];
    } catch (error) {
      throw new Error('Failed to search flights');
    }
  }

  static sortFlights(flights, sortBy) {
    return [...flights].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'duration':
          return a.duration - b.duration;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'departure':
          return new Date(a.departure?.time) - new Date(b.departure?.time);
        case 'arrival':
          return new Date(a.arrival?.time) - new Date(b.arrival?.time);
        default:
          return 0;
      }
    });
  }

  static filterFlights(flights, filters) {
    return flights.filter(flight => {
      // Price Range
      if (
        filters.priceRange &&
        (flight.price < filters.priceRange[0] || flight.price > filters.priceRange[1])
      ) return false;

      // Stops
      if (
        filters.stops?.length &&
        !filters.stops.includes(flight.stops)
      ) return false;

      // Airline Code
      if (
        filters.airlines?.length &&
        !filters.airlines.includes(flight.airline?.code)
      ) return false;

      // Rating
      if (filters.rating && (flight.rating || 0) < filters.rating) return false;

      // Amenities
      if (
        filters.amenities?.length &&
        !filters.amenities.every(a => flight.amenities?.includes(a))
      ) return false;

      // Duration
      if (
        filters.durationRange &&
        (flight.duration < filters.durationRange[0] || flight.duration > filters.durationRange[1])
      ) return false;

      // Departure Time
      if (filters.departureTime) {
        const hour = new Date(flight.departure?.time).getHours();
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
  }
}
