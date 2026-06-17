import { createContext } from "react"

import type { AuthContextType } from "../types/auth.types"
import { useDashboardInternal } from "@/hooks/useDashboardInternal";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {}
})

export const DashboardContext = createContext<ReturnType<typeof useDashboardInternal> | null>(null);