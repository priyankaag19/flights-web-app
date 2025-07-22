import React, { useState, useEffect, useMemo } from 'react';
import { useFlightContext } from '../../context/FlightContext';
import { Plane, Clock, Filter, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FlightResultsDisplay = () => {
    const navigate = useNavigate();
  const { 
    flights, 
    loading, 
    error, 
    searchParams, 
    clearSearch,
    searchPerformed 
  } = useFlightContext();

  const [sortBy, setSortBy] = useState('price');
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 50000]);

  // Calculate min and max prices from available flights
  const { minPrice, maxPrice } = useMemo(() => {
    if (!flights || flights.length === 0) {
      return { minPrice: 0, maxPrice: 50000 };
    }

    const prices = flights
      .map(flight => flight.price?.amount || 0)
      .filter(price => price > 0);

    if (prices.length === 0) {
      return { minPrice: 0, maxPrice: 50000 };
    }

    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices)
    };
  }, [flights]);

  // Update price range when flights change
  useEffect(() => {
    if (flights && flights.length > 0 && maxPrice > 0) {
      setPriceRange([minPrice, maxPrice]);
    }
  }, [flights, minPrice, maxPrice]);

  // Don't render if no search has been performed
  if (!searchPerformed) {
    return null;
  }

  // Sort flights
  const sortedFlights = [...flights].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return (a.price?.amount || 0) - (b.price?.amount || 0);
      case 'duration':
        return (a.durationInMinutes || 0) - (b.durationInMinutes || 0);
      case 'departure':
        return (a.departure?.time || '').localeCompare(b.departure?.time || '');
      default:
        return 0;
    }
  });

  // Filter by price
  const filteredFlights = sortedFlights.filter(flight => {
    const price = flight.price?.amount || 0;
    return price >= priceRange[0] && price <= priceRange[1];
  });

  const handleMinPriceChange = (e) => {
    const value = parseInt(e.target.value);
    setPriceRange([value, priceRange[1]]);
  };

  const handleMaxPriceChange = (e) => {
    const value = parseInt(e.target.value);
    setPriceRange([priceRange[0], value]);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header with Back Button */}
      <div className="mb-8">
    <button
  onClick={() => {
    clearSearch();
    navigate('/');
  }}
  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
>
  <ArrowLeft className="h-4 w-4" />
  Back to Search
</button>

        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Flight Results</h1>
        <p className="text-gray-600">
          {searchParams.from?.name || searchParams.from} → {searchParams.to?.name || searchParams.to}
          {searchParams.departureDate && ` • ${new Date(searchParams.departureDate).toLocaleDateString()}`}
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="price">Sort by Price</option>
              <option value="duration">Sort by Duration</option>
              <option value="departure">Sort by Departure</option>
            </select>

            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>

          <div className="text-sm text-gray-600">
            {filteredFlights.length} of {flights.length} flight(s) found
          </div>
        </div>

        {/* Price Filter */}
        {filterOpen && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Price Range (₹)
              </label>
              
              {/* Min Price Slider */}
              <div className="mb-4">
                <label className="block text-xs text-gray-500 mb-1">
                  Minimum Price: ₹{priceRange[0].toLocaleString()}
                </label>
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  step="500"
                  value={priceRange[0]}
                  onChange={handleMinPriceChange}
                  className="w-full"
                />
              </div>
              
              {/* Max Price Slider */}
              <div className="mb-4">
                <label className="block text-xs text-gray-500 mb-1">
                  Maximum Price: ₹{priceRange[1].toLocaleString()}
                </label>
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  step="500"
                  value={priceRange[1]}
                  onChange={handleMaxPriceChange}
                  className="w-full"
                />
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Available: ₹{minPrice.toLocaleString()}</span>
                <span>₹{maxPrice.toLocaleString()}</span>
              </div>

              {/* Reset Filter Button */}
              <button
                onClick={() => setPriceRange([minPrice, maxPrice])}
                className="mt-3 px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
              >
                Reset Filter
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Searching for flights...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && !error && flights.length === 0 && (
        <div className="text-center py-12">
          <Plane className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No flights found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Flight Results */}
      <div className="space-y-4">
        {filteredFlights.map((flight, index) => (
          <div key={flight.id || index} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
              {/* Airline */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plane className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">
                    {flight.airline || 'Unknown Airline'}
                  </div>
                  <div className="font-semibold">
                    {flight.carrierCode} {flight.flightNumber}
                  </div>
                </div>
              </div>

              {/* Departure */}
              <div>
                <div className="text-xl font-bold">
                  {flight.departure?.time || 'N/A'}
                </div>
                <div className="text-sm text-gray-600">
                  {flight.departure?.airport || 'N/A'}
                </div>
                <div className="text-xs text-gray-500">
                  {flight.departure?.city || 'N/A'}
                </div>
              </div>

              {/* Duration */}
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">
                  {flight.duration || 'N/A'}
                </div>
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <div className="h-0.5 w-8 bg-gray-300"></div>
                  <Plane className="h-4 w-4 text-blue-600" />
                  <div className="h-0.5 w-8 bg-gray-300"></div>
                </div>
                <div className="text-xs text-gray-500">
                  {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop(s)`}
                </div>
              </div>

              {/* Arrival */}
              <div>
                <div className="text-xl font-bold">
                  {flight.arrival?.time || 'N/A'}
                </div>
                <div className="text-sm text-gray-600">
                  {flight.arrival?.airport || 'N/A'}
                </div>
                <div className="text-xs text-gray-500">
                  {flight.arrival?.city || 'N/A'}
                </div>
              </div>

              {/* Price & Book */}
              <div className="text-center lg:text-right">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  ₹{flight.price?.amount?.toLocaleString() || 'N/A'}
                </div>
                <div className="text-xs text-gray-500 mb-3">per person</div>
                <button className="w-full lg:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Select Flight
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results After Filtering */}
      {!loading && filteredFlights.length === 0 && flights.length > 0 && (
        <div className="text-center py-12">
          <Filter className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No flights match your filters</h3>
          <p className="text-gray-500">Try adjusting your price range or other filters</p>
          <button
            onClick={() => setPriceRange([minPrice, maxPrice])}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FlightResultsDisplay;