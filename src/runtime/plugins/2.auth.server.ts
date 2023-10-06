import { callWithNuxt, defineNuxtPlugin, useNuxtApp, useRuntimeConfig } from 'nuxt/app';
import { ofetch } from 'ofetch';
import { useAuthState } from '../states/auth';
import { useAuth } from '../composables/use-auth';

export default defineNuxtPlugin({
  name: 'auth-server',
  enforce: 'post',
  async setup() {
    console.debug('2.auth.server.ts::init');
    const _nuxt = useNuxtApp();
    const config = await callWithNuxt(_nuxt, useRuntimeConfig);
    const { getDecodedAccessToken, setTokens, setCurrentUser } = await callWithNuxt(_nuxt, useAuth);
    const { accessTokenState, refreshToken } = await callWithNuxt(_nuxt, useAuthState);
    const { data: refreshTokenResult } = await ofetch(config.public.host, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${refreshToken.value}`,
      },
      body: JSON.stringify({
        query: 'mutation refreshToken {refreshToken {token, refreshToken}}',
        variables: {},
      }),
    }).catch((err) => {
      console.error('2.auth.server.ts::refreshToken::catch', err.data);
    });


    if (refreshTokenResult) {
      console.debug('2.auth.server.ts::token', refreshTokenResult.refreshToken?.token);
      console.debug('2.auth.server.ts::refreshToken', refreshTokenResult.refreshToken?.refreshToken);
      setTokens(refreshTokenResult.refreshToken?.token, refreshTokenResult.refreshToken?.refreshToken);
      const payload = getDecodedAccessToken(accessTokenState?.value);
      const { data: getUserData } = await ofetch(config.public.host, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessTokenState?.value}`,
        },
        body: JSON.stringify({
          query: 'query getUser($id: String!){getUser(id: $id){id firstName lastName email avatar verified}}',
          variables: {
            id: payload.id,
          },
        }),
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
