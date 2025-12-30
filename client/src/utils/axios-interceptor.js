// src/utils/axios-interceptor.js
import axios from 'axios';

// Store request timestamps for rate limiting
const requestQueue = [];
const MAX_REQUESTS_PER_MINUTE = 30;
const REQUEST_DELAY_MS = 100;

// Clean up old requests from queue
function cleanupQueue() {
  const oneMinuteAgo = Date.now() - 60000;
  while (requestQueue.length > 0 && requestQueue[0] < oneMinuteAgo) {
    requestQueue.shift();
  }
}

// Request interceptor
axios.interceptors.request.use(
  async (config) => {
    cleanupQueue();
    
    // Check rate limit
    if (requestQueue.length >= MAX_REQUESTS_PER_MINUTE) {
      const oldestRequest = requestQueue[0];
      const waitTime = 60000 - (Date.now() - oldestRequest);
      
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
        cleanupQueue();
      }
    }
    
    // Add current request to queue
    requestQueue.push(Date.now());
    
    // Add delay between requests
    await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY_MS));
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 429 Too Many Requests
    if (error.response?.status === 429 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const retryAfter = error.response.headers['retry-after'] || 5;
      console.log(`Rate limited. Retrying after ${retryAfter} seconds...`);
      
      // Exponential backoff
      const backoffDelay = retryAfter * 1000;
      
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(axios(originalRequest));
        }, backoffDelay);
      });
    }
    
    // Handle other errors
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.status);
    }
    
    return Promise.reject(error);
  }
);

// Add request timeout
axios.defaults.timeout = 10000;

export default axios;