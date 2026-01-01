// Utility for broadcasting cart updates across components
class CartEventSystem {
  constructor() {
    this.listeners = new Set();
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    this.listeners.forEach(callback => callback());
  }

  // Broadcast to other tabs
  broadcast() {
    // Update localStorage to trigger storage event
    localStorage.setItem('cart_last_updated', Date.now().toString());
    
    // Dispatch custom event for same tab
    window.dispatchEvent(new CustomEvent('cart-updated', {
      detail: { timestamp: Date.now() }
    }));
  }
}

export const cartEvents = new CartEventSystem();

// Helper function to trigger cart updates
export const triggerCartUpdate = () => {
  cartEvents.notify();
  cartEvents.broadcast();
};