<template>
  <div class="about-popup">
    <h2>About OGIS App</h2>
    <div class="logo-container">
      <img src="/assets/img/ogis-logo.png" alt="OGIS Logo" />
    </div>
    <p>
      <strong>Open GIS</strong> is a flexible Geographic Information System built with Vue.js and Leaflet.
    </p>
    <p>
      This application allows you to create, edit, and manage geographic data in various formats. It uses Waymark JS
      as the underlying mapping library and provides an intuitive interface for working with geospatial data.
    </p>
    <h3>Features</h3>
    <ul>
      <li>Create and edit geographical features</li>
      <li>Customize marker types and styles</li>
      <li>Import and export data in various formats</li>
      <li>Undo/redo functionality</li>
      <li>Save your work locally</li>
    </ul>
    <div class="version">Version 1.0.0</div>
  </div>
</template>

<style lang="less" scoped>
.about-popup {
  padding: 5px;
  
  h2 {
    color: #b42714;
    text-align: center;
    margin-top: 0;
  }
  
  h3 {
    color: #333;
    margin-bottom: 5px;
  }
  
  .logo-container {
    text-align: center;
    margin: 10px 0;
    
    img {
      width: 80px;
      height: auto;
    }
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
  
  .version {
    text-align: right;
    font-size: 0.8em;
    color: #666;
    margin-top: 10px;
  }
}
</style>
