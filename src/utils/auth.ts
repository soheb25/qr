const AUTH_KEY = 'cgm_auth_user';
const VALID_EMAIL = 'newindian2345@gmail.com';
const VALID_PASSWORD = 'indian234567';

export const authService = {
  login: (email: string, pass: string): boolean => {
    if (email.trim().toLowerCase() === VALID_EMAIL.toLowerCase() && pass === VALID_PASSWORD) {
      localStorage.setItem(AUTH_KEY, email.trim());
      return true;
    }
    return false;
  },

  logout: (): void => {
    localStorage.removeItem(AUTH_KEY);
  },

  isAuthenticated: (): boolean => {
    return Boolean(localStorage.getItem(AUTH_KEY));
  },

  getCurrentUser: (): string | null => {
    return localStorage.getItem(AUTH_KEY);
  },

  getValidEmail: (): string => {
    return VALID_EMAIL;
  },

  getValidPassword: (): string => {
    return VALID_PASSWORD;
  }
};
