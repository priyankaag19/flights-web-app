import { useState, useCallback } from 'react';
import { FlightService } from '../services/flightService';
import { useFlightContext } from '../context/FlightContext';

export const useFlights = () => {
  const { setLoading, setFlights, setError, sortBy, filters } = useFlightContext();
  const [searchHistory, setSearchHistory] = useState([]);

  const searchFlights = useCallback(async (searchParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const flights = await FlightService.searchFlights(searchParams);
      const sortedFlights = FlightService.sortFlights(flights, sortBy);
      const filteredFlights = FlightService.filterFlights(sortedFlights, filters);
      
      setFlights(filteredFlights);
      
      // Add to search history
      setSearchHistory(prev => [{
        ...searchParams,
        timestamp: new Date().toISOString(),
        id: Date.now()
      }, ...prev.slice(0, 4)]);
      
    } catch (error) {
      setError(error.message);
    }
  }, [setLoading, setFlights, setError, sortBy, filters]);

  return {
    searchFlights,
    searchHistory,
  };
};

// src/hooks/useAirports.js
import { useState, useCallback } from 'react';
import { AirportService } from '../services/airportService';
import { debounce } from '../utils/helpers';

export const useAirports = () => {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (query.length < 2) {
        setAirports([]);
        return;
      }

      try {
        setLoading(true);
        const results = await AirportService.searchAirports(query);
        setAirports(results);
      } catch (error) {
        console.error('Error searching airports:', error);
        setAirports([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  const searchAirports = useCallback((query) => {
    debouncedSearch(query);
  }, [debouncedSearch]);

  return {
    airports,
    loading,
    searchAirports,
  };
};