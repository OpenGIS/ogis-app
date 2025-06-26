import { storeToRefs } from "pinia";
import { useStateStore } from "@/stores/stateStore.js";
import { Waymark_Config } from "@/classes/Waymark_Config.js";
import { State } from "@/classes/State.js";

/**
 * useExport Composable
 *
 * Handles exporting map data to GeoJSON format including all features
 * and the Waymark configuration settings.
 * Only includes marker, line, and shape types that are actually used by features in the map.
 */
export function useExport() {
  const { state, Waymark } = storeToRefs(useStateStore());

  /**
   * Export map data as GeoJSON with waymark configuration
   * The configuration is stored in the properties.waymark_config object
   * of the GeoJSON FeatureCollection
   *
   * @returns {Promise<void>} Triggers a file download with the exported data
   */
  const exportData = async () => {
    if (
      !state.value ||
      !state.value.getFeatures() ||
      !state.value.getFeatures().length
    ) {
      console.error("No data to export");
      return;
    }

    // Get the features for export
    const features = state.value.getFeatures();
    
    // Define configuration for each type of feature (marker, line, shape)
    const typeConfigs = [
      {
        name: 'marker',
        geometryTypes: ['Point'],
        titleField: 'marker_title',
        getter: 'getMarkerTypes',
        setter: 'setMarkerTypes'
      },
      {
        name: 'line',
        geometryTypes: ['LineString', 'MultiLineString'],
        titleField: 'line_title',
        getter: 'getLineTypes',
        setter: 'setLineTypes'
      },
      {
        name: 'shape',
        geometryTypes: ['Polygon', 'MultiPolygon'],
        titleField: 'shape_title',
        getter: 'getShapeTypes',
        setter: 'setShapeTypes'
      }
    ];
    
    // Create a mapping of geometry types to their feature type (marker, line, shape)
    const geometryTypeMap = {};
    typeConfigs.forEach(config => {
      config.geometryTypes.forEach(geoType => {
        geometryTypeMap[geoType] = config.name;
      });
    });
    
    // Create sets for used type keys by feature type
    const usedTypeKeys = {
      marker: new Set(),
      line: new Set(),
      shape: new Set()
    };
    
    // Collect all type keys from feature properties based on geometry type
    features.forEach(feature => {
      if (!feature.properties || !feature.properties.type || !feature.geometry) return;
      
      const geoType = feature.geometry.type;
      const featureType = geometryTypeMap[geoType];
      
      if (featureType) {
        usedTypeKeys[featureType].add(feature.properties.type);
      }
    });
    
    // Process each feature type to filter to only used types
    const filteredTypes = {};
    typeConfigs.forEach(config => {
      const allTypes = state.value[config.getter]();
      const usedTypes = allTypes.filter(type => {
        // Skip if title is missing
        if (!type || !type[config.titleField]) return false;
        
        // Get the key (slug) that Waymark uses for this type
        const typeKey = Waymark.value.make_key(type[config.titleField]);
        
        return usedTypeKeys[config.name].has(typeKey);
      });
      
      filteredTypes[config.name] = usedTypes;
    });
    
    // Create a clone of the current state for export
    const exportState = new State({
      features: JSON.parse(JSON.stringify(features)),
      config: state.value.getConfig().clone()
    });
    
    // Update all types in the export state to only include used types
    typeConfigs.forEach(config => {
      exportState[config.setter](filteredTypes[config.name]);
    });
    
    // Convert to plain object for export
    const exportObject = exportState.toJSON ? exportState.toJSON() : exportState;

    // GeoJSON export settings
    const exportContent = JSON.stringify(exportObject, null, 2);
    const mimeType = "application/json";
    const fileExtension = "geojson";

    // Create a blob with the data
    const blob = new Blob([exportContent], { type: mimeType });
    
    // Generate timestamp-based filename
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const timestamp = `${year}-${month}-${day}-${hour}-${minute}`;
    const filename = `ogis-map-${timestamp}.${fileExtension}`;

    // Try to use the modern File System Access API if available
    if ('showSaveFilePicker' in window) {
      try {
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: filename,
          types: [{
            description: 'GeoJSON files',
            accept: { 'application/json': ['.geojson'] }
          }]
        });
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch (err) {
        // User cancelled or API not supported, fall through to alternative methods
        console.log('File System Access API not available or cancelled, using fallback');
      }
    }

    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    
    // Different approaches for different browsers/devices
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (isMobile || isSafari) {
      // For mobile/Safari, try to force download by setting additional attributes
      a.style.display = 'none';
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
      
      // iOS Safari specific handling
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        // For iOS, we need to handle this differently
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        
        // Create a click event
        const clickEvent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: false
        });
        
        link.dispatchEvent(clickEvent);
        
        // Clean up
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 100);
        
        return;
      }
    }

    // Standard approach for desktop browsers
    document.body.appendChild(a);
    
    // Use both click() and MouseEvent for better compatibility
    try {
      a.click();
    } catch (e) {
      // Fallback for browsers that block programmatic clicks
      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      a.dispatchEvent(clickEvent);
    }

    // Clean up
    setTimeout(() => {
      if (document.body.contains(a)) {
        document.body.removeChild(a);
      }
      URL.revokeObjectURL(url);
    }, 100);
  };

  return {
    exportData,
  };
}
