<script setup lang="ts">
const appConfig = useAppConfig();
</script>

<template>
  <NuxtLayout :style="`background-color: ${appConfig.theme.backgroundColor}`">
    <NuxtPage />
  </NuxtLayout>
</template>

<style lang="less">
body {
}
</style>
