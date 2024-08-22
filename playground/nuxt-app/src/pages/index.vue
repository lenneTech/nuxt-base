<script setup lang="ts">
import { navigateTo } from '#app';
import { useAuth } from '#imports';

import { useSignInMutation } from '../base';

const login = async () => {
  const { setCurrentUser, setTokens } = useAuth();
  const { mutate } = await useSignInMutation({ input: { email: 'todo_user@lenne.tech', password: 'asdasd' } }, ['token', 'refreshToken', { user: ['id'] }]);
  const data = await mutate();
  setTokens(data.data.signIn.token, data.data.signIn.refreshToken);
  setCurrentUser(data.data.signIn.user);
  navigateTo('/hidden');
};
</script>

<template>
  <div>
    <button @click="login()">Login</button>
  </div>
</template>
