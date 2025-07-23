import api from './api';

export class AirportService {
  static async searchAirports(query) {
    try {
      if (!query || query.length < 2) {
        return [];
      }

      console.log('🔍 AirportService: Searching for:', query);

      // Clean the query - remove any parentheses and extra info
      const cleanQuery = query.replace(/\s*\([^)]*\)/g, '').trim();

      const response = await api.get('/flights/auto-complete', {
        params: {
          query: cleanQuery,
          limit: 10
        }
      });

      console.log('✅ AirportService: Raw response:', response.data);

      // Handle different possible response structures
      let airportData = [];

      if (response.data?.data) {
        airportData = response.data.data;
      } else if (Array.isArray(response.data)) {
        airportData = response.data;
      } else if (response.data?.places) {
        airportData = response.data.places;
      } else if (response.data?.airports) {
        airportData = response.data.airports;
      }

      // Ensure we have an array
      if (!Array.isArray(airportData)) {
        console.warn('⚠️ Airport data is not an array:', airportData);
        return [];
      }

      // Transform and filter the data
      const transformedData = airportData
        .filter(item => item && (item.iata || item.skyId || item.entityId))
        .map(item => ({
          entityId: item.entityId || item.skyId || item.iata,
          skyId: item.skyId || item.entityId || item.iata,
          iata: item.iata || item.skyId?.substring(0, 3),
          name: item.name || item.displayName || item.presentation?.suggestionTitle,
          city: item.city || item.cityName || item.presentation?.cityName,
          country: item.country || item.countryName || item.presentation?.countryName,
          type: item.type || 'AIRPORT',
          coordinates: item.coordinates || {
            lat: item.latitude || item.lat,
            lng: item.longitude || item.lng || item.lon
          }
        }));

      console.log('✅ AirportService: Transformed data:', transformedData);
      return transformedData;

    } catch (error) {
      console.error('❌ AirportService: Search error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });

      // Don't throw here, return empty array to prevent cascading errors
      return [];
    }
  }

  static async getNearbyAirports(lat, lng) {
    try {
      if (!lat || !lng) {
        throw new Error('Latitude and longitude are required');
      }

      console.log('🌍 AirportService: Getting nearby airports for:', { lat, lng });

      // Try different query formats for nearby airports
      const queries = [
        `${lat},${lng}`,
        `location:${lat},${lng}`,
        `nearby:${lat},${lng}`,
        `geo:${lat},${lng}`
      ];

      let airportData = [];

      for (const query of queries) {
        try {
          const response = await api.get('/flights/auto-complete', {
            params: { query, limit: 20 }
          });

          if (response.data?.data?.length > 0) {
            airportData = response.data.data;
            console.log(`✅ Found nearby airports with query: ${query}`);
            break;
          }
        } catch (queryErr) {
          console.log(`⚠️ Query "${query}" failed:`, queryErr.message);
          continue;
        }
      }

      // If location-based queries don't work, try getting all airports and filter by distance
      if (airportData.length === 0) {
        console.log('🔄 Falling back to general airport search...');
        try {
          const response = await api.get('/flights/airports');
          const allAirports = response.data?.data || [];

          // Filter airports within reasonable distance (this is approximate)
          airportData = allAirports.filter(airport => {
            if (!airport.coordinates?.lat || !airport.coordinates?.lng) return false;

            const distance = Math.sqrt(
              Math.pow(airport.coordinates.lat - lat, 2) +
              Math.pow(airport.coordinates.lng - lng, 2)
            );

            return distance < 5; // Roughly 5 degrees (very approximate)
          });
        } catch (fallbackErr) {
          console.error('❌ Fallback nearby airports failed:', fallbackErr);
        }
      }

      return this.transformAirportData(airportData);

    } catch (error) {
      console.error('❌ AirportService: Nearby airports error:', error);
      throw new Error(`Failed to get nearby airports: ${error.message}`);
    }
  }

  static async getAllAirports() {
    try {
      console.log('📋 AirportService: Getting all airports');

      const response = await api.get('/flights/airports');

      let airportData = [];
      if (response.data?.data) {
        airportData = response.data.data;
      } else if (Array.isArray(response.data)) {
        airportData = response.data;
      }

      return this.transformAirportData(airportData);
    } catch (error) {
      console.error('❌ AirportService: Get all airports error:', error);
      throw new Error(`Failed to fetch all airports: ${error.message}`);
    }
  }

  static async getAirportBySkyId(skyId) {
    try {
      if (!skyId) {
        throw new Error('SkyId is required');
      }

      console.log('🔍 AirportService: Getting airport by skyId:', skyId);

      const response = await api.get('/flights/skyId-list', {
        params: { skyId }
      });

      const airportData = response.data?.data || response.data;

      if (!airportData) {
        throw new Error('Airport not found');
      }

      return Array.isArray(airportData)
        ? this.transformAirportData(airportData)[0]
        : this.transformSingleAirport(airportData);

    } catch (error) {
      console.error('❌ AirportService: Get airport by skyId error:', error);
      throw new Error(`Failed to fetch airport details: ${error.message}`);
    }
  }

  static transformAirportData(airportData) {
    if (!Array.isArray(airportData)) {
      return [];
    }

    return airportData
      .filter(item => item && (item.iata || item.skyId || item.entityId))
      .map(item => this.transformSingleAirport(item));
  }

  static transformSingleAirport(item) {
    return {
      entityId: item.entityId || item.skyId || item.iata,
      skyId: item.skyId || item.entityId || item.iata,
      iata: item.iata || item.skyId?.substring(0, 3),
      name: item.name || item.displayName || item.presentation?.suggestionTitle,
      city: item.city || item.cityName || item.presentation?.cityName,
      country: item.country || item.countryName || item.presentation?.countryName,
      type: item.type || 'AIRPORT',
      coordinates: item.coordinates || {
        lat: item.latitude || item.lat,
        lng: item.longitude || item.lng || item.lon
      },
      // Additional properties that might be useful
      fullName: item.fullName || `${item.name || ''} (${item.iata || item.skyId || ''})`,
      searchText: `${item.name || ''} ${item.city || ''} ${item.country || ''} ${item.iata || ''}`.toLowerCase()
    };
  }
}