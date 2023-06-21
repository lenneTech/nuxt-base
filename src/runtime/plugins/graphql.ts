import { defineNuxtPlugin } from "#app";
import { ref, useRuntimeConfig } from "#imports";
import { loadMeta } from "../functions/graphql-meta";

export default defineNuxtPlugin(async (nuxtApp) => {
  console.log("init nuxt plugin");
  if (!nuxtApp?.gqlMeta) {
    const config = useRuntimeConfig();
    nuxtApp.gqlMeta = ref({});
    nuxtApp.gqlMeta.value = await loadMeta(config);
  }
});
