import { useState, type ReactNode } from 'react';
import type { User } from '@/services/api';
import {
  loginRequest,
  registerRequest,
  type LoginDTO,
  type RegisterDTO,
} from '@/services/auth.service';
import { AuthContext, type AuthContextType } from './AuthContext';

import { TOKEN_KEY } from '@/lib/constants';

const USER_KEY = 'taskflow_user';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Componente Proveedor que envuelve la jerarquía de rutas
 * y gestiona el ciclo de vida de la sesión del usuario.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    if (!storedUser) return null;
    try {
      return JSON.parse(storedUser) as User;
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  );
  // La API no ofrece /auth/me. Usuario y JWT se restauran desde localStorage.
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Iniciar sesión
  const login = async (credentials: LoginDTO) => {
    setIsLoading(true);
    try {
      const response = await loginRequest(credentials);
      const { token: receivedToken, user: receivedUser } = response.data;

      localStorage.setItem(TOKEN_KEY, receivedToken);
      localStorage.setItem(USER_KEY, JSON.stringify(receivedUser));
      setToken(receivedToken);
      setUser(receivedUser);
    } finally {
      setIsLoading(false);
    }
  };

  // Registrarse y autenticar automáticamente
  const register = async (credentials: RegisterDTO) => {
    setIsLoading(true);
    try {
      await registerRequest(credentials);
      await login({ email: credentials.email, password: credentials.password });
    } finally {
      setIsLoading(false);
    }
  };

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
