<script setup>
import { watch, reactive, computed, ref, nextTick } from "vue";

import { storeToRefs } from "pinia";
import { useStateStore } from "@/stores/stateStore.js";
import { useWaymark } from "@/composables/useWaymark.js";
import { State } from "@/classes/State.js";

const store = useStateStore();
const { Waymark, state, isReady } = storeToRefs(store);
const { redrawData } = useWaymark();

// Track which line type is currently being edited
const selectedIndex = ref(0);

// Reference to the preview grid for scrolling
const previewGrid = ref(null);

// Create a computed property for line types
const lineTypes = computed(() => {
  if (!state.value) return [];
  return state.value.getLineTypes();
});

// Create a local reactive copy to work with
const localLineTypes = reactive([]);

// Watch for changes to line types from the store and update local copy
watch(
  lineTypes,
  (newTypes) => {
    // Clear the array
    localLineTypes.length = 0;

    // Fill with new values
    if (newTypes && newTypes.length) {
      newTypes.forEach((type) => {
        // Create a copy of the type
        const newType = { ...type };
        localLineTypes.push(newType);
      });
    }

    // Reset selection if it's out of bounds
    if (selectedIndex.value >= localLineTypes.length) {
      selectedIndex.value = 0;
    }
  },
  { immediate: true, deep: true },
);

// Get the currently selected line type
const selectedLineType = computed(() => {
  if (!localLineTypes.length || selectedIndex.value < 0) return null;
  return localLineTypes[selectedIndex.value];
});

// Select a line type for editing
function selectLineType(index) {
  selectedIndex.value = index;
}

// When local types are edited, update the store and Waymark
function updateLineTypes() {
  // Create a deep copy to ensure reactivity
  const newTypes = JSON.parse(JSON.stringify(localLineTypes));

  // Update state with new line types
  if (state.value) {
    // Clone the current config
    const newConfig = state.value.getConfig().clone();

    // Update just the line_types option
    newConfig.setMapOption("line_types", newTypes);

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

// Add a new line type
function addLineType() {
  if (state.value) {
    // Use the State class method to add a new line type
    const newState = state.value.clone();
    newState.addLineType();

    // Update the store with the new state
    state.value = newState;

    // Select the newly added line type
    selectedIndex.value = newState.getLineTypes().length - 1;

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

// Delete the currently selected line type
function deleteLineType() {
  if (state.value && localLineTypes.length > 1 && selectedIndex.value >= 0) {
    // Use the State class method to delete the line type
    const newState = state.value.clone();
    newState.deleteLineType(selectedIndex.value);

    // Update the store with the new state
    state.value = newState;

    // Adjust selected index if necessary
    if (selectedIndex.value >= newState.getLineTypes().length) {
      selectedIndex.value = Math.max(0, newState.getLineTypes().length - 1);
    }
  }
}
</script>
<template>
  <div class="type-editor line-editor" v-if="isReady && localLineTypes.length">
    <!-- Scrollable Grid of Previews -->
    <div class="preview-grid" ref="previewGrid">
      <button class="add-type" @click="addLineType" title="Add New Line Type">
        Add Type
      </button>
      <div
        v-for="(type, index) in localLineTypes"
        :key="index"
        :class="['preview-item', { active: selectedIndex === index }]"
        @click="selectLineType(index)"
      >
        <div
          class="type-preview"
          v-html="
            Waymark.type_preview('line', Waymark.parse_type(type, 'line'))
          "
        ></div>
      </div>
    </div>

    <!-- Single Edit Form -->
    <div class="edit-form" v-if="selectedLineType">
      <button
        v-if="localLineTypes.length > 1"
        class="delete-type"
        @click="deleteLineType"
        title="Delete This Line Type"
      >
        Delete
      </button>
      <div class="form-grid">
        <div class="form-input">
          <label>Title</label>
          <input
            type="text"
            v-model="selectedLineType.line_title"
            placeholder="e.g. Trail, Road, Path"
            @change="updateLineTypes"
            @blur="updateLineTypes"
          />
        </div>

        <div class="form-group">
          <div class="form-input">
            <label>Colour</label>
            <input
              type="color"
              v-model="selectedLineType.line_colour"
              class="colour-picker"
              @change="updateLineTypes"
              @input="updateLineTypes"
            />
          </div>

          <div class="form-input">
            <label>Opacity</label>
            <select
              v-model="selectedLineType.line_opacity"
              @change="updateLineTypes"
            >
              <option value="0.1">10%</option>
              <option value="0.2">20%</option>
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

        <div class="form-input">
          <label>Weight</label>
          <select
            v-model="selectedLineType.line_weight"
            @change="updateLineTypes"
          >
            <option value="1">1px</option>
            <option value="2">2px</option>
            <option value="3">3px</option>
            <option value="4">4px</option>
            <option value="5">5px</option>
            <option value="6">6px</option>
            <option value="8">8px</option>
            <option value="10">10px</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>
