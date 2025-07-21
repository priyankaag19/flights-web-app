import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

// Mock flight data
const MOCK_FLIGHTS = [
  {
    id: '1',
    airline: 'Air India',
    flightNumber: 'AI 131',
    aircraft: 'Boeing 737',
    origin: { code: 'BOM', name: 'Mumbai', time: '14:30' },
    destination: { code: 'DEL', name: 'New Delhi', time: '17:15' },
    duration: 165, // minutes
    stops: 0,
    price: 8450,
    currency: 'INR',
    rating: 4.2,
    baggage: '15 kg',
    amenities: ['WiFi', 'Meal'],
  },
  {
    id: '2',
    airline: 'IndiGo',
    flightNumber: '6E 345',
    aircraft: 'Airbus A320',
    origin: { code: 'BOM', name: 'Mumbai', time: '16:20' },
    destination: { code: 'DEL', name: 'New Delhi', time: '19:05' },
    duration: 165,
    stops: 0,
    price: 7890,
    currency: 'INR',
    rating: 4.0,
    baggage: '15 kg',
    amenities: ['WiFi'],
  },
  {
    id: '3',
    airline: 'Vistara',
    flightNumber: 'UK 987',
    aircraft: 'Airbus A321',
    origin: { code: 'BOM', name: 'Mumbai', time: '18:45' },
    destination: { code: 'DEL', name: 'New Delhi', time: '21:30' },
    duration: 165,
    stops: 0,
    price: 9200,
    currency: 'INR',
    rating: 4.5,
    baggage: '20 kg',
    amenities: ['WiFi', 'Meal', 'Entertainment'],
  }
];

export class FlightService {
  static async searchFlights(searchParams) {
    try {
      // For demo purposes, using mock data with delay
      return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_FLIGHTS), 2000);
      });

      // Actual API call (uncomment when ready)
      // const response = await api.get(API_ENDPOINTS.SEARCH_FLIGHTS, {
      //   params: {
      //     originSkyId: searchParams.from.skyId,
      //     destinationSkyId: searchParams.to.skyId,
      //     originEntityId: searchParams.from.entityId,
      //     destinationEntityId: searchParams.to.entityId,
      //     date: searchParams.departDate,
      //     returnDate: searchParams.returnDate,
      //     adults: searchParams.passengers,
      //     cabinClass: searchParams.cabinClass,
      //   }
      // });
      // return response.data;
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
          return b.rating - a.rating;
        case 'departure':
          return a.origin.time.localeCompare(b.origin.time);
        case 'arrival':
          return a.destination.time.localeCompare(b.destination.time);
        default:
          return 0;
      }
    });
  }

  static filterFlights(flights, filters) {
    return flights.filter(flight => {
      // Price filter
      if (flight.price < filters.priceRange[0] || flight.price > filters.priceRange[1]) {
        return false;
      }

      // Stops filter
      if (filters.stops.length > 0 && !filters.stops.includes(flight.stops)) {
        return false;
      }

      // Airlines filter
      if (filters.airlines.length > 0 && !filters.airlines.includes(flight.airline)) {
        return false;
      }

      return true;
    });
  }
}