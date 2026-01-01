import { useEffect, useRef, useState, useCallback } from 'react';

export function useThrottledApi(apiCall, dependencies = [], options = {}) {
  const { 
    enabled = true, 
    throttleMs = 2000,
    cacheKey = null,
    initialData = null,
    onSuccess = null,
    onError = null,
    retryCount = 0,
    retryDelay = 1000
  } = options;
  
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryAttempt, setRetryAttempt] = useState(0);
  
  const lastCallRef = useRef(0);
  const cacheRef = useRef(new Map());
  const mountedRef = useRef(true);
  const timeoutRef = useRef(null);
  const retryTimeoutRef = useRef(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      cleanup();
    };
  }, []);

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  const executeApiCall = useCallback(async (force = false, isRetry = false) => {
    if (!enabled || !mountedRef.current) return;

    const now = Date.now();
    
    // Check cache first (unless forcing refresh)
    if (!force && cacheKey && cacheRef.current.has(cacheKey)) {
      const cached = cacheRef.current.get(cacheKey);
      if (now - cached.timestamp < throttleMs) {
        if (mountedRef.current) {
          setData(cached.data);
          setError(null);
          if (onSuccess) onSuccess(cached.data);
        }
        return;
      }
    }

    // Throttle API calls
    const timeSinceLastCall = now - lastCallRef.current;
    if (timeSinceLastCall < throttleMs && !force && !isRetry) {
      cleanup();
      timeoutRef.current = setTimeout(() => {
        if (mountedRef.current) {
          makeRequest(force);
        }
      }, throttleMs - timeSinceLastCall);
      return;
    }

    makeRequest(force);
  }, [apiCall, enabled, throttleMs, cacheKey, onSuccess, onError, cleanup]);

  const makeRequest = useCallback(async (force = false) => {
    if (!mountedRef.current) return;
    
    cleanup();
    
    lastCallRef.current = Date.now();
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      
      if (mountedRef.current) {
        setData(result);
        setError(null);
        setRetryAttempt(0);
        
        // Cache the result
        if (cacheKey) {
          cacheRef.current.set(cacheKey, {
            data: result,
            timestamp: Date.now()
          });
        }
        
        if (onSuccess) onSuccess(result);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err.message || 'Request failed');
        
        // Handle retry logic
        if (retryAttempt < retryCount) {
          setRetryAttempt(prev => prev + 1);
          retryTimeoutRef.current = setTimeout(() => {
            if (mountedRef.current) {
              executeApiCall(force, true);
            }
          }, retryDelay * Math.pow(2, retryAttempt)); // Exponential backoff
        } else {
          if (onError) onError(err);
        }
      }
    } finally {
      if (mountedRef.current && !retryTimeoutRef.current) {
        setIsLoading(false);
      }
    }
  }, [apiCall, cacheKey, onSuccess, onError, retryAttempt, retryCount, retryDelay, executeApiCall, cleanup]);

  useEffect(() => {
    if (enabled) {
      executeApiCall();
    }
    
    return cleanup;
  }, [...dependencies, enabled, executeApiCall, cleanup]);

  const refetch = useCallback((force = true) => {
    cleanup();
    setRetryAttempt(0);
    if (cacheKey && force) {
      cacheRef.current.delete(cacheKey);
    }
    executeApiCall(force);
  }, [executeApiCall, cacheKey, cleanup]);

  const clearCache = useCallback(() => {
    if (cacheKey) {
      cacheRef.current.delete(cacheKey);
    } else {
      cacheRef.current.clear();
    }
    setData(initialData);
    setError(null);
  }, [cacheKey, initialData]);

  const updateData = useCallback((newData, updateCache = true) => {
    if (mountedRef.current) {
      setData(newData);
      if (updateCache && cacheKey) {
        cacheRef.current.set(cacheKey, {
          data: newData,
          timestamp: Date.now()
        });
      }
    }
  }, [cacheKey]);

  return { 
    data, 
    isLoading, 
    error, 
    refetch, 
    clearCache,
    updateData,
    retryCount: retryAttempt,
    clearError: () => setError(null)
  };
}

// Hook for wishlist-specific API calls
export function useThrottledWishlistApi(apiCall, dependencies = [], options = {}) {
  const defaultOptions = {
    throttleMs: 3000,
    cacheKey: 'wishlist_data',
    retryCount: 2,
    retryDelay: 1500,
    ...options
  };
  
  return useThrottledApi(apiCall, dependencies, defaultOptions);
}

// Hook for cart-specific API calls
export function useThrottledCartApi(apiCall, dependencies = [], options = {}) {
  const defaultOptions = {
    throttleMs: 2000,
    cacheKey: 'cart_data',
    retryCount: 1,
    retryDelay: 1000,
    ...options
  };
  
  return useThrottledApi(apiCall, dependencies, defaultOptions);
}

// Generic hook for product API calls
export function useThrottledProductApi(apiCall, dependencies = [], options = {}) {
  const defaultOptions = {
    throttleMs: 1000,
    retryCount: 3,
    retryDelay: 500,
    ...options
  };
  
  return useThrottledApi(apiCall, dependencies, defaultOptions);
}