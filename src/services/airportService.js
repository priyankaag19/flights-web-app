import api from './api';
import { API_ENDPOINTS, MOCK_AIRPORTS } from '../utils/constants';

export class AirportService {
  static async searchAirports(query) {
    try {
      // For demo purposes, using mock data
      // Replace with actual API call in production
      const filtered = MOCK_AIRPORTS.filter(airport =>
        airport.name.toLowerCase().includes(query.toLowerCase()) ||
        airport.code.toLowerCase().includes(query.toLowerCase())
      );
      
      return new Promise((resolve) => {
        setTimeout(() => resolve(filtered), 300);
      });

      // Actual API call (uncomment when ready)
      // const response = await api.get(API_ENDPOINTS.SEARCH_AIRPORTS, {
      //   params: { query }
      // });
      // return response.data;
    } catch (error) {
      throw new Error('Failed to search airports');
    }
  }

  static async getNearbyAirports(lat, lng) {
    try {
      const response = await api.get(API_ENDPOINTS.NEARBY_AIRPORTS, {
        params: { lat, lng }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to get nearby airports');
    }
  }
}