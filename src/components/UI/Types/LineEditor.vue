<script setup>
import { storeToRefs } from "pinia";
import { useStateStore } from "@/stores/stateStore.js";

const { isReady } = storeToRefs(useStateStore());
</script>
<template>
  <div class="line-editor" v-if="isReady">
    <p>Line Type Editor will be implemented here.</p>
  </div>
</template>

<style lang="less" scoped>
.line-editor {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}
</style>
