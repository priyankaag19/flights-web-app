import React, { createContext, useContext, useState } from 'react';
import { useFlights } from '../hooks/useFlights';

const FlightContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useFlightContext = () => {
  const context = useContext(FlightContext);
  if (!context) {
    throw new Error('useFlightContext must be used within FlightProvider');
  }
  return context;
};

export const FlightProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useState({
    from: null,
    to: null,
    departureDate: '',
    returnDate: '',
    tripType: 'roundtrip',
    adults: 1,
    children: 0,
    infants: 0,
    cabinClass: 'economy'
  });

  const [showResults, setShowResults] = useState(false);
  const flightHook = useFlights();

  const handleSearch = async (params) => {
    setSearchParams(params);
    setShowResults(true);
    await flightHook.searchFlights(params);
  };

  const clearSearch = () => {
    setShowResults(false);
    flightHook.clearResults();
  };

  return (
    <FlightContext.Provider value={{
      searchParams,
      setSearchParams,
      showResults,
      setShowResults,
      handleSearch,
      clearSearch,
      ...flightHook
    }}>
      {children}
    </FlightContext.Provider>
  );
};