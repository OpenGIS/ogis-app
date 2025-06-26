<script setup>
import { storeToRefs } from "pinia";
import Menu from "@/components/UI/Menu.vue";
import Types from "@/components/UI/Types.vue";

import { useStateStore } from "@/stores/stateStore.js";
const store = useStateStore();
const { showTypeEditor } = storeToRefs(store);
</script>

<template>
  <div class="ui">
    <Menu />

    <!-- <Status /> -->

    <template v-if="showTypeEditor">
      <Types />
    </template>
  </div>
</template>

<style>
.ui {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: +1000;
}
</style>
