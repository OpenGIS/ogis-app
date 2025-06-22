import { storeToRefs } from "pinia";
import { useStateStore } from "@/stores/stateStore.js";
import { useWaymark } from "@/composables/useWaymark.js";
import { State } from "@/classes/State.js";

/**
 * useImport Composable
 *
 * Handles importing map data from various file formats (GeoJSON, KML, GPX)
 * and updates the application state accordingly.
 */
export function useImport() {
  const { Waymark, state } = storeToRefs(useStateStore());
  const { redrawData } = useWaymark();

  /**
   * Import map data from a file
   * Supports GeoJSON, KML, and GPX formats
   * Updates the application state with the imported data
   *
   * @param {FileList} input - The file input element containing the file to import
   */
  const importData = (input) => {
    // Handle the file upload logic here
    const file = input[0].files[0];

    if (file) {
      // Get filename extension
      const fileExtension = file.name.split(".").pop().toLowerCase();

      // Allow .json, .geojson, .kml and .gpx files
      if (!["json", "geojson", "kml", "gpx"].includes(fileExtension)) {
        console.error(
          "Unsupported file type. Please upload a .json, .geojson, .kml, or .gpx file.",
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        let fileData = e.target.result;

        // If GeoJSON
        if (fileExtension === "geojson" || fileExtension === "json") {
          try {
            let geoJSON = JSON.parse(fileData);

            // Create a State instance from the GeoJSON
            if (geoJSON.type === "FeatureCollection") {
              try {
                // Create a new State instance from the GeoJSON
                const importedState = State.fromGeoJSON(geoJSON);
                state.value = importedState;

                // Redraw the map with the imported data
                redrawData();
                return;
              } catch (error) {
                console.error("Error processing GeoJSON configuration:", error);
                // Continue with regular import if there was an error
              }
            }
          } catch (error) {
            console.error("Error parsing GeoJSON:", error);
            return;
          }
        }

        // For non-GeoJSON formats or if there was an error above
        // Allow Waymark JS to handle the import
        Waymark.value.load_file_contents(fileData, fileExtension);

        // After Waymark JS loads the file, we need to update our state
        // This will happen via the save_data_layer callback we set in init()
      };
      reader.readAsText(file);
    }
  };

  return {
    importData,
  };
}
