import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export const formatPrice = (price, currency = '₹') => {
  return `${currency}${price.toLocaleString('en-IN')}`;
};

export const formatDuration = (minutes) => {
  const dur = dayjs.duration(minutes, 'minutes');
  const hours = Math.floor(dur.asHours());
  const mins = dur.minutes();
  return `${hours}h ${mins}m`;
};

export const formatTime = (time) => {
  return dayjs(time).format('HH:mm');
};

export const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD');
};

export const getStopsText = (stops) => {
  if (stops === 0) return 'Nonstop';
  if (stops === 1) return '1 stop';
  return `${stops} stops`;
};

export const generateFlightId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};