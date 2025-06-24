<template>
  <div class="about-popup">
    <h2>Open GIS</h2>

    <p>
      The free, Open-Source app for creating, editing and sharing meaningful
      maps.
    </p>

    <h3>Features</h3>
    <ul>
      <li>Runs offline in your browser</li>
      <li>Import GeoJSON, KML and GPX</li>
      <li>Customise how Overlays appear with Types</li>
      <li>Undo/redo functionality</li>
      <li>Export to save your map (and Types) in GeoJSON format</li>
    </ul>

    <div class="logos">
      <a href="https://vuejs.org/" target="_blank">
        <img
          src="/assets/img/vue-logo.svg"
          alt="Vue JS Logo"
          width="24"
          height="24"
          title="Vue JS"
        />
      </a>
      <!-- Maintain 320x85 aspect ratio -->
      <a href="http://leafletjs.com" target="_blank">
        <img
          src="/assets/img/leaflet-logo.svg"
          alt="Leaflet JS Logo"
          height="32"
          width="120"
          title="Leaflet JS"
        />
      </a>
      <a href="https://github.com/OpenGIS/Waymark-JS" target="_blank">
        <img
          src="/assets/waymark-js/images/waymark-icon-red.png"
          alt="Waymark Logo"
          width="32"
          height="32"
          title="Waymark JS"
        /><small>JS</small>
      </a>
      <a href="https://www.openstreetmap.org/" target="_blank">
        <img
          src="/assets/img/osm-logo.svg"
          alt="OpenStreetMap Logo"
          width="32"
          height="32"
          title="OpenStreetMap"
        />
      </a>
    </div>

    <p>
      This is the demo Map. Click an Overlay to Try out the Editor, or click
      "Clear" to start your own map. Your Map will be saved in your browser's
      local storage, so you can come back to it later.
    </p>

    <div class="version">Version 1.0.0</div>
  </div>
</template>

<style lang="less" scoped>
.about-popup {
  font-size: 14px;

  h2 {
    color: #b42714;
    margin: 0;
  }

  h3 {
    margin-bottom: 5px;
  }

  p {
    margin: 10px 0;
    font-size: 0.9em;
    line-height: 1.4;
  }

  ul {
    margin: 5px 0;
    padding-left: 20px;

    li {
      margin-bottom: 3px;
      font-size: 0.9em;
    }
  }

  /* Vertical align and horizontal spacing*/
  .logos {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    margin-top: 10px;
    a {
      position: relative;
      img {
        vertical-align: middle;
      }
      small {
        position: absolute;
        bottom: 1px;
        right: -4px;
        font-size: 8px;
        color: #000;
      }
    }
  }

  .version {
    text-align: right;
    font-size: 0.8em;
    color: #666;
    margin-top: 10px;
  }
}
</style>
