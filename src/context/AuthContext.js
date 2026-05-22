import { createContext, useCallback, useContext, useState } from 'react';
import { clearAuth, getItem, setItem, STORAGE_KEYS } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getItem(STORAGE_KEYS.USER));

  const login = useCallback((token, userInfo) => {
    setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    setItem(STORAGE_KEYS.USER, userInfo);
    setUser(userInfo);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: user !== null,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
