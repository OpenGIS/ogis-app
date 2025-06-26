<template>
  <div class="about-popup">
    <h2>Open GIS</h2>

    <p class="lead">
      The free, Open-Source app for creating and editing meaningful maps in the
      browser.
    </p>

    <p>
      This is the demo Map. Click an Overlay to Try out the Editor, or click
      "Clear" to start your own map.
    </p>
    <p>
      Click "Export" to save to a GeoJSON file which includes your custom Types.
    </p>

    <p><b>Built With:</b></p>

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

    <div class="version">v1.0.0</div>
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
    font-size: 14px;
    line-height: 110%;
    &.lead {
      font-size: 1.2em;

      margin-bottom: 15px;
    }
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
    position: absolute;
    top: 0;
    right: 10px;
    text-align: right;
    font-size: 0.8em;
    color: #666;
    margin-top: 10px;
  }
}
</style>
