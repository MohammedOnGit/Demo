// src/utils/optimistic-updates.js
export function createOptimisticUpdate(actionType, payload, revertAction) {
  return {
    type: actionType,
    payload: {
      ...payload,
      _optimistic: true,
      _timestamp: Date.now()
    },
    meta: {
      revertAction,
      revertPayload: payload
    }
  };
}

export function shouldApplyOptimisticUpdate(state, action) {
  // Check if this optimistic update is still valid
  if (!action.payload._optimistic) return true;
  
  // Check if we have a newer update
  const existingUpdate = state._lastOptimisticUpdate;
  if (existingUpdate && existingUpdate.timestamp > action.payload._timestamp) {
    return false;
  }
  
  return true;
}

export function revertOptimisticUpdate(dispatch, revertAction, revertPayload) {
  dispatch({
    type: revertAction,
    payload: revertPayload
  });
}

// Store for tracking optimistic updates
const optimisticStore = {
  updates: new Map(),
  
  addUpdate(key, update) {
    this.updates.set(key, {
      ...update,
      timestamp: Date.now()
    });
  },
  
  getUpdate(key) {
    return this.updates.get(key);
  },
  
  removeUpdate(key) {
    this.updates.delete(key);
  },
  
  clearOldUpdates(maxAge = 60000) {
    const now = Date.now();
    for (const [key, update] of this.updates.entries()) {
      if (now - update.timestamp > maxAge) {
        this.updates.delete(key);
      }
    }
  }
};

export { optimisticStore };