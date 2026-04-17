import { create } from 'zustand';
import { supabase } from '../lib/supabase/client';

interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  signIn: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  },

  signUp: async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null });
  },

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      set({
        user: {
          id: session.user.id,
          email: session.user.email!,
        },
      });
    }

    set({ loading: false });

    // Escuchar cambios de autenticación
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        set({
          user: {
            id: session.user.id,
            email: session.user.email!,
          },
        });
      } else {
        set({ user: null });
      }
    });
  },
}));
