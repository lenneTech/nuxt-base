<template>
  <div>
    Nuxt module playground!
    <pre>{{ data }}</pre>
    <pre>{{ allPlanets }}</pre>
  </div>
</template>

<script async setup>
import { useGraphQL } from "#imports";
import { useAllPlanetsQuery } from "./.nuxt/gql.mjs";
const allPlanets = await useAllPlanetsQuery({});
const data = await useGraphQL("allPlanets");
</script>
