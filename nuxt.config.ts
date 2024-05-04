// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  app: {
    rootId: "app",

    head: {
      link: [
        // {
        //   rel: "stylesheet",
        //   href: "/assets/waymark-js/css/waymark-js.min.css",
        // },
      ],

      script: [
        {
          // src: "https://code.jquery.com/jquery-3.7.1.min.js",
        },
        {
          // src: "/assets/waymark-js/js/waymark-js.min.js",
        },
      ],
    },
  },
});
