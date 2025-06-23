import { h, render, reactive, markRaw } from "vue";
import { storeToRefs } from "pinia";
import { useStateStore } from "@/stores/stateStore.js";

/**
 * useLeaflet Composable
 *
 * Provides functionality to render Vue components within Leaflet popups on the map.
 * Handles creating, updating, and managing popups with Vue components inside them.
 */
export function useLeaflet() {
  const { Waymark } = storeToRefs(useStateStore());

  // Track active popup and component
  const state = reactive({
    popup: null,
    currentComponent: null,
    contentRoot: null,
    isOpen: false,
  });

  /**
   * Check if Waymark and its Leaflet are initialized
   * 
   * @returns {boolean} Whether Waymark is ready
   */
  function isWaymarkReady() {
    // Check if Waymark exists and its map is loaded
    if (!Waymark.value || !Waymark.value.map || typeof window.Waymark_L === 'undefined') {
      return false;
    }
    return true;
  }

  /**
   * Create a container for Vue component rendering
   * 
   * @returns {HTMLElement} Container element for Vue component
   */
  function createContainer() {
    const container = document.createElement("div");
    container.className = "og-content-container";
    return container;
  }

  /**
   * Open a popup with a Vue component
   *
   * @param {Object} component - Vue component to render
   * @param {Object} props - Props to pass to the component
   * @param {Object} options - Leaflet popup options
   * @param {Array|Object} latlng - Position for the popup [lat, lng] or Leaflet latlng object
   * @returns {Object} Leaflet popup instance
   */
  function openPopup(component, props = {}, options = {}, latlng = null) {
    if (!isWaymarkReady()) {
      return null;
    }

    const map = Waymark.value.map;

    // Default options
    const defaultOptions = {
      className: "vue-component-popup",
      closeButton: true,
      closeOnEscapeKey: true,
      closeOnClick: true, // Close when clicking on the map
      autoClose: true,    // Auto close when clicking elsewhere
      minWidth: 200,
      maxWidth: 320,
      ...options,
    };

    // Close existing popup if any
    if (state.popup && state.isOpen) {
      closePopup();
    }

    // Create container for Vue component
    const container = createContainer();

    // Create popup with Waymark's Leaflet instance
    const popup = window.Waymark_L.popup(defaultOptions);

    // Set content
    popup.setContent(container);

    // Store references
    state.popup = popup;
    state.contentRoot = container;
    state.currentComponent = markRaw(component);

    // Determine popup position
    let position;
    if (latlng) {
      // Use provided position
      position = Array.isArray(latlng)
        ? window.Waymark_L.latLng(latlng[0], latlng[1])
        : latlng;
    } else {
      // Default to map center
      position = map.getCenter();
    }
    
    try {
      // Remove all other popups before opening
      map.closePopup();
      
      // Set the position and open the popup on the map
      popup.setLatLng(position).openOn(map);
      
      // Update state
      state.isOpen = true;
      
      // Render the Vue component into the popup
      // Set opacity to 0 initially and fade in after a short delay
      if (container) {
        container.style.opacity = '0';
        render(h(component, props), container);
        
        // Fade in the content
        setTimeout(() => {
          if (container) {
            container.style.opacity = '1';
            container.style.transition = 'opacity 0.15s ease-in';
          }
        }, 50);
      }
      
      // Handle popup close event
      popup.on("remove", () => {
        // Update state
        state.isOpen = false;
        
        // Store references to clean up
        const contentRootToClean = state.contentRoot;
        
        // Clear references immediately to prevent duplicate cleanups
        state.popup = null;
        state.currentComponent = null;
        
        // Delay cleaning up the render until after the fade animation completes
        // Leaflet's default fade animation is around 200ms
        setTimeout(() => {
          // Clean up render if content root still exists
          if (contentRootToClean) {
            render(null, contentRootToClean);
          }
          state.contentRoot = null;
          
          // Dispatch a custom event for components to listen to
          window.dispatchEvent(new CustomEvent('leaflet-popup-closed'));
        }, 250); // Slightly longer than the animation to ensure it's complete
      });
      
      // Also listen for map click events if closeOnClick is true
      if (defaultOptions.closeOnClick) {
        const onMapClick = (e) => {
          // Check if click is outside the popup
          if (state.isOpen && state.popup) {
            // Only close if clicking away from the popup
            const popupElement = state.popup.getElement();
            if (popupElement && !popupElement.contains(e.originalEvent.target)) {
              closePopup();
            }
          }
        };
        
        // Add the event listener
        map.on('click', onMapClick);
        
        // Remove the listener when popup is closed
        popup.on("remove", () => {
          map.off('click', onMapClick);
        });
      }
      
    } catch(e) {
      // Silent fail - just return null on error
      return null;
    }

    return popup;
  }

  /**
   * Update the content of an existing popup
   *
   * @param {Object} component - Vue component to render
   * @param {Object} props - Props to pass to the component
   * @returns {boolean} Success status
   */
  function updatePopup(component, props = {}) {
    if (!isWaymarkReady()) {
      return false;
    }
    
    if (!state.popup || !state.isOpen || !state.contentRoot) {
      return openPopup(component, props);
    }

    // Update component reference
    state.currentComponent = markRaw(component);

    // Render the new component
    render(h(component, props), state.contentRoot);

    // Ensure popup is properly sized for new content
    state.popup.update();

    return true;
  }

  /**
   * Close the current popup if open
   * 
   * @returns {boolean} Whether a popup was closed
   */
  function closePopup() {
    if (!isWaymarkReady()) {
      return false;
    }
    
    const map = Waymark.value.map;
    let wasClosed = false;
    
    if (state.popup && state.isOpen) {
      // Store references to clean up
      const popupToClose = state.popup;
      const contentRootToClean = state.contentRoot;
      
      // Try both methods to ensure popup is closed
      map.closePopup(popupToClose);
      
      try {
        // This might throw if the popup is already removed
        popupToClose.removeFrom(map);
      } catch(e) {
        // Silent fail - continue with cleanup
      }
      
      wasClosed = true;
      
      // Update state immediately
      state.isOpen = false;
      state.popup = null;
      state.currentComponent = null;
      
      // Delay content cleanup until after animation completes
      setTimeout(() => {
        // Clean up render if content root still exists
        if (contentRootToClean) {
          render(null, contentRootToClean);
        }
        state.contentRoot = null;
      }, 250); // Slightly longer than the animation to ensure it's complete
    } else {
      // Just in case, try to close all popups
      map.closePopup();
    }
    
    return wasClosed;
  }

  /**
   * Check if a popup is currently open
   * 
   * @returns {boolean} Whether a popup is open
   */
  function isPopupOpen() {
    // First check our internal state
    if (!state.isOpen || !state.popup) {
      return false;
    }
    
    // Then verify with the map if available
    if (isWaymarkReady()) {
      const map = Waymark.value.map;
      
      // Check if the popup is in the DOM
      const popupElement = state.popup.getElement();
      if (!popupElement || !document.body.contains(popupElement)) {
        // Popup element is not in the DOM
        state.isOpen = false;
        return false;
      }
      
      // Check if our popup is still in the map's _layers
      let foundInMap = false;
      map.eachLayer(layer => {
        if (layer === state.popup) {
          foundInMap = true;
        }
      });
      
      // If not found in map, update our state
      if (!foundInMap) {
        state.isOpen = false;
        return false;
      }
    }
    
    return state.isOpen;
  }

  /**
   * Get the current popup instance
   * 
   * @returns {Object|null} Current Leaflet popup or null
   */
  function getPopup() {
    return state.popup;
  }

  return {
    openPopup,
    updatePopup,
    closePopup,
    isPopupOpen,
    getPopup
  };
}
