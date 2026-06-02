export interface GoogleUserData {
  email: string;
  name: string;
  avatar: string;
  sub: string;
  role?: string;
}

export interface AuthContextType {
  user: GoogleUserData | null;
  isLoading: boolean;
  login: (userData: GoogleUserData) => void;
  logout: () => void;
}