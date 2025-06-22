import { computed, ref, shallowRef, watch, nextTick } from "vue";
import { defineStore } from "pinia";
import { State } from "@/classes/State.js";
import { useWaymark } from "@/composables/useWaymark.js";

/**
 * State Store
 *
 * The central store for application state management.
 * Handles:
 * - Waymark map instance
 * - Application state (features and configuration)
 * - Undo/redo functionality
 * - localStorage persistence
 *
 * Acts as the single source of truth for the entire application.
 */
export const useStateStore = defineStore("state", () => {
  // Waymark map instance
  const Waymark = shallowRef({});

  // Load state from localStorage if available
  const savedState = localStorage.getItem("appState");
  const state = shallowRef(
    savedState ? State.fromGeoJSON(JSON.parse(savedState)) : new State(),
  );

  // Undo/Redo state
  const undoStack = ref([]);
  const redoStack = ref([]);

  /**
   * Push a state to the undo stack
   * Deep clones the data to avoid reference issues
   *
   * @param {State} data - The state to push to the stack
   */
  function pushToUndoStack(data) {
    // Store a deep clone of the data to avoid reference issues
    const dataToStore = JSON.parse(JSON.stringify(data));

    undoStack.value.push(dataToStore);

    // Limit stack size
    if (undoStack.value.length > 10) undoStack.value.shift();
  }

  /**
   * Push a state to the redo stack
   * Deep clones the data to avoid reference issues
   *
   * @param {State} data - The state to push to the stack
   */
  function pushToRedoStack(data) {
    // Store a deep clone of the data to avoid reference issues
    const dataToStore = JSON.parse(JSON.stringify(data));

    redoStack.value.push(dataToStore);

    // Limit stack size
    if (redoStack.value.length > 10) redoStack.value.shift();
  }

  // Flag to ignore watcher during undo/redo
  const ignoreWatch = ref(false);

  /**
   * Undo the last action
   * Restores the previous state from the undo stack
   */
  function undo() {
    if (undoStack.value.length === 0) return;

    // Save current state to redo stack
    pushToRedoStack(state.value);

    // Ignore watch during undo operation
    ignoreWatch.value = true;

    // Get previous state from undo stack
    const previousState = undoStack.value.pop();

    // Convert plain object to State if needed
    state.value =
      previousState instanceof State
        ? previousState
        : State.fromGeoJSON(previousState);

    // Re-enable watch on next tick
    nextTick(() => {
      ignoreWatch.value = false;

      // Dynamically import useWaymark to avoid circular dependencies
      const { redrawData } = useWaymark();
      redrawData();
    });
  }

  /**
   * Redo the last undone action
   * Restores the next state from the redo stack
   */
  function redo() {
    if (redoStack.value.length === 0) return;

    // Save current state to undo stack
    pushToUndoStack(state.value);

    // Ignore watch during redo operation
    ignoreWatch.value = true;

    // Get next state from redo stack
    const nextState = redoStack.value.pop();

    // Convert plain object to State if needed
    state.value =
      nextState instanceof State ? nextState : State.fromGeoJSON(nextState);

    // Re-enable watch on next tick
    nextTick(() => {
      ignoreWatch.value = false;

      // Dynamically import useWaymark to avoid circular dependencies
      const { redrawData } = useWaymark();
      redrawData();
    });
  }

  const canUndo = computed(() => undoStack.value.length > 0);
  const canRedo = computed(() => redoStack.value.length > 0);

  /**
   * Watch for changes to state and save to localStorage and undo stack
   * Detects real changes by comparing JSON stringified values
   */
  watch(
    state,
    (newVal, oldVal) => {
      // Skip if we're in the middle of an undo/redo operation
      if (ignoreWatch.value) return;

      // Only push to undo stack if there's a real change
      if (oldVal && JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        // Save the previous state to the undo stack
        pushToUndoStack(oldVal);

        // Clear redo stack when a new change is made
        redoStack.value = [];
      }

      // Save to localStorage if we have a value
      if (newVal !== undefined) {
        localStorage.setItem("appState", JSON.stringify(newVal.toJSON()));
      }
    },
    { deep: true },
  );

  const isReady = computed(() => {
    return (
      Object.keys(Waymark.value).length > 0 &&
      Waymark.value.map._loaded === true
    );
  });

  const activeLayer = computed(() => {
    return Waymark.value.active_layer;
  });

  // Add a function to clear the map data
  function clear() {
    if (!Waymark.value || !state.value) return;

    // Push current data to undo stack before clearing
    pushToUndoStack(state.value);

    // Clear redo stack
    redoStack.value = [];

    // Create a new State with empty features but keep the current config
    state.value = new State({
      features: [],
      config: state.value.getConfig().clone(),
    });

    // Clear and redraw the map
    nextTick(() => {
      const { redrawData } = useWaymark();
      redrawData();
    });
  }

  return {
    Waymark,
    isReady,
    state,
    activeLayer,
    undo,
    redo,
    canUndo,
    canRedo,
    clear,
  };
});
