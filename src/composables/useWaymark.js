import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useStateStore } from "@/stores/stateStore.js";
import { useImport } from "@/composables/useImport.js";
import { useWaymarkPopup } from "@/composables/useWaymarkPopup.js";
import { Waymark_Config } from "@/classes/Waymark_Config.js";
import { State } from "@/classes/State.js";

/**
 * useWaymark Composable
 *
 * Manages interactions with the Waymark map library and synchronizes map state
 * with the application state. Provides functionality for initializing, redrawing,
 * and updating map configuration.
 */
export function useWaymark() {
  /**
   * Load Waymark JS assets asynchronously
   *
   * @returns {Promise} A promise that resolves when assets are loaded
   */
  const loadAssets = () => {
    // Uses promises to return when the assets are loaded
    return new Promise((resolve, reject) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/assets/waymark-js/css/waymark-js.min.css";
      link.onload = () => {
        const script = document.createElement("script");
        script.src = "https://code.jquery.com/jquery-3.7.1.min.js";
        script.onload = () => {
          const waymarkScript = document.createElement("script");
          waymarkScript.src = "/assets/waymark-js/js/waymark-js.min.js";
          waymarkScript.onload = resolve;
          waymarkScript.onerror = reject;
          document.body.appendChild(waymarkScript);
        };
        script.onerror = reject;
        document.body.appendChild(script);
      };
      link.onerror = reject;
      document.head.appendChild(link);
    });
  };

  /**
   * Initialize the Waymark map
   * Creates and configures the map instance, loads initial data
   */
  const init = () => {
    const { Waymark, state } = storeToRefs(useStateStore());
    const { importData } = useImport();

    // Load assets
    loadAssets()
      .then(() => {
        // Create Editor Instance
        Waymark.value = window.Waymark_Map_Factory.editor();

        // Get marker types from state
        const markerTypes =
          state.value.getConfig().getMapOption("marker_types") || [];

        // Create a configuration with custom marker types from state
        const waymarkConfig = new Waymark_Config();
        waymarkConfig.setMapOption("marker_types", markerTypes);

        // Initialise with our options
        Waymark.value.init(waymarkConfig);

        // Data layer was edited
        Waymark.value.save_data_layer = function () {
          // Get the current GeoJSON from the map
          const mapGeoJSON = Waymark.value.map_data.toGeoJSON();

          // Clone the current config to ensure independence
          const clonedConfig = state.value.getConfig().clone();

          // Create a new State with the updated features and cloned config
          // This ensures we trigger the watcher in stateStore.js to add to undo stack
          state.value = new State({
            features: JSON.parse(JSON.stringify(mapGeoJSON.features || [])),
            config: clonedConfig,
          });
        };

        // Enable upload (waymark-edit-button waymark-edit-upload waymark-hidden)
        Waymark.value.handle_file_upload = importData;

        // Load the active data if available
        const features = state.value.getFeatures();
        if (features && features.length) {
          // Create GeoJSON from state
          const geoJSON = {
            type: "FeatureCollection",
            features: JSON.parse(JSON.stringify(features)),
          };

          Waymark.value.load_json(geoJSON);
        } else {
          // If no active data, load random country
          const bounds = Waymark.value.country_code_to_bounds();
          Waymark.value.map.fitBounds(bounds);
        }
        
        // Initialize the Waymark popup enhancement
        useWaymarkPopup();
      })
      .catch((error) => {
        console.error("Error loading Waymark JS assets:", error);
      });
  };

  /**
   * Redraw the map with the current state data
   * Respects the current map bounds and zoom level
   */
  /**
   * Redraw the map with current state data
   * Preserves the current map bounds and zoom level
   */
  const redrawData = () => {
    const { Waymark, state } = storeToRefs(useStateStore());

    if (Waymark.value) {
      // Get leaflet bounds & zoom
      const bounds = Waymark.value.map.getBounds();
      const zoom = Waymark.value.map.getZoom();

      // Ensure the Waymark config is up to date with state
      if (state.value && state.value.getConfig) {
        const config = state.value.getConfig();

        // Make sure Waymark config reflects the current state config
        // Get all map option keys through the method
        const mapOptionKeys = config.getMapOptionKeys();
        
        // Update each option via methods
        mapOptionKeys.forEach(key => {
          // Get the value using the getter method
          const value = config.getMapOption(key);
          // Update the Waymark map config (we can't modify the third-party library)
          Waymark.value.config.map_options[key] = value;
        });
      }

      // Clear and reload
      Waymark.value.clear_json();
      Waymark.value.map.fitBounds(bounds);
      Waymark.value.map.setZoom(zoom);

      // Create GeoJSON from state using toJSON method
      const geoJSON = {
        type: "FeatureCollection",
        features: JSON.parse(JSON.stringify(state.value.getFeatures() || [])),
      };

      Waymark.value.load_json(geoJSON);
    }
  };

  /**
   * Update the map configuration and state
   *
   * @param {Object|Waymark_Config} config - The new configuration object or
   *                                         Waymark_Config instance
   */
  /**
   * Update the map configuration
   * Creates a new state with the updated configuration while preserving features
   *
   * @param {Waymark_Config|Object} config - The new configuration
   */
  const updateConfig = (config) => {
    const { Waymark, state } = storeToRefs(useStateStore());

    if (Waymark.value && Waymark.value.config) {
      // Check if the config is already a Waymark_Config instance
      let waymarkConfig;
      if (config instanceof Waymark_Config) {
        // Clone the Waymark_Config
        waymarkConfig = config.clone();
      } else if (config) {
        // Convert regular config object to Waymark_Config
        waymarkConfig = new Waymark_Config(config);
      } else {
        console.error("Invalid configuration provided for Waymark JS.");
        return;
      }

      // Update state with the new config while keeping existing features
      // This will trigger the watcher in stateStore.js and add to the undo stack
      state.value = new State({
        features: JSON.parse(JSON.stringify(state.value.getFeatures())),
        config: waymarkConfig,
      });

      // Redraw the map with the updated configuration
      redrawData();
    }
  };

  /**
   * Reset the map configuration to defaults
   * Clears the current state and reloads the default configuration
   */
  /**
   * Reset configuration to defaults
   * Creates a new state with default configuration while preserving features
   */
  const resetConfig = () => {
    const { state } = storeToRefs(useStateStore());

    // Create a new default configuration
    const defaultConfig = new Waymark_Config();

    // Update the state config with a completely new State object
    // This will trigger the watcher in stateStore.js and add to the undo stack
    if (state.value) {
      // Create a new State with the current features but default config
      const newState = new State({
        features: JSON.parse(JSON.stringify(state.value.getFeatures())),
        config: defaultConfig,
      });

      // Update the state (this will trigger reactivity)
      state.value = newState;
    }

    // Redraw map with updated config
    redrawData();
  };

  return {
    init,
    redrawData,
    updateConfig,
    resetConfig,
  };
}
