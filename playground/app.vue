<template>
  <div>
    Nuxt module playground!
    
    <h3>useFindAllOffersQuery</h3>
    <pre> {{ data }}</pre>
  </div>
</template>

<script async setup>
import { useFindAllOffersQuery } from '#base';
const data = await useFindAllOffersQuery({limit: 25}, ['id']);
</script>
