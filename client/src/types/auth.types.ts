export interface UserData {
  id?: number
  email?: string;
  name?: string;
  avatar?: string;
  sub?: string;
  role?: string;
  phone?: string
  googleId?: string
  createdAt?: string
}

export interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  login: (userData: UserData) => void;
  logout: () => void;
  updateUser: (newFields: Partial<UserData>) => void; 
}