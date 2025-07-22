import { useState } from 'react';
import { AirportService } from '../services/airportService';

export const useFlights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const searchFlights = async (searchParams) => {
    setLoading(true);
    setError(null);
    setSearchPerformed(true);
    
    try {
      let endpoint = '';
      let requestData = {};

      // Determine which API endpoint to use based on search type
      if (searchParams.tripType === 'roundtrip') {
        endpoint = 'flights/search-roundtrip';
        requestData = {
          originSkyId: searchParams.from?.skyId || searchParams.from,
          destinationSkyId: searchParams.to?.skyId || searchParams.to,
          originEntityId: searchParams.from?.entityId,
          destinationEntityId: searchParams.to?.entityId,
          departureDate: searchParams.departureDate instanceof Date ? 
            searchParams.departureDate.toISOString().split('T')[0] : 
            searchParams.departureDate,
          returnDate: searchParams.returnDate instanceof Date ? 
            searchParams.returnDate.toISOString().split('T')[0] : 
            searchParams.returnDate,
          adults: searchParams.adults || 1,
          children: searchParams.children || 0,
          infants: searchParams.infants || 0,
          cabinClass: searchParams.cabinClass || 'economy',
          currency: 'INR',
          market: 'IN',
          countryCode: 'IN'
        };
      } else {
        endpoint = 'flights/search-one-way';
        requestData = {
          originSkyId: searchParams.from?.skyId || searchParams.from,
          destinationSkyId: searchParams.to?.skyId || searchParams.to,
          originEntityId: searchParams.from?.entityId,
          destinationEntityId: searchParams.to?.entityId,
          departureDate: searchParams.departureDate instanceof Date ? 
            searchParams.departureDate.toISOString().split('T')[0] : 
            searchParams.departureDate,
          adults: searchParams.adults || 1,
          children: searchParams.children || 0,
          infants: searchParams.infants || 0,
          cabinClass: searchParams.cabinClass || 'economy',
          currency: 'INR',
          market: 'IN',
          countryCode: 'IN'
        };
      }

      console.log('Making API call with:', { endpoint, requestData });

      // Try different ways to call the service based on common patterns
      let response;
      try {
        // Pattern 1: Static method
        if (typeof AirportService.request === 'function') {
          response = await AirportService.request('GET', endpoint, requestData);
        } 
        // Pattern 2: Instance method with request
        else {
          const airportService = new AirportService();
          if (typeof airportService.request === 'function') {
            response = await airportService.request('GET', endpoint, requestData);
          }
          // Pattern 3: Instance method with different name
          else if (typeof airportService.get === 'function') {
            response = await airportService.get(endpoint, requestData);
          }
          // Pattern 4: Instance method with post
          else if (typeof airportService.post === 'function') {
            response = await airportService.post(endpoint, requestData);
          }
          // Pattern 5: Direct call method
          else if (typeof airportService.call === 'function') {
            response = await airportService.call(endpoint, requestData);
          }
          else {
            throw new Error('AirportService method not found. Available methods: ' + Object.getOwnPropertyNames(airportService));
          }
        }
      } catch (serviceError) {
        console.error('Service error:', serviceError);
        throw serviceError;
      }
      
      console.log('API Response:', response);
      
      // Handle different response structures
      let flightData = [];
      if (response.data) {
        // Extract flights from different possible response structures
        flightData = response.data.itineraries || 
                   response.data.flights || 
                   response.data.results || 
                   response.data || 
                   [];
      }

      console.log('Extracted flight data:', flightData);

      // Transform the data to match our component expectations
      const transformedFlights = flightData.map((flight, index) => ({
        id: flight.id || `flight-${index}`,
        
        // Airline information
        airline: flight.legs?.[0]?.carriers?.marketing?.[0]?.name || 
                flight.validatingCarriers?.[0]?.name ||
                flight.carrier?.name ||
                'Unknown Airline',
        
        carrierName: flight.legs?.[0]?.carriers?.marketing?.[0]?.name || 
                    flight.validatingCarriers?.[0]?.name ||
                    flight.carrier?.name,
        
        flightNumber: flight.legs?.[0]?.segments?.[0]?.flightNumber || 
                     flight.flightNumber ||
                     'N/A',
        
        carrierCode: flight.legs?.[0]?.carriers?.marketing?.[0]?.iata || 
                    flight.validatingCarriers?.[0]?.iata ||
                    flight.carrier?.code ||
                    '',

        // Departure information
        departure: {
          time: flight.legs?.[0]?.departure || 
                new Date(flight.departureDateTime || flight.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          airport: flight.legs?.[0]?.origin?.displayCode || 
                  flight.departure?.iataCode ||
                  flight.origin?.iata,
          city: flight.legs?.[0]?.origin?.name || 
               flight.departure?.name ||
               flight.origin?.name
        },

        // Arrival information  
        arrival: {
          time: flight.legs?.[0]?.arrival || 
                new Date(flight.arrivalDateTime || flight.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          airport: flight.legs?.[0]?.destination?.displayCode || 
                  flight.arrival?.iataCode ||
                  flight.destination?.iata,
          city: flight.legs?.[0]?.destination?.name || 
               flight.arrival?.name ||
               flight.destination?.name
        },

        // Flight details
        duration: flight.legs?.[0]?.durationInMinutes ? 
                 `${Math.floor(flight.legs[0].durationInMinutes / 60)}h ${flight.legs[0].durationInMinutes % 60}m` :
                 flight.duration ||
                 'N/A',
        
        durationInMinutes: flight.legs?.[0]?.durationInMinutes || 
                          flight.durationInMinutes ||
                          0,

        // Price information
        price: {
          amount: flight.price?.raw || 
                 flight.price?.amount || 
                 flight.totalPrice ||
                 flight.price ||
                 0,
          currency: flight.price?.currency || 'INR'
        },

        // Stops and segments
        stops: flight.legs?.[0]?.stopCount || 
              (flight.legs?.[0]?.segments?.length - 1) ||
              flight.stops ||
              0,
        
        segments: flight.legs?.[0]?.segments || 
                 flight.segments || 
                 [{}],

        // Additional information
        aircraft: flight.legs?.[0]?.segments?.[0]?.aircraft?.name ||
                 flight.aircraft ||
                 'N/A',
        
        // Origin and destination for compatibility
        origin: {
          iata: flight.legs?.[0]?.origin?.displayCode || 
               flight.departure?.iataCode ||
               flight.origin?.iata,
          name: flight.legs?.[0]?.origin?.name || 
               flight.departure?.name ||
               flight.origin?.name
        },
        
        destination: {
          iata: flight.legs?.[0]?.destination?.displayCode || 
               flight.arrival?.iataCode ||
               flight.destination?.iata,
          name: flight.legs?.[0]?.destination?.name || 
               flight.arrival?.name ||
               flight.destination?.name
        },

        // Amenities
        amenities: flight.amenities || 
                  flight.legs?.[0]?.segments?.[0]?.amenities || 
                  []
      }));

      console.log('Transformed flights:', transformedFlights);
      setFlights(transformedFlights);
      
    } catch (err) {
      console.error('Flight search error:', err);
      setError(err.message || 'Failed to search flights. Please try again.');
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setFlights([]);
    setError(null);
    setSearchPerformed(false);
  };

  return {
    flights,
    loading,
    error,
    searchPerformed,
    searchFlights,
    clearResults
  };
};