<script setup>
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useStateStore } from "@/stores/stateStore.js";
const { state } = storeToRefs(useStateStore());

// Computed property for the complete state data in JSON format
const stateData = computed(() => {
  if (!state.value) return "";
  return JSON.stringify(state.value.toJSON(), null, 2);
});
</script>

<template>
  <textarea readonly v-model="stateData"></textarea>
</template>

<style>
textarea {
  display: block;
  width: 100%;
  height: 200px;
  font-family: monospace;
  font-size: 14px;
  padding: 10px;
  box-sizing: border-box;
  border: none;
  background-color: #f0f0f0;
}
</style>
