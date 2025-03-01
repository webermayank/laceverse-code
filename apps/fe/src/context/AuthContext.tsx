import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { username: string; role: string } | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

interface LoginResponse {
  token: string;
  user?: {
    role: string;
  };
}

interface JWTPayload {
  userId: string;
  role: string;
  exp: number;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ username: string; role: string } | null>(
    null
  );

  // Check token validity and expiration
  const isTokenValid = (token: string) => {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && isTokenValid(token)) {
      try {
        const decoded = jwtDecode<JWTPayload>(token);
        setUser({
          username: decoded.userId,
          role: decoded.role,
        });
        setIsAuthenticated(true);

        // Set up token refresh before expiration
        const timeUntilExpiry = decoded.exp - Date.now() / 1000;
        const refreshTime = (timeUntilExpiry - 300) * 1000; // Refresh 5 minutes before expiry
        if (refreshTime > 0) {
          setTimeout(async () => {
            try {
              const response = await API.post<LoginResponse>("/refresh-token");
              localStorage.setItem("token", response.data.token);
            } catch (error) {
              logout();
            }
          }, refreshTime);
        }
      } catch (error) {
        logout();
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await API.post<LoginResponse>("/signin", {
        username,
        password,
      });

      const { token } = response.data;
      if (!token) {
        throw new Error("No token received");
      }

      localStorage.setItem("token", token);
      const decoded = jwtDecode<JWTPayload>(token);

      setUser({
        username: username, // Use the username from login
        role: decoded.role,
      });
      setIsAuthenticated(true);
    } catch (error) {
      logout();
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
