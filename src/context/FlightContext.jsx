// import React, { createContext, useContext, useReducer } from 'react';
// import { TRIP_TYPES, CABIN_CLASSES } from '../utils/constants';

// const FlightContext = createContext();

// const initialState = {
//   searchData: {
//     tripType: TRIP_TYPES.ROUND_TRIP,
//     from: null,
//     to: null,
//     departDate: '',
//     returnDate: '',
//     passengers: 1,
//     cabinClass: CABIN_CLASSES.ECONOMY,
//   },
//   flights: [],
//   loading: false,
//   error: null,
//   filters: {
//     priceRange: [0, 100000],
//     stops: [],
//     airlines: [],
//     departureTime: [],
//     duration: [0, 24],
//   },
//   sortBy: 'price',
// };

// const flightReducer = (state, action) => {
//   switch (action.type) {
//     case 'SET_SEARCH_DATA':
//       return {
//         ...state,
//         searchData: { ...state.searchData, ...action.payload },
//       };
//     case 'SET_LOADING':
//       return {
//         ...state,
//         loading: action.payload,
//       };
//     case 'SET_FLIGHTS':
//       return {
//         ...state,
//         flights: action.payload,
//         loading: false,
//         error: null,
//       };
//     case 'SET_ERROR':
//       return {
//         ...state,
//         error: action.payload,
//         loading: false,
//       };
//     case 'SET_FILTERS':
//       return {
//         ...state,
//         filters: { ...state.filters, ...action.payload },
//       };
//     case 'SET_SORT_BY':
//       return {
//         ...state,
//         sortBy: action.payload,
//       };
//     case 'RESET_SEARCH':
//       return {
//         ...state,
//         flights: [],
//         error: null,
//       };
//     default:
//       return state;
//   }
// };

// export const FlightProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(flightReducer, initialState);

//   const updateSearchData = (data) => {
//     dispatch({ type: 'SET_SEARCH_DATA', payload: data });
//   };

//   const setLoading = (loading) => {
//     dispatch({ type: 'SET_LOADING', payload: loading });
//   };

//   const setFlights = (flights) => {
//     dispatch({ type: 'SET_FLIGHTS', payload: flights });
//   };

//   const setError = (error) => {
//     dispatch({ type: 'SET_ERROR', payload: error });
//   };

//   const updateFilters = (filters) => {
//     dispatch({ type: 'SET_FILTERS', payload: filters });
//   };

//   const setSortBy = (sortBy) => {
//     dispatch({ type: 'SET_SORT_BY', payload: sortBy });
//   };

//   const resetSearch = () => {
//     dispatch({ type: 'RESET_SEARCH' });
//   };

//   return (
//     <FlightContext.Provider
//       value={{
//         ...state,
//         updateSearchData,
//         setLoading,
//         setFlights,
//         setError,
//         updateFilters,
//         setSortBy,
//         resetSearch,
//       }}
//     >
//       {children}
//     </FlightContext.Provider>
//   );
// };

// export const useFlightContext = () => {
//   const context = useContext(FlightContext);
//   if (!context) {
//     throw new Error('useFlightContext must be used within a FlightProvider');
//   }
//   return context;
// };

import React, { createContext, useContext, useState } from 'react';
import { useFlights } from '../hooks/useFlights';

const FlightContext = createContext();

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