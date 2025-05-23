import type { ExtractedRouteMethod, NitroFetchOptions, NitroFetchRequest, TypedInternalResponse } from 'nitropack';

import { useRuntimeConfig } from 'nuxt/app';

import { useAuthState } from '../states/auth';
import { useAuth } from './use-auth';
import { useRequestOptions } from './use-request-options';

export function useAuthFetch<
  DefaultT = unknown,
  DefaultR extends NitroFetchRequest = NitroFetchRequest,
  T = DefaultT,
  R extends NitroFetchRequest = DefaultR,
  O extends NitroFetchOptions<R> = NitroFetchOptions<R>,
>(request: R, opts?: O): Promise<TypedInternalResponse<R, T, ExtractedRouteMethod<R, O>>> {
  const { requestNewToken } = useAuth();
  const { accessTokenState } = useAuthState();
  const { headers } = useRequestOptions();
  const config = useRuntimeConfig();

  // @ts-expect-error - because of nice types from ofetch <3
  return $fetch(request, {
    ...opts,
    baseURL: config.public.host,
    async onRequest(data: any) {
      data.options.headers = {
        ...headers.value,
        ...data.options.headers,
      };

      if (accessTokenState.value) {
        data.options.headers.Authorization = `Bearer ${accessTokenState.value}`;
      }
    },
    onResponseError: async () => {
      await requestNewToken();
    },
    retry: 3,
    retryDelay: 500,
    retryStatusCodes: [401],
  });
}
