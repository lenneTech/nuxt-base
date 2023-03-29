<template>
  <div>
    Nuxt module playground!

    <h3>useFindCategorysQuery</h3>
    <pre> {{ loading }}</pre>
    <pre> {{ result }}</pre>
  </div>
</template>

<script async setup>
import { useFindCategorysQuery } from "#base";
const { result, loading } = await useFindCategorysQuery({ limit: 25 }, ["id"]);
</script>
