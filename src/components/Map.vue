<script setup>
import { onMounted } from "vue";
import { useWaymark } from "@/composables/useWaymark.js";

const { init } = useWaymark();

onMounted(() => {
  init();
});
</script>

<template>
  <div id="waymark-map"></div>
</template>

<style lang="less">
#waymark-map {
  width: 100%;
  height: 100%;

  .leaflet-top.leaflet-left,
  #waymark-data {
    display: none;
  }
}
</style>
