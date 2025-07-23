import { useState } from 'react';
import { FlightService } from '../services/flightService';

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
      console.log('🔍 Starting flight search with params:', searchParams);

      // Prepare the request data
      const requestData = {
        tripType: searchParams.tripType,
        from: searchParams.from,
        to: searchParams.to,
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

      // Use FlightService instead of AirportService
      const flightData = await FlightService.searchFlights(requestData);
      
      console.log('✅ Raw flight data received:', flightData);

      // Transform the data to match our component expectations
      const transformedFlights = Array.isArray(flightData) ? flightData.map((flight, index) => ({
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
      })) : [];

      console.log('✅ Transformed flights:', transformedFlights);
      setFlights(transformedFlights);
      
    } catch (err) {
      console.error('❌ Flight search error:', err);
      
      // Set user-friendly error messages
      let errorMessage = 'Failed to search flights. Please try again.';
      
      if (err.message?.includes('400')) {
        errorMessage = 'Invalid search parameters. Please check your search criteria.';
      } else if (err.message?.includes('401') || err.message?.includes('403')) {
        errorMessage = 'Authentication error. Please check your API configuration.';
      } else if (err.message?.includes('429')) {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
      } else if (err.message?.includes('timeout')) {
        errorMessage = 'Request timeout. Please check your connection and try again.';
      } else if (err.message?.includes('Network Error')) {
        errorMessage = 'Network error. Please check your internet connection.';
      }
      
      setError(errorMessage);
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