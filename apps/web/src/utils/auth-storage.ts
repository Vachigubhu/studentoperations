const ACCESS_TOKEN_KEY = "studentops_access_token";

export const authStorage = {
  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setAccessToken(accessToken: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  },

  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },
};