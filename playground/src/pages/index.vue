<script setup lang="ts">
import { useSignInMutation } from '../base/composables';
import { navigateTo } from '#app';
import { useAuth } from '#imports';

const login = async () => {
  const { setTokens, setCurrentUser } = useAuth();
  const { mutate } = await useSignInMutation({ input: { email: 'tamino_filsinger@hotmail.com', password: 'asdasd' } }, ['token', 'refreshToken', { user: ['id'] }]);
  const data = await mutate();
  setTokens(data.data.signIn.token, data.data.signIn.refreshToken);
  setCurrentUser(data.data.signIn.user);
  navigateTo('/hidden');
};
</script>

<template>
  <div>
    <button @click="login()">
      Login
    </button>
  </div>
</template>
