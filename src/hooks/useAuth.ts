import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, loading, signIn, signUp, signOut, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
  };
};
