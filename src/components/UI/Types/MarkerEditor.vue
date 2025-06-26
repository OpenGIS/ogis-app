<script setup>
import { watch, reactive, computed, ref, nextTick } from "vue";

import { storeToRefs } from "pinia";
import { useStateStore } from "@/stores/stateStore.js";
import { useWaymark } from "@/composables/useWaymark.js";
import { State } from "@/classes/State.js";

const store = useStateStore();
const { Waymark, state, isReady } = storeToRefs(store);
const { redrawData } = useWaymark();

// Track which marker type is currently being edited
const selectedIndex = ref(0);

// Reference to the preview grid for scrolling
const previewGrid = ref(null);

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
        // Create a copy of the type
        const newType = { ...type };
        localMarkerTypes.push(newType);
      });
    }

    // Reset selection if it's out of bounds
    if (selectedIndex.value >= localMarkerTypes.length) {
      selectedIndex.value = 0;
    }
  },
  { immediate: true, deep: true },
);

// Get the currently selected marker type
const selectedMarkerType = computed(() => {
  if (!localMarkerTypes.length || selectedIndex.value < 0) return null;
  return localMarkerTypes[selectedIndex.value];
});

// Select a marker type for editing
function selectMarkerType(index) {
  selectedIndex.value = index;
}

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

// Add a new marker type
function addMarkerType() {
  if (state.value) {
    // Use the State class method to add a new marker type
    const newState = state.value.clone();
    newState.addMarkerType();

    // Update the store with the new state
    state.value = newState;

    // Select the newly added marker type
    selectedIndex.value = newState.getMarkerTypes().length - 1;

    // Scroll to the newly added item after the DOM updates
    nextTick(() => {
      if (previewGrid.value) {
        const lastItem = previewGrid.value.querySelector(
          ".preview-item:last-child",
        );
        if (lastItem) {
          lastItem.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }
    });
  }
}

// Delete the currently selected marker type
function deleteMarkerType() {
  if (state.value && localMarkerTypes.length > 1 && selectedIndex.value >= 0) {
    // Use the State class method to delete the marker type
    const newState = state.value.clone();
    newState.deleteMarkerType(selectedIndex.value);

    // Update the store with the new state
    state.value = newState;

    // Adjust selected index if necessary
    if (selectedIndex.value >= newState.getMarkerTypes().length) {
      selectedIndex.value = Math.max(0, newState.getMarkerTypes().length - 1);
    }
  }
}
</script>
<template>
  <div
    class="type-editor marker-editor"
    v-if="isReady && localMarkerTypes.length"
  >
    <!-- Scrollable Grid of Previews -->
    <div class="preview-grid" ref="previewGrid">
      <button
        class="add-type"
        @click="addMarkerType"
        title="Add New Marker Type"
      >
        Add Type
      </button>
      <div
        v-for="(type, index) in localMarkerTypes"
        :key="index"
        :class="['preview-item', { active: selectedIndex === index }]"
        @click="selectMarkerType(index)"
      >
        <div
          class="type-preview"
          v-html="
            Waymark.type_preview('marker', Waymark.parse_type(type, 'marker'))
          "
        ></div>
        <div class="preview-title">{{ type.marker_title }}</div>
      </div>
    </div>

    <!-- Single Edit Form -->
    <div class="edit-form" v-if="selectedMarkerType">
      <button
        v-if="localMarkerTypes.length > 1"
        class="delete-type"
        @click="deleteMarkerType"
        title="Delete This Marker Type"
      >
        Delete
      </button>
      <div class="form-grid">
        <div class="form-input">
          <label>Title</label>
          <input
            type="text"
            v-model="selectedMarkerType.marker_title"
            placeholder="e.g. Pub, Photo, Warning!"
            @change="updateMarkerTypes"
            @blur="updateMarkerTypes"
          />
        </div>

        <div class="form-group">
          <div class="form-input">
            <label>Shape</label>
            <select
              v-model="selectedMarkerType.marker_shape"
              @change="updateMarkerTypes"
            >
              <option value="marker">Marker</option>
              <option value="circle">Circle</option>
              <option value="rectangle">Rectangle</option>
            </select>
          </div>

          <div class="form-input">
            <label>Size</label>
            <select
              v-model="selectedMarkerType.marker_size"
              @change="updateMarkerTypes"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <div class="form-input">
            <label>Marker Colour</label>
            <input
              type="color"
              v-model="selectedMarkerType.marker_colour"
              class="colour-picker"
              @change="updateMarkerTypes"
              @input="updateMarkerTypes"
            />
          </div>
          <div class="form-input">
            <label>Icon Colour</label>
            <input
              type="color"
              v-model="selectedMarkerType.icon_colour"
              class="colour-picker"
              @change="updateMarkerTypes"
              @input="updateMarkerTypes"
            />
          </div>
        </div>

        <div class="form-input">
          <label>Icon Type</label>
          <select
            v-model="selectedMarkerType.icon_type"
            @change="updateMarkerTypes"
          >
            <option value="icon">Icon</option>
            <option value="text">Text</option>
            <!-- <option value="html">HTML</option> -->
          </select>
        </div>

        <div class="form-input">
          <label>Icon</label>
          <input
            type="text"
            v-model="selectedMarkerType.marker_icon"
            placeholder="e.g. ion-beer, 🍺, or custom HTML"
            @change="updateMarkerTypes"
            @blur="updateMarkerTypes"
          />
        </div>
      </div>
    </div>
  </div>
</template>
