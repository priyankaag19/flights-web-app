import api from './api';

export class FlightService {
  static async searchFlights(searchParams) {
    try {
      console.log('🛫 FlightService: Starting search with params:', searchParams);

      const isRoundTrip = searchParams.tripType === 'roundtrip' && searchParams.returnDate;

      // Determine endpoint based on trip type
      const endpoint = isRoundTrip
        ? '/flights/search-roundtrip'
        : '/flights/search-one-way';

      // Prepare API parameters
      const apiParams = {
        // Use entityId or skyId based on what your API expects
        fromEntityId: searchParams.from?.entityId || searchParams.from?.skyId,
        toEntityId: searchParams.to?.entityId || searchParams.to?.skyId,

        // Alternative parameter names (try both)
        originSkyId: searchParams.from?.skyId || searchParams.from?.entityId,
        destinationSkyId: searchParams.to?.skyId || searchParams.to?.entityId,

        departDate: searchParams.departureDate,
        departureDate: searchParams.departureDate,

        ...(isRoundTrip && {
          returnDate: searchParams.returnDate
        }),

        adults: searchParams.adults || 1,
        children: searchParams.children || 0,
        infants: searchParams.infants || 0,
        cabinClass: searchParams.cabinClass || 'economy',

        // Additional parameters that might be required
        currency: 'INR',
        market: 'IN',
        countryCode: 'IN'
      };

      console.log('📡 FlightService: Making API call to:', endpoint, 'with params:', apiParams);

      const response = await api.get(endpoint, {
        params: apiParams
      });

      console.log('✅ FlightService: Raw API response:', response.data);

      // Handle different response structures - FIXED VERSION
      let flightData = [];

      // First check if response has the expected structure
      if (response.data?.data) {
        const data = response.data.data;
        console.log('🔍 FlightService: Found data property:', data);

        // Check for nested itineraries in data
        if (data.itineraries && Array.isArray(data.itineraries)) {
          flightData = data.itineraries;
          console.log('✅ FlightService: Using data.itineraries:', flightData.length, 'flights');
        }
        // Check for direct flights array in data
        else if (Array.isArray(data)) {
          flightData = data;
          console.log('✅ FlightService: Using data as array:', flightData.length, 'flights');
        }
        // Check for other possible nested structures in data
        else if (data.flights && Array.isArray(data.flights)) {
          flightData = data.flights;
          console.log('✅ FlightService: Using data.flights:', flightData.length, 'flights');
        }
        else if (data.results && Array.isArray(data.results)) {
          flightData = data.results;
          console.log('✅ FlightService: Using data.results:', flightData.length, 'flights');
        }
        else if (data.legs && Array.isArray(data.legs)) {
          flightData = data.legs;
          console.log('✅ FlightService: Using data.legs:', flightData.length, 'flights');
        }
        else {
          console.log('🔍 FlightService: Checking data object keys:', Object.keys(data));
          // Log the structure to help debug
          console.log('🔍 FlightService: Data structure:', JSON.stringify(data, null, 2));
        }
      }
      // Direct itineraries in response
      else if (response.data?.itineraries && Array.isArray(response.data.itineraries)) {
        flightData = response.data.itineraries;
        console.log('✅ FlightService: Using response.data.itineraries:', flightData.length, 'flights');
      }
      // Other possible structures
      else if (response.data?.legs && Array.isArray(response.data.legs)) {
        flightData = response.data.legs;
        console.log('✅ FlightService: Using response.data.legs:', flightData.length, 'flights');
      }
      else if (response.data?.results && Array.isArray(response.data.results)) {
        flightData = response.data.results;
        console.log('✅ FlightService: Using response.data.results:', flightData.length, 'flights');
      }
      else if (response.data?.flights && Array.isArray(response.data.flights)) {
        flightData = response.data.flights;
        console.log('✅ FlightService: Using response.data.flights:', flightData.length, 'flights');
      }
      else if (Array.isArray(response.data)) {
        flightData = response.data;
        console.log('✅ FlightService: Using response.data as array:', flightData.length, 'flights');
      }
      else {
        console.warn('⚠️ FlightService: Unexpected response structure. Full response:');
        console.log('📋 Response keys:', Object.keys(response.data || {}));
        console.log('📋 Full response:', JSON.stringify(response.data, null, 2));

        // Last resort - try to find any array in the response
        const findArrays = (obj, path = '') => {
          const arrays = [];
          for (const [key, value] of Object.entries(obj || {})) {
            const currentPath = path ? `${path}.${key}` : key;
            if (Array.isArray(value) && value.length > 0) {
              arrays.push({ path: currentPath, array: value, length: value.length });
            } else if (typeof value === 'object' && value !== null) {
              arrays.push(...findArrays(value, currentPath));
            }
          }
          return arrays;
        };

        const arrays = findArrays(response.data);
        console.log('🔍 Found arrays in response:', arrays);

        // Try to use the first non-empty array that might contain flight data
        const potentialFlightArray = arrays.find(arr =>
          arr.array.length > 0 &&
          typeof arr.array[0] === 'object' &&
          (arr.path.includes('flight') || arr.path.includes('itinerary') || arr.path.includes('result'))
        );

        if (potentialFlightArray) {
          console.log('🎯 Using potential flight array:', potentialFlightArray.path);
          flightData = potentialFlightArray.array;
        } else {
          flightData = [];
        }
      }

      console.log('✅ FlightService: Final extracted flight data:', flightData.length, 'flights');

      // Log first flight structure for debugging
      if (flightData.length > 0) {
        console.log('🔍 First flight structure:', JSON.stringify(flightData[0], null, 2));
      }

      return Array.isArray(flightData) ? flightData : [];

    } catch (error) {
      console.error('❌ FlightService: Search error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url
      });

      // Re-throw with more context
      if (error.response?.status === 400) {
        throw new Error('Invalid flight search parameters. Please check your search criteria.');
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Authentication failed. Please check your API key.');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please wait before trying again.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        throw new Error('Network error. Please check your internet connection.');
      } else {
        throw new Error(error.message || 'Failed to search flights');
      }
    }
  }

  static sortFlights(flights, sortBy) {
    if (!Array.isArray(flights)) return [];

    return [...flights].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          const priceA = a.price?.amount || a.price?.raw || a.price || 0;
          const priceB = b.price?.amount || b.price?.raw || b.price || 0;
          return priceA - priceB;

        case 'duration':
          const durationA = a.durationInMinutes || a.duration || 0;
          const durationB = b.durationInMinutes || b.duration || 0;
          return durationA - durationB;

        case 'rating':
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          return ratingB - ratingA;

        case 'departure':
          const depA = a.departure?.time || a.legs?.[0]?.departure || '';
          const depB = b.departure?.time || b.legs?.[0]?.departure || '';
          return depA.localeCompare(depB);

        case 'arrival':
          const arrA = a.arrival?.time || a.legs?.[0]?.arrival || '';
          const arrB = b.arrival?.time || b.legs?.[0]?.arrival || '';
          return arrA.localeCompare(arrB);

        default:
          return 0;
      }
    });
  }

  static filterFlights(flights, filters) {
    if (!Array.isArray(flights)) return [];
    if (!filters) return flights;

    return flights.filter(flight => {
      // Price Range
      if (filters.priceRange && Array.isArray(filters.priceRange)) {
        const price = flight.price?.amount || flight.price?.raw || flight.price || 0;
        if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
          return false;
        }
      }

      // Stops
      if (filters.stops?.length) {
        const stops = flight.stops || flight.legs?.[0]?.stopCount || 0;
        if (!filters.stops.includes(stops)) {
          return false;
        }
      }

      // Airlines
      if (filters.airlines?.length) {
        const airlineCode = flight.carrierCode ||
          flight.airline?.code ||
          flight.legs?.[0]?.carriers?.marketing?.[0]?.iata || '';
        if (!filters.airlines.includes(airlineCode)) {
          return false;
        }
      }

      // Rating
      if (filters.rating) {
        const rating = flight.rating || 0;
        if (rating < filters.rating) {
          return false;
        }
      }

      // Amenities
      if (filters.amenities?.length) {
        const flightAmenities = flight.amenities || [];
        if (!filters.amenities.every(amenity => flightAmenities.includes(amenity))) {
          return false;
        }
      }

      // Duration Range
      if (filters.durationRange && Array.isArray(filters.durationRange)) {
        const duration = flight.durationInMinutes ||
          flight.legs?.[0]?.durationInMinutes || 0;
        if (duration < filters.durationRange[0] || duration > filters.durationRange[1]) {
          return false;
        }
      }

      // Departure Time
      if (filters.departureTime) {
        const departureTime = flight.departure?.time ||
          flight.legs?.[0]?.departure || '';
        if (departureTime) {
          const hour = new Date(departureTime).getHours();

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
      }

      return true;
    });
  }

  // Helper method to validate search parameters
  static validateSearchParams(searchParams) {
    const errors = [];

    if (!searchParams.from) {
      errors.push('Origin airport is required');
    }

    if (!searchParams.to) {
      errors.push('Destination airport is required');
    }

    if (!searchParams.departureDate) {
      errors.push('Departure date is required');
    }

    if (searchParams.tripType === 'roundtrip' && !searchParams.returnDate) {
      errors.push('Return date is required for round trip');
    }

    if (searchParams.adults < 1) {
      errors.push('At least one adult passenger is required');
    }

    return errors;
  }
}
