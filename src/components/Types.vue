<script setup>
import { watch, reactive, computed } from "vue";

import { storeToRefs } from "pinia";
import { useStateStore } from "@/stores/stateStore.js";
import { useWaymark } from "@/composables/useWaymark.js";
import { State } from "@/classes/State.js";

const store = useStateStore();
const { Waymark, state, isReady } = storeToRefs(store);
const { redrawData } = useWaymark();

/**
 * Converts a CSS color name to its hex value
 * Uses a canvas element to perform the conversion
 * @param {string} colorName - CSS color name (e.g., 'red', 'purple')
 * @returns {string} Hex color code (e.g., '#ff0000')
 */
function colorNameToHex(colorName) {
  // If it's already a hex color, return it
  if (colorName && colorName.startsWith("#")) {
    return colorName;
  }

  // Use a canvas element to convert the color name to hex
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d");

  // Try to set the color
  ctx.fillStyle = colorName || "#000000";

  // If the color is invalid, ctx.fillStyle will be set to black
  // Return the converted color
  return ctx.fillStyle;
}

// Create a computed property for marker types
const markerTypes = computed(() => {
  if (!state.value) return [];
  return state.value.getMarkerTypes();
});

// Create a local reactive copy to work with
const localMarkerTypes = reactive([]);

// Watch for changes to marker types from the store and update local copy
watch(
  markerTypes,
  (newTypes) => {
    // Clear the array
    localMarkerTypes.length = 0;

    // Fill with new values
    if (newTypes && newTypes.length) {
      newTypes.forEach((type) => {
        // Convert color names to hex values for the color pickers
        const newType = { ...type };

        // Process marker_colour
        if (newType.marker_colour) {
          newType.marker_colour = colorNameToHex(newType.marker_colour);
        }

        // Process icon_colour
        if (newType.icon_colour) {
          newType.icon_colour = colorNameToHex(newType.icon_colour);
        }

        localMarkerTypes.push(newType);
      });
    }
  },
  { immediate: true, deep: true },
);

// When local types are edited, update the store and Waymark
function updateMarkerTypes() {
  // Create a deep copy to ensure reactivity
  const newTypes = JSON.parse(JSON.stringify(localMarkerTypes));

  // Update state with new marker types
  if (state.value) {
    // Clone the current config
    const newConfig = state.value.getConfig().clone();

    // Update just the marker_types option
    newConfig.setMapOption("marker_types", newTypes);

    // Create a completely new State object
    const newState = new State({
      features: JSON.parse(JSON.stringify(state.value.getFeatures())),
      config: newConfig,
    });

    // Update the store with the new state
    state.value = newState;
  }
  redrawData();
}
</script>
<template>
  <table
    class="type-editor marker-types"
    v-if="isReady && localMarkerTypes.length"
  >
    <tr>
      <th>Preview</th>
      <th>Title</th>
      <th>Shape</th>
      <th>Size</th>
      <th>Colour</th>
      <th>Icon Type</th>
      <th>Icon</th>
      <th>Icon Colour</th>
    </tr>

    <tr class="marker" v-for="(type, index) in localMarkerTypes" :key="index">
      <td>
        <div
          class="type-preview"
          v-html="
            Waymark.type_preview('marker', Waymark.parse_type(type, 'marker'))
          "
        ></div>
      </td>
      <td>
        <input
          type="text"
          v-model="localMarkerTypes[index].marker_title"
          placeholder="e.g. Pub, Photo, Warning!"
          @change="updateMarkerTypes"
          @blur="updateMarkerTypes"
        />
      </td>
      <td>
        <select
          v-model="localMarkerTypes[index].marker_shape"
          @change="updateMarkerTypes"
        >
          <option value="marker">Marker</option>
          <option value="circle">Circle</option>
          <option value="rectangle">Rectangle</option>
        </select>
      </td>
      <td>
        <select
          v-model="localMarkerTypes[index].marker_size"
          @change="updateMarkerTypes"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </td>
      <td>
        <input
          type="color"
          v-model="localMarkerTypes[index].marker_colour"
          class="colour-picker"
          @change="updateMarkerTypes"
          @input="updateMarkerTypes"
        />
      </td>
      <td>
        <select
          v-model="localMarkerTypes[index].icon_type"
          @change="updateMarkerTypes"
        >
          <option value="icon">Icon</option>
          <option value="text">Text</option>
          <option value="html">HTML</option>
        </select>
      </td>
      <td>
        <input
          type="text"
          v-model="localMarkerTypes[index].marker_icon"
          placeholder="e.g. ion-beer, 🍺, or custom HTML"
          @change="updateMarkerTypes"
          @blur="updateMarkerTypes"
        />
      </td>
      <td>
        <input
          type="color"
          v-model="localMarkerTypes[index].icon_colour"
          class="colour-picker"
          @change="updateMarkerTypes"
          @input="updateMarkerTypes"
        />
      </td>
    </tr>
  </table>
</template>

<style lang="less">
.type-editor {
  border: 1px solid #ddd;
  margin: 10px 0;
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 8px;
    border: 1px solid #ddd;
  }

  th {
    background-color: #f5f5f5;
    text-align: left;
  }

  .colour-picker {
    width: 40px;
    height: 40px;
    padding: 0;
    border: none;
    cursor: pointer;
  }
}
</style>
