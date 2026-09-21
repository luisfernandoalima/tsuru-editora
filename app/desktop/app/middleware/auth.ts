export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.client) {
    const { getToken, isTokenExpired, clearToken } = useAuthToken();

    const token = getToken();

    if (!token || isTokenExpired(token)) {
      clearToken();
      return navigateTo("/login");
    }
  }
});
