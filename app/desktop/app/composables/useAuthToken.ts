export const useAuthToken = () => {
  const setToken = (token: string) => {
    localStorage.setItem("auth_token", token);
  };

  const getToken = (): string | null => {
    return localStorage.getItem("auth_token");
  };

  const clearToken = () => {
    localStorage.removeItem("auth_token");
  };

  const isTokenExpired = (token: string): boolean => {
    try {
      const parts = token.split(".");
      if (parts.length !== 3 || !parts[1]) return true; // token mal formado

      const payload = JSON.parse(atob(parts[1]));
      if (!payload.exp) return false;
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  };

  const isTokenValid = (): boolean => {
    const token = getToken();
    return !!token && !isTokenExpired(token);
  };

  return { setToken, getToken, clearToken, isTokenExpired, isTokenValid };
};
