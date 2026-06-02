
import { useContext } from 'react';
import { AuthContext } from '../context/createContex';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('inner AuthProvider');
  }
  
  return context;
};