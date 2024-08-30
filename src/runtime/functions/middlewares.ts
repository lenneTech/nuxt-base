import { useAuthState } from '../states/auth';

export function requestMiddleware(request: RequestInit) {
  const { accessTokenState, refreshTokenState } = useAuthState();
  console.log(request);

  return {
    ...request,
    headers: { ...request.headers, Authorization: 'Bearer ' + accessTokenState.value },
  };
}
