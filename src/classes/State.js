/**
 * State class
 * 
 * Represents the complete application state including GeoJSON FeatureCollection
 * and Waymark_Config instance. Acts as single source of truth for the application.
 * All map data and configuration is stored here, allowing for undo/redo
 * functionality and localStorage persistence.
 */
import { Waymark_Config } from "@/classes/Waymark_Config.js";

export class State {
  /**
   * Create a new State instance
   * 
   * @param {Object} data - Optional initial data
   * @param {Array} data.features - GeoJSON features array
   * @param {Waymark_Config|Object} data.config - Waymark configuration
   */
  constructor(data = {}) {
    // Initialize with default structure
    this.type = "FeatureCollection";
    // Always deep clone features to ensure reactivity
    this.features = data.features ? JSON.parse(JSON.stringify(data.features)) : [];
    this.properties = {
      waymark_config: data.config instanceof Waymark_Config 
        ? data.config 
        : new Waymark_Config(data.config || {})
    };
  }

  /**
   * Get the GeoJSON features
   * 
   * @returns {Array} The features array
   */
  getFeatures() {
    return this.features;
  }

  /**
   * Set the GeoJSON features
   * 
   * @param {Array} features - The features array
   */
  setFeatures(features) {
    this.features = features || [];
  }

  /**
   * Get a specific feature by its id
   * 
   * @param {string} id - The feature id
   * @returns {Object|null} The feature or null if not found
   */
  getFeatureById(id) {
    return this.features.find(feature => feature.id === id || feature.properties?.id === id) || null;
  }

  /**
   * Update a specific feature
   * Creates a new array reference to ensure reactivity
   * 
   * @param {string} id - The feature id
   * @param {Object} updatedFeature - The updated feature
   * @returns {boolean} True if the feature was updated, false otherwise
   */
  updateFeature(id, updatedFeature) {
    const index = this.features.findIndex(feature => feature.id === id || feature.properties?.id === id);
    if (index === -1) return false;
    
    // Create a deep clone of the updatedFeature
    const clonedFeature = JSON.parse(JSON.stringify(updatedFeature));
    
    // Create a new array to ensure reactivity
    const newFeatures = [...this.features];
    newFeatures[index] = clonedFeature;
    this.features = newFeatures;
    
    return true;
  }

  /**
   * Update a feature's properties
   * Creates a new array reference and feature object to ensure reactivity
   * 
   * @param {string} id - The feature id
   * @param {Object} properties - The properties to update
   * @returns {boolean} True if the properties were updated, false otherwise
   */
  updateFeatureProperties(id, properties) {
    const index = this.features.findIndex(feature => feature.id === id || feature.properties?.id === id);
    if (index === -1) return false;
    
    // Create a deep clone of the properties
    const clonedProperties = JSON.parse(JSON.stringify(properties));
    
    // Create a new array with a new feature object to ensure reactivity
    const newFeatures = [...this.features];
    newFeatures[index] = {
      ...newFeatures[index],
      properties: {
        ...newFeatures[index].properties,
        ...clonedProperties
      }
    };
    
    this.features = newFeatures;
    return true;
  }

  /**
   * Add a new feature
   * Creates a new array reference to ensure reactivity
   * 
   * @param {Object} feature - The feature to add
   * @returns {State} This instance for chaining
   */
  addFeature(feature) {
    // Create a deep clone of the feature
    const clonedFeature = JSON.parse(JSON.stringify(feature));
    
    // Create a new array to ensure reactivity
    this.features = [...this.features, clonedFeature];
    return this;
  }

  /**
   * Remove a feature by its id
   * Creates a new array reference to ensure reactivity
   * 
   * @param {string} id - The feature id
   * @returns {boolean} True if the feature was removed, false otherwise
   */
  removeFeature(id) {
    const initialLength = this.features.length;
    this.features = this.features.filter(feature => 
      feature.id !== id && feature.properties?.id !== id
    );
    return initialLength !== this.features.length;
  }

  /**
   * Get the Waymark configuration
   * 
   * @returns {Waymark_Config} The Waymark configuration instance
   */
  getConfig() {
    return this.properties.waymark_config;
  }

  /**
   * Set the Waymark configuration
   * 
   * @param {Waymark_Config|Object} config - The Waymark configuration
   */
  setConfig(config) {
    this.properties.waymark_config = config instanceof Waymark_Config 
      ? config 
      : new Waymark_Config(config || {});
  }

  /**
   * Get a specific configuration option
   * 
   * @param {string} key - The option key
   * @returns {any} The option value
   */
  getConfigOption(key) {
    return this.properties.waymark_config.getMapOption(key);
  }

  /**
   * Set a specific configuration option
   * 
   * @param {string} key - The option key
   * @param {any} value - The option value
   * @returns {State} This instance for chaining
   */
  setConfigOption(key, value) {
    this.properties.waymark_config.setMapOption(key, value);
    return this;
  }

  /**
   * Get marker types from the configuration
   * 
   * @returns {Array} The marker types array
   */
  getMarkerTypes() {
    return this.getConfigOption('marker_types') || [];
  }

  /**
   * Set marker types in the configuration
   * Creates a deep copy to ensure independence
   * 
   * @param {Array} markerTypes - The marker types array
   * @returns {State} This instance for chaining
   */
  setMarkerTypes(markerTypes) {
    // Create a deep copy of the marker types to ensure they're independent
    const markerTypesCopy = JSON.parse(JSON.stringify(markerTypes));
    return this.setConfigOption('marker_types', markerTypesCopy);
  }

  /**
   * Convert to plain object for serialization
   * 
   * @returns {Object} A plain object representation
   */
  toJSON() {
    return {
      type: this.type,
      features: this.features,
      properties: {
        waymark_config: this.properties.waymark_config
      }
    };
  }

  /**
   * Create a clone of this State
   * Creates a completely new State instance with deep-cloned data
   * 
   * @returns {State} A new State instance with the same data
   */
  clone() {
    // Clone the config
    const clonedConfig = this.getConfig().clone();
    
    // Create a new State with deep-cloned features and config
    return new State({
      features: JSON.parse(JSON.stringify(this.features)),
      config: clonedConfig
    });
  }

  /**
   * Check if this State has any features
   * 
   * @returns {boolean} True if there are features, false otherwise
   */
  hasFeatures() {
    return this.features && this.features.length > 0;
  }

  /**
   * Create a State instance from a GeoJSON object
   * 
   * @param {Object|string} geoJSON - The GeoJSON object or string
   * @returns {State} A new State instance
   */
  static fromGeoJSON(geoJSON) {
    if (!geoJSON) {
      return new State();
    }

    // Handle different possible input types
    if (typeof geoJSON === 'string') {
      try {
        geoJSON = JSON.parse(geoJSON);
      } catch (e) {
        console.error('Invalid GeoJSON string:', e);
        return new State();
      }
    }

    // Check if it's already a State instance
    if (geoJSON instanceof State) {
      return geoJSON.clone();
    }

    // Check if it's a valid GeoJSON FeatureCollection
    if (geoJSON.type !== 'FeatureCollection') {
      console.warn('Invalid GeoJSON: not a FeatureCollection');
      return new State();
    }

    // Extract config from properties
    const config = geoJSON.properties?.waymark_config 
      ? geoJSON.properties.waymark_config 
      : {};

    // Create new instance with features and config
    return new State({
      features: geoJSON.features || [],
      config: config
    });
  }
}
