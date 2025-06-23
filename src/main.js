import { createApp } from "vue";
import { createPinia } from "pinia";
import "@/assets/css/main.css";
import App from "./App.vue";

const pinia = createPinia();
const app = createApp(App).use(pinia).mount("#app");
