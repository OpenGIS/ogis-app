<script setup>
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
		default: "black",
	},
	text: {
		type: String,
		default: "",
	},
});

const iconNames = ref([
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

const iconName = computed(() => {
	if (iconNames.value.indexOf(props.name) > -1) {
		return props.name;
	} else {
		return false;
	}
});
</script>

<template>
	<div class="og-icon">
		<img
			v-show="iconName"
			:src="`/assets/img/icon/${iconName}.svg`"
			:alt="text"
			:title="text"
			:width="size"
			:height="size"
		/>
	</div>
</template>

<style lang="less">
.og-icon {
	background-color: red;

	display: inline-block;

	img {
		vertical-align: middle;
	}
}
</style>
