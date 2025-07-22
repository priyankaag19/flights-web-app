import { useState, useCallback, useMemo } from 'react';
import { AirportService } from '../services/airportService';

export const useAirports = () => {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);

  const searchAirports = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setAirports([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔍 useAirports: Searching airports for query:', query);
      
      const airportData = await AirportService.searchAirports(query);
      
      console.log('✅ useAirports: Received airport data:', airportData);
      setAirports(airportData);

      if (airportData.length === 0) {
        setError(`No airports found for "${query}". Try a different search term.`);
      }

    } catch (err) {
      console.error('❌ useAirports: Search error:', err);
      
      // Set user-friendly error message
      let errorMessage = 'Failed to search airports';
      
      if (err.message?.includes('400')) {
        errorMessage = 'Invalid search query. Please try a different search term.';
      } else if (err.message?.includes('401') || err.message?.includes('403')) {
        errorMessage = 'Authentication error. Please check your API configuration.';
      } else if (err.message?.includes('429')) {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
      } else if (err.message?.includes('timeout')) {
        errorMessage = 'Request timeout. Please check your connection and try again.';
      }
      
      setError(errorMessage);
      setAirports([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllAirports = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('📋 useAirports: Getting all airports');
      
      const airportData = await AirportService.getAllAirports();
      
      console.log('✅ useAirports: Received all airports:', airportData.length);
      setAirports(airportData);
      
      return airportData;
    } catch (err) {
      console.error('❌ useAirports: Get all airports error:', err);
      setError('Failed to fetch airports');
      setAirports([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getNearbyAirports = useCallback(async (lat, lng) => {
    if (!lat || !lng) {
      setError('Invalid coordinates provided');
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🌍 useAirports: Getting nearby airports for:', { lat, lng });
      
      const airportData = await AirportService.getNearbyAirports(lat, lng);
      
      console.log('✅ useAirports: Received nearby airports:', airportData);
      setAirports(airportData);
      
      return airportData;
      
    } catch (err) {
      console.error('❌ useAirports: Nearby airports error:', err);
      setError('Failed to fetch nearby airports');
      setAirports([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const searchEverywhere = useCallback(async (fromEntityId) => {
    if (!fromEntityId) {
      setError('Origin airport is required');
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🌐 useAirports: Searching everywhere from:', fromEntityId);
      
      const response = await api.get('/flights/search-everywhere', {
        params: { fromEntityId }
      });

      const destinations = response?.data?.data || response?.data || [];
      const transformedDestinations = Array.isArray(destinations) 
        ? destinations.map(dest => AirportService.transformSingleAirport(dest))
        : [];
        
      console.log('✅ useAirports: Found destinations:', transformedDestinations);
      
      return transformedDestinations;
    } catch (err) {
      console.error('❌ useAirports: Search everywhere error:', err);
      setError('Failed to search destinations');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getAirportBySkyId = useCallback(async (skyId) => {
    try {
      console.log('🔍 useAirports: Getting airport by skyId:', skyId);
      
      const airportData = await AirportService.getAirportBySkyId(skyId);
      
      console.log('✅ useAirports: Received airport:', airportData);
      return airportData;
    } catch (err) {
      console.error('❌ useAirports: Get airport by skyId error:', err);
      throw err;
    }
  }, []);

  const swapAirports = useCallback(() => {
    console.log('🔄 useAirports: Swapping airports');
    const temp = selectedOrigin;
    setSelectedOrigin(selectedDestination);
    setSelectedDestination(temp);
  }, [selectedOrigin, selectedDestination]);

  const resetAirports = useCallback(() => {
    console.log('🔄 useAirports: Resetting airports');
    setAirports([]);
    setError(null);
    setLoading(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Popular airports with proper data structure
  const popularAirports = useMemo(() => [
    {
      from: { 
        skyId: 'DEL', 
        entityId: 'DEL', 
        iata: 'DEL',
        name: 'Delhi',
        city: 'New Delhi',
        country: 'India'
      },
      to: { 
        skyId: 'BOM', 
        entityId: 'BOM', 
        iata: 'BOM',
        name: 'Mumbai',
        city: 'Mumbai',
        country: 'India'
      },
    },
    {
      from: { 
        skyId: 'BLR', 
        entityId: 'BLR', 
        iata: 'BLR',
        name: 'Bangalore',
        city: 'Bangalore',
        country: 'India'
      },
      to: { 
        skyId: 'DEL', 
        entityId: 'DEL', 
        iata: 'DEL',
        name: 'Delhi',
        city: 'New Delhi',
        country: 'India'
      },
    },
    {
      from: { 
        skyId: 'BOM', 
        entityId: 'BOM', 
        iata: 'BOM',
        name: 'Mumbai',
        city: 'Mumbai',
        country: 'India'
      },
      to: { 
        skyId: 'GOI', 
        entityId: 'GOI', 
        iata: 'GOI',
        name: 'Goa',
        city: 'Goa',
        country: 'India'
      },
    },
    {
      from: { 
        skyId: 'CCU', 
        entityId: 'CCU', 
        iata: 'CCU',
        name: 'Kolkata',
        city: 'Kolkata',
        country: 'India'
      },
      to: { 
        skyId: 'BLR', 
        entityId: 'BLR', 
        iata: 'BLR',
        name: 'Bangalore',
        city: 'Bangalore',
        country: 'India'
      },
    },
    {
      from: { 
        skyId: 'MAA', 
        entityId: 'MAA', 
        iata: 'MAA',
        name: 'Chennai',
        city: 'Chennai',
        country: 'India'
      },
      to: { 
        skyId: 'HYD', 
        entityId: 'HYD', 
        iata: 'HYD',
        name: 'Hyderabad',
        city: 'Hyderabad',
        country: 'India'
      },
    },
  ], []);

  // Helper function to validate airport data
  const validateAirport = useCallback((airport) => {
    return airport && 
           (airport.skyId || airport.entityId || airport.iata) && 
           airport.name;
  }, []);

  // Helper function to format airport for display
  const formatAirportDisplay = useCallback((airport) => {
    if (!airport) return '';
    
    const code = airport.iata || airport.skyId || airport.entityId || '';
    const name = airport.name || '';
    const city = airport.city || '';
    
    return `${name}${city && city !== name ? ` (${city})` : ''} - ${code}`;
  }, []);

  return {
    airports,
    loading,
    error,
    selectedOrigin,
    selectedDestination,
    searchAirports,
    getAllAirports,
    getNearbyAirports,
    searchEverywhere,
    getAirportBySkyId,
    setSelectedOrigin,
    setSelectedDestination,
    swapAirports,
    resetAirports,
    clearError,
    popularAirports,
    validateAirport,
    formatAirportDisplay
  };
};