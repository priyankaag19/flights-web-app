// src/utils/testApi.js
// Use this utility to test your API connection

export const testApiConnection = async () => {
  const apiKey = import.meta.env.VITE_RAPIDAPI_KEY;
  
  if (!apiKey) {
    console.error('❌ API Key is missing!');
    return false;
  }

  try {
    console.log('🧪 Testing API connection...');
    
    const response = await fetch('https://flights-sky.p.rapidapi.com/flights/auto-complete?query=London', {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'flights-sky.p.rapidapi.com',
        'Content-Type': 'application/json'
      }
    });

    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      return false;
    }

    const data = await response.json();
    console.log('✅ API Response:', data);
    return true;

  } catch (error) {
    console.error('❌ Network Error:', error);
    return false;
  }
};