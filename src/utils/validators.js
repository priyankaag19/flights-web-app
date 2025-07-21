import dayjs from 'dayjs';

export const validateSearchForm = (searchData) => {
  const errors = {};

  if (!searchData.from) {
    errors.from = 'Please select departure airport';
  }

  if (!searchData.to) {
    errors.to = 'Please select destination airport';
  }

  if (!searchData.departDate) {
    errors.departDate = 'Please select departure date';
  } else if (dayjs(searchData.departDate).isBefore(dayjs(), 'day')) {
    errors.departDate = 'Departure date cannot be in the past';
  }

  if (searchData.tripType === 'roundtrip' && !searchData.returnDate) {
    errors.returnDate = 'Please select return date';
  }

  if (searchData.returnDate && dayjs(searchData.returnDate).isBefore(searchData.departDate, 'day')) {
    errors.returnDate = 'Return date cannot be before departure date';
  }

  if (searchData.passengers < 1 || searchData.passengers > 9) {
    errors.passengers = 'Passengers must be between 1 and 9';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};