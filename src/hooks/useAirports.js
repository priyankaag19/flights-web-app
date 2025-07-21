// src/hooks/useAirports.js
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
      const results = await AirportService.searchAirports(query);
      setAirports(results);
    } catch (err) {
      setError(err.message);
      setAirports([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getNearbyAirports = useCallback(async (lat, lng) => {
    setLoading(true);
    setError(null);

    try {
      const results = await AirportService.getNearbyAirports(lat, lng);
      setAirports(results);
    } catch (err) {
      setError(err.message);
      setAirports([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const swapAirports = useCallback(() => {
    const temp = selectedOrigin;
    setSelectedOrigin(selectedDestination);
    setSelectedDestination(temp);
  }, [selectedOrigin, selectedDestination]);

  const resetAirports = useCallback(() => {
    setAirports([]);
    setError(null);
    setLoading(false);
  }, []);

  const popularAirports = useMemo(() => [
    {
      skyId: 'DEL',
      entityId: '95565046',
      name: 'New Delhi',
      code: 'DEL',
      country: 'India',
      city: 'Delhi'
    },
    {
      skyId: 'BOM',
      entityId: '95673320',
      name: 'Mumbai',
      code: 'BOM',
      country: 'India',
      city: 'Mumbai'
    },
    {
      skyId: 'BLR',
      entityId: '95565058',
      name: 'Bangalore',
      code: 'BLR',
      country: 'India',
      city: 'Bangalore'
    },
    {
      skyId: 'MAA',
      entityId: '95565057',
      name: 'Chennai',
      code: 'MAA',
      country: 'India',
      city: 'Chennai'
    },
    {
      skyId: 'CCU',
      entityId: '95566280',
      name: 'Kolkata',
      code: 'CCU',
      country: 'India',
      city: 'Kolkata'
    }
  ], []);

  return {
    airports,
    loading,
    error,
    selectedOrigin,
    selectedDestination,
    searchAirports,
    getNearbyAirports,
    setSelectedOrigin,
    setSelectedDestination,
    swapAirports,
    resetAirports,
    popularAirports
  };
};