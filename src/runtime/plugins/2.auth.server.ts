import { callWithNuxt, defineNuxtPlugin, useNuxtApp, useRuntimeConfig } from 'nuxt/app';
import { ofetch } from 'ofetch';

import { useAuth } from '../composables/use-auth';
import { useAuthState } from '../states/auth';

export default defineNuxtPlugin({
  enforce: 'post',
  name: 'auth-server',
  async setup() {
    const _nuxt = useNuxtApp();
    const config = await callWithNuxt(_nuxt, useRuntimeConfig);
    const { getDecodedAccessToken, setCurrentUser, setTokens } = await callWithNuxt(_nuxt, useAuth);
    const { accessTokenState, refreshTokenState } = await callWithNuxt(_nuxt, useAuthState);
    const { data: refreshTokenResult } = await ofetch(config.public.host, {
      body: JSON.stringify({
        query: 'mutation refreshToken {refreshToken {token, refreshToken}}',
        variables: {},
      }),
      headers: {
        Authorization: `Bearer ${refreshTokenState.value}`,
      },
      method: 'POST',
    }).catch((err) => {
      console.error('2.auth.server.ts::refreshToken::catch', err.data);
    });

    if (refreshTokenResult) {
      console.debug('2.auth.server.ts::token', refreshTokenResult.refreshToken?.token);
      console.debug('2.auth.server.ts::refreshToken', refreshTokenResult.refreshToken?.refreshToken);
      setTokens(refreshTokenResult.refreshToken?.token, refreshTokenResult.refreshToken?.refreshToken);
      const payload = getDecodedAccessToken(accessTokenState?.value);
      const { data: getUserData } = await ofetch(config.public.host, {
        body: JSON.stringify({
          query: 'query getUser($id: String!){getUser(id: $id){id firstName lastName email avatar verified}}',
          variables: {
            id: payload.id,
          },
        }),
        headers: {
          Authorization: `Bearer ${accessTokenState?.value}`,
        },
        method: 'POST',
      }).catch((err) => {
        console.error('2.auth.server.ts::getUser::catch', err.data);
      });
      if (getUserData?.getUser) {
        console.debug('2.auth.server.ts::getUserData', getUserData);
        setCurrentUser(getUserData.getUser);
      }
    }
  },
});
