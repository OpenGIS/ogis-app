// Import MapLibre
import { Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export function useMapLibre(useConfig = {}) {
	const instance = ref(null);
	const config = ref({});

	// Merge useConfig into config
	config.value = { ...config.value, ...useConfig };

	onMounted(() => {
		// Create map Instance
		instance.value = new Map({
			container: "map",
			style: "/assets/style/default.json",
			// Format: [lng, lat]
			center: [-128.427172, 50.782185],
			zoom: 16,
		});

		// Load Configuration from file
		// fetch("/assets/config/default.json")
		// 	.then((response) => response.json())
		// 	.then((config) => {
		// 		// Initialise with our options
		// 		instance.value.init(config);

		// 		// Load GeoJSON
		// 		instance.value.load_json({
		// 			type: "FeatureCollection",
		// 			features: [
		// 				{
		// 					type: "Feature",
		// 					properties: {
		// 						type: "beer",
		// 						title: "The Scarlet Ibis",
		// 						description:
		// 							"Great pub, great food! Especially after a Long Ride 🚴🍔🍟🍺🍺💤",
		// 						image_large_url: "https://www.waymark.dev/assets/geo/pub.jpeg",
		// 					},
		// 					geometry: {
		// 						type: "Point",
		// 						coordinates: [-128.0094, 50.6539],
		// 					},
		// 				},
		// 			],
		// 		});

		// 		// After a slight delay, open the popup
		// 		setTimeout(() => {
		// 			// Iterate over the Leaflet data layer
		// 			instance.value.map_data.eachLayer((layer) => {
		// 				// Open popop
		// 				layer.openPopup();
		// 			});
		// 		}, 1000);
		// 	});
	});

	return {
		instance,
	};
}
