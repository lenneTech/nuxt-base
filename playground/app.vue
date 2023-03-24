<template>
  <div>
    Nuxt module playground!1
    <pre>useGraphQL {{ data }}</pre>
    <pre>useFindAllOffersQuery {{ data2 }}</pre>
  </div>
</template>

<script async setup>
import { useFindAllOffersQuery } from "#base";
import { useGraphQL } from "#imports";
const data2 = await useFindAllOffersQuery({}, ['id']);
const data = await useGraphQL("findAllOffers");
</script>
