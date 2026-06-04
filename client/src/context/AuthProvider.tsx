import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { UserData } from "../types/auth.types";
import { AuthContext } from "./createContex";

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
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('workhub_user');
    localStorage.removeItem('app_token');
  };
  const updateUser = (newFields: Partial<UserData>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...newFields };
      localStorage.setItem('workhub_user', JSON.stringify(updated))
      return updated;
    });
  };

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