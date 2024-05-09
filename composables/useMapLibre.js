// Import MapLibre
import { Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export function useMapLibre(useConfig = {}) {
	const instance = ref(null);
	const config = ref({});

	// Merge useConfig into config
	config.value = { ...config.value, ...useConfig };

	onMounted(() => {
		//Get screen dimensions
		const width = window.innerWidth;
		const height = window.innerHeight;

		// Set Map to this bounding box (Vancouver Island)
		const bounds = [
			[-129.168015, 48.1216],
			[-122.640704, 51.06932],
		];

		// Calculate the center of the bounding box
		const center = [
			(bounds[0][0] + bounds[1][0]) / 2,
			(bounds[0][1] + bounds[1][1]) / 2,
		];

		// Calculate the zoom level
		const zoom = Math.min(
			Math.log2(360 / (bounds[1][0] - bounds[0][0])),
			Math.log2(180 / (bounds[1][1] - bounds[0][1])),
		);

		// Create map Instance
		instance.value = new Map({
			container: "map",
			style: "/assets/style/default.json",
			center: center,
			zoom: zoom,
		});

		// Set the map to the screen dimensions
		instance.value.fitBounds(bounds, {
			padding: { top: 0, bottom: 0, left: 0, right: 0 },
		});
	});

	return {
		instance,
	};
}
