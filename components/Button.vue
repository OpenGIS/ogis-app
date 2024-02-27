<script setup>
const props = defineProps({
	action: {
		type: Object,
		default: () => {
			console.log(`OGButton clicked`);
		},
		required: true,
	},
	text: {
		type: String,
		required: false,
	},
	icon: {
		type: String,
		required: false,
	},
});
</script>

<template>
	<div class="og-button" @click="action">
		<og-icon :name="icon" :text="text" />
	</div>
</template>

<style lang="less">
.og-button {
	display: inline-block;
	padding: 0.5rem;
	border: 1px solid blue;
	img {
		vertical-align: middle;
	}
}
</style>
