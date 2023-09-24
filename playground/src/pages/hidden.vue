<script setup lang="ts">
import { useAuthState } from '#imports';

const { currentUserState, accessToken, refreshToken, accessTokenState, refreshTokenState } = useAuthState();
</script>

<template>
  <div>
    <pre> {{ { currentUserState } }}</pre>
    <pre> {{ { accessToken, accessTokenState, same: accessToken === accessTokenState } }}</pre>
    <pre> {{ { refreshToken, refreshTokenState, same: refreshToken === refreshTokenState } }}</pre>
  </div>
</template>

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
