// src/utils/api-deduplicator.js
const pendingRequests = new Map();
const requestTimestamps = new Map();

export async function deduplicatedApiCall(key, apiCall, options = {}) {
  const { throttleMs = 1000, cacheDuration = 30000 } = options;
  const now = Date.now();
  
  // Check if we should throttle this request
  const lastRequestTime = requestTimestamps.get(key) || 0;
  if (now - lastRequestTime < throttleMs) {
    // If same request is already pending and recent, return its promise
    if (pendingRequests.has(key)) {
      return pendingRequests.get(key);
    }
  }

  // If same request is already pending, return its promise
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }

  const requestPromise = apiCall()
    .then(response => {
      // Update timestamp
      requestTimestamps.set(key, Date.now());
      
      // Cache for specified duration
      setTimeout(() => {
        pendingRequests.delete(key);
      }, cacheDuration);
      
      return response;
    })
    .catch(error => {
      // Still clear from pending on error
      pendingRequests.delete(key);
      requestTimestamps.delete(key);
      throw error;
    });

  pendingRequests.set(key, requestPromise);
  requestTimestamps.set(key, now);
  
  return requestPromise;
}

export function clearPendingRequest(key) {
  pendingRequests.delete(key);
  requestTimestamps.delete(key);
}

export function clearAllPendingRequests() {
  pendingRequests.clear();
  requestTimestamps.clear();
}