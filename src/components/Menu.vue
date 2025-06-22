<script setup>
import { computed } from "vue";
import { useStateStore } from "@/stores/stateStore.js";
import { useExport } from "@/composables/useExport.js";
import { useWaymark } from "@/composables/useWaymark.js";

const store = useStateStore();
const { undo, redo, clear } = store;
const { exportData } = useExport();
const { resetConfig } = useWaymark();

const triggerImport = () => {
  // Trigger the import process
  jQuery(".waymark-edit-upload").first().trigger("click");
};

// Check if there are features to clear
const hasFeatures = computed(() => {
  return (
    store.state &&
    store.state.getFeatures &&
    store.state.getFeatures().length > 0
  );
});
</script>

<template>
  <nav class="menu-bar">
    <button :disabled="!store.canUndo" @click="undo">Undo</button>
    <button :disabled="!store.canRedo" @click="redo">Redo</button>
    <button :disabled="!hasFeatures" @click="clear">Clear Data</button>
    <button @click="resetConfig">Reset Config</button>
    <button @click="triggerImport">Import</button>
    <button :disabled="!hasFeatures" @click="exportData">Export</button>
  </nav>
</template>

<style scoped>
.menu-bar {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f8f8f8;
  border-bottom: 1px solid #ddd;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
