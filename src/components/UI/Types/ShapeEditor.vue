<script setup>
import { watch, reactive, computed, ref, nextTick } from "vue";

import { storeToRefs } from "pinia";
import { useStateStore } from "@/stores/stateStore.js";
import { useWaymark } from "@/composables/useWaymark.js";
import { State } from "@/classes/State.js";

const store = useStateStore();
const { Waymark, state, isReady } = storeToRefs(store);
const { redrawData } = useWaymark();

// Track which shape type is currently being edited
const selectedIndex = ref(0);

// Reference to the preview grid for scrolling
const previewGrid = ref(null);

// Create a computed property for shape types
const shapeTypes = computed(() => {
  if (!state.value) return [];
  return state.value.getShapeTypes();
});

// Create a local reactive copy to work with
const localShapeTypes = reactive([]);

// Watch for changes to shape types from the store and update local copy
watch(
  shapeTypes,
  (newTypes) => {
    // Clear the array
    localShapeTypes.length = 0;

    // Fill with new values
    if (newTypes && newTypes.length) {
      newTypes.forEach((type) => {
        // Create a copy of the type
        const newType = { ...type };
        localShapeTypes.push(newType);
      });
    }

    // Reset selection if it's out of bounds
    if (selectedIndex.value >= localShapeTypes.length) {
      selectedIndex.value = 0;
    }
  },
  { immediate: true, deep: true },
);

// Get the currently selected shape type
const selectedShapeType = computed(() => {
  if (!localShapeTypes.length || selectedIndex.value < 0) return null;
  return localShapeTypes[selectedIndex.value];
});

// Select a shape type for editing
function selectShapeType(index) {
  selectedIndex.value = index;
}

// When local types are edited, update the store and Waymark
function updateShapeTypes() {
  // Create a deep copy to ensure reactivity
  const newTypes = JSON.parse(JSON.stringify(localShapeTypes));

  // Update state with new shape types
  if (state.value) {
    // Clone the current config
    const newConfig = state.value.getConfig().clone();

    // Update just the shape_types option
    newConfig.setMapOption("shape_types", newTypes);

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

// Add a new shape type
function addShapeType() {
  if (state.value) {
    // Use the State class method to add a new shape type
    const newState = state.value.clone();
    newState.addShapeType();

    // Update the store with the new state
    state.value = newState;

    // Select the newly added shape type
    selectedIndex.value = newState.getShapeTypes().length - 1;

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

// Delete the currently selected shape type
function deleteShapeType() {
  if (state.value && localShapeTypes.length > 1 && selectedIndex.value >= 0) {
    // Use the State class method to delete the shape type
    const newState = state.value.clone();
    newState.deleteShapeType(selectedIndex.value);

    // Update the store with the new state
    state.value = newState;

    // Adjust selected index if necessary
    if (selectedIndex.value >= newState.getShapeTypes().length) {
      selectedIndex.value = Math.max(0, newState.getShapeTypes().length - 1);
    }
  }
}
</script>
<template>
  <div
    class="type-editor shape-editor"
    v-if="isReady && localShapeTypes.length"
  >
    <!-- Scrollable Grid of Previews -->
    <div class="preview-grid" ref="previewGrid">
      <button class="add-type" @click="addShapeType" title="Add New Shape Type">
        Add Type
      </button>

      <div
        v-for="(type, index) in localShapeTypes"
        :key="index"
        :class="['preview-item', { active: selectedIndex === index }]"
        @click="selectShapeType(index)"
      >
        <div
          class="type-preview"
          v-html="
            Waymark.type_preview('shape', Waymark.parse_type(type, 'shape'))
          "
        ></div>
      </div>
    </div>

    <!-- Single Edit Form -->
    <div class="edit-form" v-if="selectedShapeType">
      <button
        v-if="localShapeTypes.length > 1"
        class="delete-type"
        @click="deleteShapeType"
        title="Delete This Shape Type"
      >
        Delete
      </button>
      <div class="form-grid">
        <div class="form-input">
          <label>Title</label>
          <input
            type="text"
            v-model="selectedShapeType.shape_title"
            placeholder="e.g. Area, Zone, Region"
            @change="updateShapeTypes"
            @blur="updateShapeTypes"
          />
        </div>

        <div class="form-group">
          <div class="form-input">
            <label>Colour</label>
            <input
              type="color"
              v-model="selectedShapeType.shape_colour"
              class="colour-picker"
              @change="updateShapeTypes"
              @input="updateShapeTypes"
            />
          </div>

          <div class="form-input">
            <label>Fill Opacity</label>
            <select
              v-model="selectedShapeType.fill_opacity"
              @change="updateShapeTypes"
            >
              <option value="0.05">5%</option>
              <option value="0.1">10%</option>
              <option value="0.15">15%</option>
              <option value="0.2">20%</option>
              <option value="0.25">25%</option>
              <option value="0.3">30%</option>
              <option value="0.4">40%</option>
              <option value="0.5">50%</option>
              <option value="0.6">60%</option>
              <option value="0.7">70%</option>
              <option value="0.8">80%</option>
              <option value="0.9">90%</option>
              <option value="1.0">100%</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
