import api from './api';

export class AirportService {
  static async searchAirports(query) {
    try {
      if (!query || query.length < 2) {
        return [];
      }

      console.log('🔍 AirportService: Searching for:', query);

      const cleanQuery = query.replace(/\s*\([^)]*\)/g, '').trim();

      const response = await api.get('/flights/auto-complete', {
        params: {
          query: cleanQuery,
          limit: 20
        }
      });

      console.log('✅ AirportService: Raw response:', response.data);

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

      if (!Array.isArray(airportData)) {
        console.warn('⚠️ Airport data is not an array:', airportData);
        return [];
      }

      const transformedData = airportData
        .filter(item => item && (
          item.presentation?.skyId || 
          item.skyId || 
          item.iata || 
          item.entityId ||
          item.relevantFlightParams?.skyId
        ))
        .map(item => AirportService.transformSingleAirport(item))
        .filter(Boolean);

      console.log('✅ AirportService: Transformed data:', transformedData);

      return transformedData;
    } catch (error) {
      console.error('❌ AirportService: Search error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });

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

            return distance < 5;
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
      .filter(item => item && (
        item.presentation?.skyId || 
        item.skyId || 
        item.iata || 
        item.entityId ||
        item.relevantFlightParams?.skyId
      ))
      .map(item => this.transformSingleAirport(item));
  }

  static transformSingleAirport(item) {
    if (!item) return null;

    // Handle the new data structure based on your sample
    const presentation = item.presentation || {};
    const flightParams = item.relevantFlightParams || {};
    
    // Extract airport code - prioritize skyId from different sources
    const skyId = presentation.skyId || 
                  flightParams.skyId || 
                  item.skyId || 
                  item.iata || 
                  item.entityId || 
                  '';

    // Extract name - handle different formats
    const name = presentation.suggestionTitle || 
                 presentation.title || 
                 item.localizedName || 
                 item.name || 
                 'Unknown Airport';

    // Extract city information
    const city = presentation.title || 
                 item.localizedName || 
                 item.city || 
                 '';

    // Extract country information
    const country = presentation.subtitle || 
                    item.country || 
                    item.countryName || 
                    '';

    // Use entityId as primary identifier
    const entityId = item.entityId || skyId;

    // Create a clean display name
    const displayName = name.includes('(') ? name : `${name}${skyId ? ` (${skyId})` : ''}`;

    const transformedAirport = {
      entityId,
      skyId,
      iata: skyId, // Use skyId as IATA code
      name: name.replace(/\s*\([^)]*\)/g, ''),
      city,
      country,
      type: item.entityType || flightParams.flightPlaceType || 'CITY',
      coordinates: item.coordinates || null,
      fullName: displayName,
      searchText: `${name} ${city} ${country} ${skyId}`.toLowerCase(),
      // Keep original data for debugging
      _original: item
    };

    console.log('🔄 Transformed airport:', {
      input: item,
      output: transformedAirport
    });

    return transformedAirport;
  }
}