// import axios from 'axios';

// // Define API base URL - Use environment variable or default
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// // Create axios instance with proper configuration
// const axiosInstance = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 15000, // Increased timeout for better UX
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true, // Important for cookie-based auth
// });

// // Request interceptor to add token from both localStorage and cookies
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // Try to get token from localStorage (for JWT if used)
//     const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    
//     // Also check for auth token in cookies (server will handle this)
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
    
//     // Add CSRF token if available
//     const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
//     if (csrfToken) {
//       config.headers['X-CSRF-Token'] = csrfToken;
//     }
    
//     return config;
//   },
//   (error) => {
//     console.error('Request interceptor error:', error);
//     return Promise.reject(error);
//   }
// );

// // Response interceptor for comprehensive error handling
// axiosInstance.interceptors.response.use(
//   (response) => {
//     // You can modify response data here if needed
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
    
//     // Handle network errors
//     if (!error.response) {
//       console.error('Network Error: Please check your internet connection');
//       // You could dispatch a network error event here
//       window.dispatchEvent(new CustomEvent('network-error', { detail: error }));
//       return Promise.reject({
//         message: 'Network error. Please check your connection.',
//         isNetworkError: true
//       });
//     }
    
//     const { status, data } = error.response;
    
//     // Handle specific HTTP status codes
//     switch (status) {
//       case 401: // Unauthorized
//         console.warn('Unauthorized: Session may have expired');
//         localStorage.removeItem('token');
//         localStorage.removeItem('accessToken');
//         localStorage.removeItem('user');
//         // Dispatch event for global auth handling
//         window.dispatchEvent(new Event('unauthorized'));
        
//         // Optionally try to refresh token here if you have refresh token logic
//         if (!originalRequest._retry && data?.message?.includes('token')) {
//           originalRequest._retry = true;
//           // You could add token refresh logic here
//         }
//         break;
        
//       case 403: // Forbidden
//         console.error('Forbidden: You do not have permission to access this resource');
//         // Dispatch event for permission handling
//         window.dispatchEvent(new CustomEvent('forbidden', { detail: data }));
//         break;
        
//       case 404: // Not Found
//         console.error('Not Found: The requested resource was not found');
//         break;
        
//       case 422: // Validation Error
//         console.error('Validation Error:', data?.errors || data?.message);
//         break;
        
//       case 429: // Too Many Requests
//         console.error('Rate Limited: Too many requests. Please slow down.');
//         // Show user-friendly message
//         error.message = 'Too many requests. Please wait a moment before trying again.';
//         break;
        
//       case 500: // Internal Server Error
//       case 502: // Bad Gateway
//       case 503: // Service Unavailable
//       case 504: // Gateway Timeout
//         console.error(`Server Error (${status}): Please try again later`);
//         error.message = 'Server is temporarily unavailable. Please try again in a few moments.';
//         break;
        
//       default:
//         console.error(`Request failed with status ${status}:`, error.message);
//     }
    
//     // Return a consistent error format
//     return Promise.reject({
//       status: status,
//       message: data?.message || error.message || 'An unexpected error occurred',
//       errors: data?.errors,
//       data: data,
//       isAxiosError: true
//     });
//   }
// );

// // Optional: Add retry logic for certain requests
// const MAX_RETRIES = 2;
// const RETRY_DELAY = 1000;

// axiosInstance.interceptors.response.use(undefined, async (err) => {
//   const config = err.config;
  
//   // Don't retry if already retried or not a retryable error
//   if (!config || config._retryCount >= MAX_RETRIES) {
//     return Promise.reject(err);
//   }
  
//   // Only retry on network errors or 5xx errors
//   const shouldRetry = !err.response || 
//     (err.response.status >= 500 && err.response.status < 600) ||
//     err.code === 'ECONNABORTED' ||
//     err.message.includes('Network Error');
  
//   if (!shouldRetry) {
//     return Promise.reject(err);
//   }
  
//   config._retryCount = (config._retryCount || 0) + 1;
  
//   // Create a delay before retrying
//   await new Promise(resolve => 
//     setTimeout(resolve, RETRY_DELAY * config._retryCount)
//   );
  
//   return axiosInstance(config);
// });

// export default axiosInstance;


import axios from 'axios';

// Define API base URL - Use environment variable or default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with proper configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Increased timeout for better UX
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Keep this for refresh token cookies
});

