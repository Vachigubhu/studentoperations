import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getCurrentUser, login as loginRequest } from "../api/auth";
import type { User } from "../types/auth";
import { authStorage } from "../utils/auth-storage";
import { onLogoutEvent } from "../utils/auth-events";
import { connectSocket, disconnectSocket } from "../socket/socket";
import { api } from "../api/client";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = authStorage.getAccessToken();

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();

        setUser(currentUser);

        connectSocket();
      } catch {
        disconnectSocket();
        authStorage.clear();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    void restoreSession();
  }, []);

  useEffect(() => {
    return onLogoutEvent(() => {
      disconnectSocket();
      setUser(null);
    });
  }, []);

  const login = async (email: string, password: string) => {
    const response = await loginRequest({ email, password });

    authStorage.setAccessToken(response.data.accessToken);

    setUser(response.data.user);

    connectSocket();
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      disconnectSocket();
      authStorage.clear();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
