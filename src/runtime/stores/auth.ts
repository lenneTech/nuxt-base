import { defineStore, ref, useCookie, useGraphQL } from "#imports";

export const useAuthStore = defineStore("auth", () => {
    // Cookies
    const tokenCookie = useCookie('token');
    const refreshTokenCookie = useCookie('refreshToken');
    const currentUserCookie = useCookie('currentUser');

    // Refs
    const token = ref<string>(tokenCookie?.value || null);
    const refreshToken = ref<string>(refreshTokenCookie?.value || null);
    const currentUser = ref<any>(currentUserCookie?.value || null);

    async function requestNewToken(): Promise<{ token: string; refreshToken: string }> {
        console.log('requestNewToken');
        
        const { result } = await useGraphQL('refreshToken', {
            fields: ['token', 'refreshToken'],
            log: true
        })

        if (result.refreshToken) {
            setTokens(result.refreshToken.token, result.refreshToken.refreshToken);
        }

        console.log('tokens', result.refreshToken);

        return { token: result.refreshToken.token, refreshToken: result.refreshToken.refreshToken }
    }

    function setTokens(newToken: string, newRefreshToken: string) {
        tokenCookie.value = newToken;
        token.value = newToken;

        refreshTokenCookie.value = newRefreshToken;
        refreshToken.value = newRefreshToken;
    }

    function setCurrentUser(user: any) {
        currentUserCookie.value = user;
        currentUser.value = user;
    }

    function clearSession() {        
        tokenCookie.value = null;
        token.value = null;

        refreshTokenCookie.value = null;
        refreshToken.value = null;

        currentUserCookie.value = null;
        currentUser.value = null;
    }
  
    return { token, refreshToken, currentUser, setTokens, requestNewToken, clearSession, setCurrentUser };
  });