// Request interceptor to add token from localStorage (JWT)
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage - match your authSlice storage key (app_token)
    // Your SecureStorage class adds "app_" prefix to all keys
    const token = localStorage.getItem('app_token');
    
    // Add Authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add CSRF token if available
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for comprehensive error handling
axiosInstance.interceptors.response.use(
  (response) => {
    // Check if response has a new token (e.g., from refresh endpoint)
    if (response.data?.token) {
      // Store new token with correct key
      localStorage.setItem('app_token', response.data.token);
      // Update axios instance header
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle network errors
    if (!error.response) {
      console.error('Network Error: Please check your internet connection');
      window.dispatchEvent(new CustomEvent('network-error', { detail: error }));
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        isNetworkError: true
      });
    }
    
    const { status, data } = error.response;
    
    // Handle specific HTTP status codes
    switch (status) {
      case 401: // Unauthorized - No token or invalid token
        console.warn('Unauthorized: No valid authentication token');
        
        // Clear auth data - match your authSlice storage keys
        localStorage.removeItem('app_token');
        localStorage.removeItem('app_user');
        localStorage.removeItem('app_auth_timestamp');
        
        // Dispatch event for global auth handling
        window.dispatchEvent(new Event('unauthorized'));
        
        // Redirect to login if not already on auth page
        if (!window.location.pathname.startsWith('/auth/')) {
          setTimeout(() => {
            window.location.href = '/auth/login';
          }, 100);
        }
        break;
        
      case 403: // Forbidden - Token expired or insufficient permissions
        console.warn('Forbidden: Token expired or insufficient permissions');
        
        // Try to refresh token if this is the first 403 for this request
        if (!originalRequest._retry && (data?.message?.includes('expired') || data?.message?.includes('Invalid'))) {
          originalRequest._retry = true;
          
          try {
            // Call refresh token endpoint
            const refreshResponse = await axios.post(
              `${API_BASE_URL}/auth/refresh-token`,
              {},
              { withCredentials: true } // Important for cookie-based refresh
            );
            
            if (refreshResponse.data?.token) {
              // Store new token with correct key
              localStorage.setItem('app_token', refreshResponse.data.token);
              
              // Update original request with new token
              originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
              
              // Retry original request
              return axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            // Refresh failed, clear everything and redirect
            localStorage.clear();
            window.location.href = '/auth/login';
          }
        } else {
          // Not a token expiration issue - show permission error
          window.dispatchEvent(new CustomEvent('forbidden', { detail: data }));
        }
        break;
        
      case 404: // Not Found
        console.error('Not Found: The requested resource was not found');
        break;
        
      case 422: // Validation Error
        console.error('Validation Error:', data?.errors || data?.message);
        break;
        
      case 429: // Too Many Requests
        console.error('Rate Limited: Too many requests. Please slow down.');
        error.message = 'Too many requests. Please wait a moment before trying again.';
        break;
        
      case 500: // Internal Server Error
      case 502: // Bad Gateway
      case 503: // Service Unavailable
      case 504: // Gateway Timeout
        console.error(`Server Error (${status}): Please try again later`);
        error.message = 'Server is temporarily unavailable. Please try again in a few moments.';
        break;
        
      default:
        console.error(`Request failed with status ${status}:`, error.message);
    }
    
    // Return a consistent error format
    return Promise.reject({
      status: status,
      message: data?.message || error.message || 'An unexpected error occurred',
      errors: data?.errors,
      data: data,
      isAxiosError: true
    });
  }
);

// Optional: Add retry logic for certain requests
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

axiosInstance.interceptors.response.use(undefined, async (err) => {
  const config = err.config;
  
  // Don't retry if already retried or not a retryable error
  if (!config || config._retryCount >= MAX_RETRIES) {
    return Promise.reject(err);
  }
  
  // Only retry on network errors or 5xx errors
  const shouldRetry = !err.response || 
    (err.response.status >= 500 && err.response.status < 600) ||
    err.code === 'ECONNABORTED' ||
    err.message.includes('Network Error');
  
  if (!shouldRetry) {
    return Promise.reject(err);
  }
  
  config._retryCount = (config._retryCount || 0) + 1;
  
  // Create a delay before retrying
  await new Promise(resolve => 
    setTimeout(resolve, RETRY_DELAY * config._retryCount)
  );
  
  return axiosInstance(config);
});

export default axiosInstance;