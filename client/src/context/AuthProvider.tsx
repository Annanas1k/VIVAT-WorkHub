import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { UserData } from "../types/auth.types";
import { AuthContext } from "./createContex";
import socket from "../lib/socket"; 

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(() => {
    const storedUser = localStorage.getItem('workhub_user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        console.error("Eroare la parsarea userului inițial:", e);
        return null;
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);

  const login = (userData: UserData) => {
    setUser(userData);
    localStorage.setItem('workhub_user', JSON.stringify(userData));

    // ← conectare socket după login
    socket.auth = { userId: userData.id };
    socket.connect();
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('workhub_user');
    localStorage.removeItem('app_token');

    // ← deconectare socket la logout
    socket.disconnect();
  };

  const updateUser = (newFields: Partial<UserData>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...newFields };
      localStorage.setItem('workhub_user', JSON.stringify(updated));
      return updated;
    });
  };

  // ← dacă userul era deja logat (refresh pagină), reconectăm socket
  useState(() => {
    const storedUser = localStorage.getItem('workhub_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        socket.auth = { userId: parsed.id };
        socket.connect();
      } catch (e) {console.error(e)}
    }
  });

  const context = useMemo(() => ({
    user,
    isLoading,
    login,
    logout,
    updateUser
  }), [user, isLoading]);

  return (
    <AuthContext.Provider value={context}>
      {children}
    </AuthContext.Provider>
  );
};