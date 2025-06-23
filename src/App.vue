<script setup>
import UI from "@/components/UI.vue";

import Map from "@/components/Map.vue";
import Data from "@/components/Data.vue";
</script>

<template>
  <UI />

  <Map />
  <!-- <Data /> -->
</template>

<style>
body {
  width: 100%;
  height: 100%;
  background: #b42714;
}
/* body and #app should take up the entire screen  */
#app {
  /*position: absolute;*/
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  .ui {
    z-index: 1000;
  }
}
</style>
