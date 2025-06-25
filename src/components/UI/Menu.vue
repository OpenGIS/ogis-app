<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { useStateStore } from "@/stores/stateStore.js";
import { useExport } from "@/composables/useExport.js";
import { useWaymark } from "@/composables/useWaymark.js";
import { useLeaflet } from "@/composables/useLeaflet.js";
import { useWaymarkPopup } from "@/composables/useWaymarkPopup.js";
import Icon from "@/components/UI/Icon.vue";
import Types from "@/components/UI/Types.vue";

const store = useStateStore();
const { undo, redo, clear } = store;
const { exportData } = useExport();
const { resetConfig } = useWaymark();
const { openPopup, isPopupOpen, closePopup } = useLeaflet();
const {
  openTypesPopup,
  openAboutPopup,
  isTypesPopupOpen,
  isAboutPopupOpen,
  popupState,
} = useWaymarkPopup();

const triggerImport = () => {
  // Trigger the import process
  jQuery(".waymark-edit-upload").first().trigger("click");
};

// Toggle Types editor in a popup
const openTypesEditor = () => {
  openTypesPopup();
};

// Open the About popup when the logo is clicked
const openAbout = () => {
  openAboutPopup();
};

// Check if there are features to clear
const hasFeatures = computed(() => {
  return (
    store.state &&
    store.state.getFeatures &&
    store.state.getFeatures().length > 0
  );
});

// On load and on device rotation, set the menu-bar to be the height of the viewport
onMounted(() => {
  // Set the menu-bar height to the viewport height
  document.querySelector(".menu-bar").style.height = `${window.innerHeight}px`;

  // Add event listener for window resize
  window.addEventListener("resize", updateMenuHeight);
});
// Update the menu-bar height on resize
const updateMenuHeight = () => {
  document.querySelector(".menu-bar").style.height = `${window.innerHeight}px`;
};
// Clean up the event listener on component unmount
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateMenuHeight);
});
</script>

<template>
  <nav class="menu-bar">
    <div class="menu-top">
      <div
        class="logo"
        @click="openAbout"
        :class="{ active: isAboutPopupOpen }"
      >
        <img src="/assets/img/ogis-logo.png" />
        Open<br />GIS
      </div>
      <div class="history">
        <button :disabled="!store.canUndo" @click="undo">
          <Icon name="fa-undo" />
        </button>
        <button :disabled="!store.canRedo" @click="redo">
          <Icon name="fa-undo" style="transform: scaleX(-1)" />
        </button>
      </div>

      <!--       <button @click="resetConfig">
        <Icon name="fa-gear" />
        Reset Config
      </button> -->
      <button @click="openTypesEditor" :class="{ active: isTypesPopupOpen }">
        <Icon name="fa-cog" />
        Types
      </button>
    </div>

    <div class="menu-bottom">
      <button :disabled="!hasFeatures" @click="clear">
        <Icon name="fa-trash" />
        Clear
      </button>
      <button @click="triggerImport">
        <Icon name="fa-upload" />
        Import
      </button>
      <button :disabled="!hasFeatures" @click="exportData">
        <Icon name="fa-download" />
        Export
      </button>
    </div>
  </nav>
</template>

<style lang="less">
.menu-bar {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 60px;
  padding-top: 10px;
  z-index: +1000;
  color: white;
  text-align: center;
  font-family: "Open Sans", sans-serif;

  .logo {
    font-size: 11px;
    padding: 5px 0;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    &.active {
      background-color: rgba(255, 255, 255, 0.2);
    }

    img {
      width: 40px;
    }
  }

  .history {
    position: relative;
    height: 30px;
    border: none;
    button {
      margin: 0;
      padding: 0;
      padding-top: 10px;
      position: absolute;
      top: 0;
      width: 25px;
      height: 25px;
      font-size: 12px;

      &:first-child {
        left: 5px;
      }
      &:last-child {
        right: 5px;
      }

      .icon {
        width: 24px;
        height: 24px;

        i {
          margin-top: 10px;
          width: 20px;
          font-size: 16px;
        }
      }
    }
  }

  button {
    display: block;
    max-width: 48px;
    margin: 10px auto;
    padding-top: 10px;
    color: white;
    background-color: transparent;
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    cursor: pointer;
    font-family: "Open Sans", sans-serif;

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    &.active {
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
    }
  }

  .menu-bottom {
    position: absolute;
    bottom: 10px;
    width: 100%;
  }
}
</style>
