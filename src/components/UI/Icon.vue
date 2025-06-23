<script setup>
import { computed, ref, onMounted, watch } from "vue";

const props = defineProps({
	name: {
		type: String,
		required: true,
	},
	size: {
		type: String,
		default: "32",
	},
	color: {
		type: String,
		default: "white",
	},
	text: {
		type: String,
		default: "",
	},
	svgName: {
		type: String,
		default: "",
	},
});

const svgNames = ref([
	"polygon",
	"polyline",
	"marker",
	"circle",
	"rectangle",
	"freehand",
	"clear",
	"select",
	"greatcircle",
]);

const svgName = computed(() => {
	if (svgNames.value.indexOf(props.svgName) > -1) {
		return props.svgName;
	} else {
		return false;
	}
});

const iconName = computed(() => {
	if (props.svgName) {
		return false;
	} else if (props.name.startsWith("ion-") || props.name.startsWith("fa-")) {
		// Append either ion or fa based on the prefix
		return props.name.startsWith("ion-")
			? `ion ${props.name}`
			: `fa ${props.name}`;
	} else {
		return props.name;
	}
});

// Store SVG content for inline rendering
const svgContent = ref("");

// Use refs to store SVG paths and attributes
const svgViewBox = ref("");
const svgPaths = ref([]);

// Fetch and parse SVG content
const fetchSvg = async (name) => {
	try {
		const response = await fetch(`/assets/img/icon/${name}.svg`);
		if (response.ok) {
			const text = await response.text();
			// Parse the SVG to extract viewBox and paths
			const parser = new DOMParser();
			const svgDoc = parser.parseFromString(text, "image/svg+xml");
			const svgElement = svgDoc.querySelector("svg");

			if (svgElement) {
				// Get viewBox attribute
				svgViewBox.value = svgElement.getAttribute("viewBox") || "0 0 24 24";

				// Get all SVG children (paths, circles, rects, etc.)
				const paths = [];
				const elements = svgElement.querySelectorAll(
					"path, circle, rect, polygon, polyline",
				);
				elements.forEach((el) => {
					const attrs = {};
					Array.from(el.attributes).forEach((attr) => {
						// Skip the fill attribute as we'll set it ourselves
						if (attr.name !== "fill") {
							attrs[attr.name] = attr.value;
						}
					});
					paths.push({
						tag: el.tagName,
						attrs,
					});
				});
				svgPaths.value = paths;
			}
		}
	} catch (error) {
		console.error(`Error loading SVG: ${name}`, error);
	}
};

// Watch for changes to svgName and reload SVG
watch(
	() => props.svgName,
	async (newSvgName) => {
		if (svgName.value) {
			await fetchSvg(svgName.value);
		}
	},
	{ immediate: true },
);

const svgStyle = computed(() => {
	return {
		width: `${props.size}px`,
		height: `${props.size}px`,
	};
});
</script>

<template>
	<div class="icon">
		<!-- Direct SVG element -->
		<svg
			v-if="svgName && svgPaths.length > 0"
			:width="size"
			:height="size"
			:viewBox="svgViewBox"
			:title="text"
			xmlns="http://www.w3.org/2000/svg"
		>
			<template v-for="(path, index) in svgPaths" :key="index">
				<component :is="path.tag" v-bind="path.attrs" :fill="color" />
			</template>
		</svg>

		<!-- Fallback if SVG parsing fails -->
		<img
			v-else-if="svgName"
			:src="`/assets/img/icon/${svgName}.svg`"
			:alt="text"
			:title="text"
			:width="size"
			:height="size"
			:style="svgStyle"
		/>

		<!-- Font Icon -->
		<i
			v-else-if="iconName"
			:class="iconName"
			:style="{ width: size + 'px', height: size + 'px', color: color }"
			:title="text"
		>
		</i>
	</div>
</template>

<style lang="less">
.icon {
	font-size: 24px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
}
</style>
