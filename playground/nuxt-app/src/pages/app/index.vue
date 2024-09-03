<script setup lang="ts">
import { navigateTo } from '#app';
import { useAuth, useAuthState } from '#imports';

import { useAsyncFindTodosQuery, useCreateTodoMutation, useTodoCreatedSubscription } from '~/base';

const { accessTokenState, currentUserState, refreshTokenState } = useAuthState();
const { clearSession } = useAuth();
const { data: todos, refresh } = await useAsyncFindTodosQuery({}, ['id', 'name']);

function logout() {
  clearSession();
  navigateTo('/');
}

async function createNewTodo() {
  const { data: todo } = await useCreateTodoMutation({ input: { name: 'New todo' } }, ['id']);
  console.debug(todo);
}

const { data: subData, error, loading, start, stop } = await useTodoCreatedSubscription(['id', 'name']);
</script>

<template>
  <div class="p-5 space-y-3">
    <div class="flex justify-between">
      <h1 class="text-2xl">User logged in</h1>
      <button class="bg-teal-500 text-white rounded-lg px-5 p-2" @click="logout">Logout</button>
    </div>
    <pre> {{ { currentUserState } }}</pre>
    <pre> {{ { accessTokenState } }}</pre>
    <pre> {{ { refreshTokenState } }}</pre>
    <div class="mt-5 space-x-3">
      <h2>Todo's</h2>
      <button class="bg-teal-500 text-white rounded-lg px-5 p-2" @click="createNewTodo">Create new Todo</button>
      <button class="bg-teal-500 text-white rounded-lg px-5 p-2" @click="start">Start subscription</button>
      <button class="bg-teal-500 text-white rounded-lg px-5 p-2" @click="stop">Stop subscription</button>
    </div>
    <div class="mt-5 mb-5 space-y-3">
      Subscriptions
      <pre> {{ { subData } }}</pre>
      <pre> {{ { error } }}</pre>
      <pre> {{ { loading } }}</pre>
    </div>
    <ul>
      <li v-for="todo of todos" :key="todo.name">{{ todo?.name }}</li>
    </ul>
  </div>
</template>

<style>
pre {
  padding: 20px;
  color: #aaa;
  background-color: #222;
  white-space: pre;
  overflow-x: auto;
  text-shadow: 0 1px 0 #000;
  border-radius: 15px;
  border-bottom: 1px solid #555;
  box-shadow:
    0 1px 5px rgba(0, 0, 0, 0.4) inset,
    0 0 20px rgba(0, 0, 0, 0.2) inset;
  font:
    16px/24px 'Courier New',
    Courier,
    'Lucida Sans Typewriter',
    'Lucida Typewriter',
    monospace;
}
</style>
