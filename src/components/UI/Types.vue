<script setup>
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useStateStore } from "@/stores/stateStore.js";

// Import the editor components
import MarkerEditor from "@/components/UI/Types/MarkerEditor.vue";
import LineEditor from "@/components/UI/Types/LineEditor.vue";
import ShapeEditor from "@/components/UI/Types/ShapeEditor.vue";

const store = useStateStore();
const { isReady } = storeToRefs(store);

// Define props to allow external control of which tab to display
const props = defineProps({
  initialTab: {
    type: String,
    default: "marker",
    validator: (value) => ["marker", "line", "shape"].includes(value),
  },
});

// Active tab state
const activeTab = ref(props.initialTab);

// Watch for changes to initialTab prop
watch(
  () => props.initialTab,
  (newTab) => {
    activeTab.value = newTab;
  },
);

// Function to switch tabs
const switchTab = (tab) => {
  activeTab.value = tab;
};
</script>

<template>
  <div class="types-editor" v-if="isReady">
    <!-- Tab navigation -->
    <div class="tab-navigation">
      <button
        class="tab-button"
        :class="{ active: activeTab === 'marker' }"
        @click="switchTab('marker')"
      >
        Markers
      </button>
      <button
        class="tab-button"
        :class="{ active: activeTab === 'line' }"
        @click="switchTab('line')"
      >
        Lines
      </button>
      <button
        class="tab-button"
        :class="{ active: activeTab === 'shape' }"
        @click="switchTab('shape')"
      >
        Shapes
      </button>
    </div>

    <!-- Tab content -->
    <div class="tab-content">
      <div class="tab-pane" v-show="activeTab === 'marker'">
        <MarkerEditor />
      </div>
      <div class="tab-pane" v-show="activeTab === 'line'">
        <LineEditor />
      </div>
      <div class="tab-pane" v-show="activeTab === 'shape'">
        <ShapeEditor />
      </div>
    </div>
  </div>
</template>

<style lang="less">
.types-editor {
  .tab-navigation {
    display: flex;
    border-bottom: 1px solid #ddd;

    .tab-button {
      background: #f5f5f5;
      border: 1px solid #ddd;
      border-bottom: none;
      padding: 8px 12px;
      margin-right: 5px;
      cursor: pointer;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      font-size: 14px;

      &.active {
        background: #fff;
        border-bottom: 1px solid #fff;
        margin-bottom: -1px;
        font-weight: bold;
      }

      &:hover:not(.active) {
        background: #e9e9e9;
      }
    }
  }

  .tab-content {
    .tab-pane {
      width: 100%;
      overflow-x: auto;

      /* Type Editors */
      .type-editor {
        padding-top: 10px;

        /* Previews */
        .preview-grid {
          float: left;
          width: 80px;
          margin-right: 10px;
          height: 275px;
          overflow-y: auto;
          overflow-x: hidden;
          border: 1px solid #d2d2d2;
          border-radius: 4px;
          background: #fff;

          .preview-item {
            padding: 5px 10px;
            border-bottom: 1px solid #d2d2d2;
            &:hover {
              border-color: #ccc;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            &.active {
              background-color: #f1f1f1;
            }

            .preview-title {
              margin-top: 6px;
              font-size: 11px;
              text-align: center;
              line-height: 1.2;
              max-width: 60px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .waymark-type-preview {
              position: relative;
            }
          }
        }

        /* Edit Form */
        .edit-form {
          width: 260px;
          padding-left: 15px;
          background: white;

          .form-group {
            display: flex;
            flex-direction: row;
            gap: 10px;
            .form-input {
              width: 90px;
            }
          }

          .form-input {
            display: flex;
            flex-direction: column;

            label {
              font-weight: bold;
              color: #555;
            }

            input,
            select {
              margin-bottom: 7px;
              padding: 5px 8px;
              border: 1px solid #ddd;
              border-radius: 4px;
              font-size: 14px;

              &:focus {
                outline: none;
                border-color: #007cba;
                box-shadow: 0 0 0 2px rgba(0, 124, 186, 0.2);
              }
            }

            .colour-picker {
              width: 60px;
              height: 40px;
              padding: 0;
              border: 1px solid #ddd;
              border-radius: 4px;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
</style>
