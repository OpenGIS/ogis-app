import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import { useStateStore } from "@/stores/stateStore.js";
import { useLeaflet } from "@/composables/useLeaflet.js";
import Types from "@/components/UI/Types.vue";
import About from "@/components/UI/Menu/About.vue";

/**
 * useWaymarkPopup Composable
 *
 * Provides functionality to detect and enhance Waymark JS popups
 * by adding custom buttons and functionality.
 */
export function useWaymarkPopup() {
  const { Waymark } = storeToRefs(useStateStore());
  const { openPopup, isPopupOpen, closePopup } = useLeaflet();

  // Track the state of various popups
  const popupState = reactive({
    types: false,
    about: false,
    currentPopup: null,
  });

  /**
   * Add an "Edit Types" button to a Waymark popup when displaying
   * the edit marker/line/shape content
   *
   * @param {HTMLElement} popupContent - The popup content element
   */
  const enhancePopup = (popupContent) => {
    if (!popupContent) return;

    // Check if this popup already has our custom button
    if (popupContent.querySelector(".waymark-custom-types-button")) {
      return;
    }

    // Check if we're in an edit popup with the preview element
    const previewElement = popupContent.querySelector(
      ".waymark-overlay-preview",
    );

    // Only add the button if we're editing a feature
    if (!previewElement) {
      return;
    }

    // Determine the feature type
    let featureType = "marker"; // Default
    if (previewElement.classList.contains("waymark-line-preview")) {
      featureType = "line";
    } else if (previewElement.classList.contains("waymark-shape-preview")) {
      featureType = "shape";
    }

    // Create the Edit Types button with the appropriate text
    const editTypesButton = document.createElement("button");
    editTypesButton.className = "waymark-custom-types-button";
    editTypesButton.innerHTML = `<i class="ion-edit"></i> Edit ${featureType.charAt(0).toUpperCase() + featureType.slice(1)} Types`;
    editTypesButton.style.padding = "5px 10px";
    editTypesButton.style.border = "1px solid #ccc";
    editTypesButton.style.borderRadius = "4px";
    editTypesButton.style.cursor = "pointer";

    // Add click handler
    editTypesButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Close the Waymark popup
      if (Waymark.value && Waymark.value.map) {
        Waymark.value.map.closePopup();
      }

      // Open our Types popup with the appropriate tab
      openTypesPopup(featureType);
    });

    // Add the button as the first child of the overlay preview element
    previewElement.prepend(editTypesButton);
  };

  /**
   * Open the Types editor popup
   * @param {string} initialTab - The initial tab to display ('marker', 'line', or 'shape')
   */
  const openTypesPopup = (initialTab = "marker") => {
    // Close any open popup first
    if (popupState.about) {
      closePopup();
      popupState.about = false;
    }

    if (popupState.types) {
      // If our popup is already open, close it
      closePopup();
      popupState.types = false;
    } else {
      // Open new popup with Types component
      openPopup(
        Types,
        { initialTab },
        {
          className: "types-editor-popup",
          maxWidth: 320,
          maxHeight: 340,
          closeOnClick: true,
          autoClose: true,
        },
      );
      popupState.types = true;
      popupState.currentPopup = "types";
    }
  };

  /**
   * Open the About popup
   */
  const openAboutPopup = () => {
    // Close any open popup first
    if (popupState.types) {
      closePopup();
      popupState.types = false;
    }

    if (popupState.about) {
      // If our popup is already open, close it
      closePopup();
      popupState.about = false;
    } else {
      // Open new popup with About component
      openPopup(
        About,
        {},
        {
          className: "about-popup-container",
          maxWidth: 350,
          maxHeight: 400,
          closeOnClick: true,
          autoClose: true,
        },
      );
      popupState.about = true;
      popupState.currentPopup = "about";
    }
  };

  /**
   * Monitor Leaflet for new popups and enhance them
   */
  const monitorForPopups = () => {
    // Use MutationObserver to detect when Leaflet adds new popups to the DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.addedNodes.length) {
          mutation.addedNodes.forEach((node) => {
            // Check if this is a popup or contains a popup
            if (node.nodeType === 1) {
              // Element node
              // Check if it's a popup itself
              if (node.classList && node.classList.contains("leaflet-popup")) {
                const content = node.querySelector(".leaflet-popup-content");
                if (content) enhancePopup(content);
              }

              // Or check its children for popups
              const popupContents = node.querySelectorAll(
                ".leaflet-popup-content",
              );
              popupContents.forEach((content) => enhancePopup(content));
            }
          });
        }
      });
    });

    // Start observing the document
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Return the observer for cleanup
    return observer;
  };

  // Setup and cleanup
  let observer = null;

  onMounted(() => {
    // Start monitoring for popups
    observer = monitorForPopups();

    // Also check for any existing popups (in case they were created before this mounted)
    const existingPopupContents = document.querySelectorAll(
      ".leaflet-popup-content",
    );
    existingPopupContents.forEach((content) => enhancePopup(content));

    // Listen for popup close events
    window.addEventListener("leaflet-popup-closed", () => {
      if (popupState.currentPopup === "types") {
        popupState.types = false;
      } else if (popupState.currentPopup === "about") {
        popupState.about = false;
      }
      popupState.currentPopup = null;
    });
  });

  onBeforeUnmount(() => {
    // Clean up the observer
    if (observer) {
      observer.disconnect();
      observer = null;
    }

    // Remove event listener
    window.removeEventListener("leaflet-popup-closed", () => {
      if (popupState.currentPopup === "types") {
        popupState.types = false;
      } else if (popupState.currentPopup === "about") {
        popupState.about = false;
      }
      popupState.currentPopup = null;
    });
  });

  return {
    enhancePopup,
    openTypesPopup,
    openAboutPopup,
    isTypesPopupOpen: computed(() => popupState.types),
    isAboutPopupOpen: computed(() => popupState.about),
    popupState,
  };
}
