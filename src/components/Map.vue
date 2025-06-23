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
  position: absolute;
  width: calc(100% - 60px);
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;

  .leaflet-top.leaflet-left,
  #waymark-data {
    display: none;
  }
}
</style>
