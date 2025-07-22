import axios from 'axios';

const api = axios.create({
  baseURL: 'https://flights-sky.p.rapidapi.com',
  headers: {
    'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'flights-sky.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  timeout: 20000,
});

api.interceptors.request.use(
  (config) => {
    // Only log the endpoint, not the full config which might contain sensitive data
    console.log('Making API request to:', config.url);
    
    // Validate API key exists
    if (!import.meta.env.VITE_RAPIDAPI_KEY) {
      console.error('❌ RapidAPI key is missing! Please check your .env file');
      throw new Error('API key is required');
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('✅ API response received for:', response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      endpoint: error.config?.url
    });
    
    // Provide more specific error messages based on status codes
    if (error.response?.status === 400) {
      error.message = 'Bad Request: Please check your search parameters';
    } else if (error.response?.status === 401) {
      error.message = 'Unauthorized: Please check your API key';
    } else if (error.response?.status === 403) {
      error.message = 'Forbidden: API key may not have required permissions';
    } else if (error.response?.status === 429) {
      error.message = 'Rate limit exceeded: Please try again later';
    } else if (error.response?.status >= 500) {
      error.message = 'Server error: Please try again later';
    }
    
    return Promise.reject(error);
  }
);

export default api;