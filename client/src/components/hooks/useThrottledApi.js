// src/hooks/useThrottledApi.js
import { useEffect, useRef, useState, useCallback } from 'react';

export function useThrottledApi(apiCall, dependencies = [], options = {}) {
  const { 
    enabled = true, 
    throttleMs = 2000,
    cacheKey = null,
    initialData = null,
    onSuccess = null,
    onError = null
  } = options;
  
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const lastCallRef = useRef(0);
  const cacheRef = useRef({});
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const makeApiCall = useCallback(async (force = false) => {
    if (!enabled || !mountedRef.current) return;

    const now = Date.now();
    const timeSinceLastCall = now - lastCallRef.current;
    
    // Check cache first (unless forcing refresh)
    if (!force && cacheKey && cacheRef.current[cacheKey] && 
        (now - cacheRef.current[cacheKey].timestamp < throttleMs)) {
      const cachedData = cacheRef.current[cacheKey].data;
      if (mountedRef.current) {
        setData(cachedData);
        if (onSuccess) onSuccess(cachedData);
      }
      return;
    }

    // Throttle API calls
    if (timeSinceLastCall < throttleMs && !force) {
      const timer = setTimeout(() => {
        if (mountedRef.current) {
          executeApiCall();
        }
      }, throttleMs - timeSinceLastCall);
      
      return () => clearTimeout(timer);
    }

    executeApiCall();

    async function executeApiCall() {
      if (!mountedRef.current) return;
      
      lastCallRef.current = Date.now();
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await apiCall();
        
        if (mountedRef.current) {
          setData(result);
          
          // Cache the result
          if (cacheKey) {
            cacheRef.current[cacheKey] = {
              data: result,
              timestamp: Date.now()
            };
          }
          
          if (onSuccess) onSuccess(result);
        }
      } catch (err) {
        if (mountedRef.current) {
          setError(err.message);
          if (onError) onError(err);
        }
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    }
  }, [apiCall, enabled, throttleMs, cacheKey, onSuccess, onError]);

  useEffect(() => {
    if (enabled) {
      makeApiCall();
    }
  }, [...dependencies, enabled]);

  const refetch = useCallback(() => {
    if (cacheKey) {
      delete cacheRef.current[cacheKey];
    }
    lastCallRef.current = 0;
    makeApiCall(true);
  }, [makeApiCall, cacheKey]);

  return { data, isLoading, error, refetch, setData };
}