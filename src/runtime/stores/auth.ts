import { defineStore, ref, useCookie, useGraphQL } from "#imports";

export const useAuthStore: any = defineStore("auth", () => {
  // Cookies
  const tokenCookie = useCookie("token");
  const refreshTokenCookie = useCookie("refreshToken");
  const currentUserCookie = useCookie("currentUser");

  // Refs
  const token = ref<string>(tokenCookie?.value || null);
  const refreshToken = ref<string>(refreshTokenCookie?.value || null);
  const currentUser = ref<any>(currentUserCookie?.value || null);

  async function requestNewToken(): Promise<{
    token: string;
    refreshToken: string;
  }> {
    const { mutate } = await useGraphQL("refreshToken", {
      fields: ["token", "refreshToken"],
    });

    const result = await mutate();

    if (result?.data?.refreshToken) {
      setTokens(
        result.data.refreshToken.token,
        result.data.refreshToken.refreshToken
      );
    }

    return {
      token: result.data.refreshToken.token,
      refreshToken: result.data.refreshToken.refreshToken,
    };
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

  return {
    token,
    refreshToken,
    currentUser,
    setTokens,
    requestNewToken,
    clearSession,
    setCurrentUser,
  };
});
