// src/hooks/useFlights.js
import { useState, useCallback } from 'react';

const useFlights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    departDate: '',
    returnDate: '',
    passengers: 1,
    tripType: 'roundtrip'
  });

  // Mock flight data generator
  const generateMockFlights = useCallback((searchCriteria) => {
    const airlines = ['Delta', 'American Airlines', 'United', 'Southwest', 'JetBlue', 'Alaska'];
    const mockFlights = [];
    
    for (let i = 0; i < 15; i++) {
      const airline = airlines[Math.floor(Math.random() * airlines.length)];
      const duration = Math.floor(Math.random() * 8) + 2; // 2-10 hours
      const price = Math.floor(Math.random() * 600) + 150; // $150-750
      const stops = Math.random() > 0.6 ? 0 : Math.floor(Math.random() * 2) + 1;
      
      mockFlights.push({
        id: `flight-${i}`,
        airline,
        flightNumber: `${airline.substring(0, 2).toUpperCase()}${Math.floor(Math.random() * 9000) + 1000}`,
        from: searchCriteria.from || 'NYC',
        to: searchCriteria.to || 'LAX',
        departTime: `${Math.floor(Math.random() * 12) + 6}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
        arriveTime: `${Math.floor(Math.random() * 12) + 6}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
        duration: `${Math.floor(duration)}h ${Math.floor((duration % 1) * 60)}m`,
        price,
        stops: stops === 0 ? 'Nonstop' : `${stops} stop${stops > 1 ? 's' : ''}`,
        aircraft: 'Boeing 737',
        baggage: 'Carry-on included'
      });
    }
    
    return mockFlights.sort((a, b) => a.price - b.price);
  }, []);

  const searchFlights = useCallback(async (criteria) => {
    setLoading(true);
    setError(null);
    setSearchParams(criteria);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockFlights = generateMockFlights(criteria);
      setFlights(mockFlights);
    } catch (err) {
      setError('Failed to search flights. Please try again.');
      console.error('Flight search error:', err);
    } finally {
      setLoading(false);
    }
  }, [generateMockFlights]);

  const clearSearch = useCallback(() => {
    setFlights([]);
    setSearchParams({
      from: '',
      to: '',
      departDate: '',
      returnDate: '',
      passengers: 1,
      tripType: 'roundtrip'
    });
    setError(null);
  }, []);

  return {
    flights,
    loading,
    error,
    searchParams,
    searchFlights,
    clearSearch
  };
};

export default useFlights;



// // src/hooks/useAirports.js
// import { useState, useCallback } from 'react';
// import { AirportService } from '../services/airportService';
// import { debounce } from '../utils/helpers';

// export const useAirports = () => {
//   const [airports, setAirports] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const debouncedSearch = useCallback(
//     debounce(async (query) => {
//       if (query.length < 2) {
//         setAirports([]);
//         return;
//       }

//       try {
//         setLoading(true);
//         const results = await AirportService.searchAirports(query);
//         setAirports(results);
//       } catch (error) {
//         console.error('Error searching airports:', error);
//         setAirports([]);
//       } finally {
//         setLoading(false);
//       }
//     }, 300),
//     []
//   );

//   const searchAirports = useCallback((query) => {
//     debouncedSearch(query);
//   }, [debouncedSearch]);

//   return {
//     airports,
//     loading,
//     searchAirports,
//   };
// };