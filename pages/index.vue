<script setup>
onMounted(() => {
  // Create viewer Instance
  const viewer = window.Waymark_Map_Factory.editor();

  // Load Configuration from file
  fetch("../assets/config/route.json")
    .then((response) => response.json())
    .then((config) => {
      // Initialise with our options
      viewer.init(config);

      // Load GeoJSON
      viewer.load_json({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {
              type: "beer",
              title: "The Scarlet Ibis",
              description:
                "Great pub, great food! Especially after a Long Ride 🚴🍔🍟🍺🍺💤",
              image_large_url: "https://www.waymark.dev/assets/geo/pub.jpeg",
            },
            geometry: {
              type: "Point",
              coordinates: [-128.0094, 50.6539],
            },
          },
        ],
      });

      // After a slight delay, open the popup
      setTimeout(() => {
        // Iterate over the Leaflet data layer
        viewer.map_data.eachLayer((layer) => {
          // Open popop
          layer.openPopup();
        });
      }, 1000);
    });
});
</script>

<template>
  <p>The Editor</p>
  <div id="waymark-map"></div>
</template>

<style>
#waymark-map {
  height: 100vh;
}
</style>
