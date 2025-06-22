import { storeToRefs } from "pinia";
import { useStateStore } from "@/stores/stateStore.js";

/**
 * useExport Composable
 *
 * Handles exporting map data to GeoJSON format including all features
 * and the Waymark configuration settings.
 */
export function useExport() {
  const { state } = storeToRefs(useStateStore());

  /**
   * Export map data as GeoJSON with waymark configuration
   * The configuration is stored in the properties.waymark_config object
   * of the GeoJSON FeatureCollection
   *
   * @returns {void} Triggers a file download with the exported data
   */
  const exportData = () => {
    if (
      !state.value ||
      !state.value.getFeatures() ||
      !state.value.getFeatures().length
    ) {
      console.error("No data to export");
      return;
    }

    // Use the toJSON method to get a proper representation of the state
    const exportObject = state.value.toJSON();

    // GeoJSON export settings
    const exportContent = JSON.stringify(exportObject, null, 2);
    const mimeType = "application/json";
    const fileExtension = "geojson";

    // Create a blob with the data
    const blob = new Blob([exportContent], { type: mimeType });

    // Create a download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `waymark-map-export.${fileExtension}`;

    // Trigger the download
    document.body.appendChild(a);
    a.click();

    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  return {
    exportData,
  };
}
