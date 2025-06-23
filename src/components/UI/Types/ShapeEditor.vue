<script setup>
import { storeToRefs } from "pinia";
import { useStateStore } from "@/stores/stateStore.js";

const { isReady } = storeToRefs(useStateStore());
</script>
<template>
  <div class="shape-editor" v-if="isReady">
    <p>Shape Type Editor will be implemented here.</p>
  </div>
</template>

<style lang="less" scoped>
.shape-editor {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}
</style>
