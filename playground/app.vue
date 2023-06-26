<template>
  <div>
    Nuxt module playground!

    <h3>useNewsQuery</h3>
    <pre> {{ { pending } }}</pre>
    <pre> {{ { status } }}</pre>
    <pre> {{ { error } }}</pre>
    <pre> {{ { data } }}</pre>
  </div>
</template>

<script setup lang="ts">
import { useNewsQuery } from "./.nuxt/imports";
const { data, pending, status, error } = await useNewsQuery({}, [
  "id",
  "title",
]);
//console.log(data.value);
</script>

<style>
pre {
  margin: 20px;
  padding: 20px;
  color: #aaa;
  background-color: #222;
  white-space: pre;
  text-shadow: 0 1px 0 #000;
  border-radius: 15px;
  border-bottom: 1px solid #555;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4) inset,
    0 0 20px rgba(0, 0, 0, 0.2) inset;
  font: 16px/24px "Courier New", Courier, "Lucida Sans Typewriter",
    "Lucida Typewriter", monospace;
}
</style>
