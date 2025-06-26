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

  /* Constrain leaflet popup dimensions */
  .leaflet-popup {
    .leaflet-popup-content-wrapper {
      width: 300px;
      overflow-y: auto;

      .leaflet-popup-content {
        .waymark-info {
          width: 210px;

          .waymark-info-title {
            margin-bottom: 7px;
            input {
              padding: 5px !important;
              width: 200px !important;
            }
          }
          .waymark-info-image_large_url {
            margin-bottom: 7px;

            input {
              width: 135px;
            }

            .waymark-hover {
              img {
                width: 210px;
                height: 210px;
              }
            }
          }
        }
      }
    }
  }
}

/* Mobile portrait  */
@media (max-width: 600px) {
  .leaflet-popup-content-wrapper {
    width: 280px !important;
  }
}
</style>
