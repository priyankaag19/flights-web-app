export const TRIP_TYPES = {
  ROUND_TRIP: 'roundtrip',
  ONE_WAY: 'oneway',
  MULTI_CITY: 'multicity',
};

export const CABIN_CLASSES = {
  ECONOMY: 'economy',
  PREMIUM_ECONOMY: 'premium_economy',
  BUSINESS: 'business',
  FIRST: 'first',
};

export const SORT_OPTIONS = {
  PRICE: 'price',
  DURATION: 'duration',
  DEPARTURE: 'departure',
  ARRIVAL: 'arrival',
  RATING: 'rating',
};

export const API_ENDPOINTS = {
  SEARCH_AIRPORTS: '/api/v1/flights/searchAirport',
  NEARBY_AIRPORTS: '/api/v1/flights/getNearByAirports',
  SEARCH_FLIGHTS: '/api/v1/flights/searchFlights',
};

export const MOCK_AIRPORTS = [
  { skyId: 'BOM', entityId: '95673320', name: 'Mumbai', country: 'India', code: 'BOM' },
  { skyId: 'DEL', entityId: '95565050', name: 'New Delhi', country: 'India', code: 'DEL' },
  { skyId: 'JFK', entityId: '95565058', name: 'New York John F. Kennedy', country: 'United States', code: 'JFK' },
  { skyId: 'LHR', entityId: '95565046', name: 'London Heathrow', country: 'United Kingdom', code: 'LHR' },
  { skyId: 'DXB', entityId: '95565054', name: 'Dubai International', country: 'UAE', code: 'DXB' },
  { skyId: 'SIN', entityId: '95565077', name: 'Singapore Changi', country: 'Singapore', code: 'SIN' },
];