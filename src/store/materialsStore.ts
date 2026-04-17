import { create } from 'zustand';
import { supabase } from '../lib/supabase/client';

export interface Material {
  id: string;
  user_id: string;
  title: string;
  content: string;
  type: 'generador' | 'simulador' | 'adaptador';
  created_at: string;
  updated_at: string;
}

interface MaterialsState {
  materials: Material[];
  loading: boolean;
  fetchMaterials: () => Promise<void>;
  saveMaterial: (material: Omit<Material, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  deleteMaterial: (id: string) => Promise<void>;
  updateMaterial: (id: string, updates: Partial<Material>) => Promise<void>;
}

export const useMaterialsStore = create<MaterialsState>((set, get) => ({
  materials: [],
  loading: false,

  fetchMaterials: async () => {
    set({ loading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      set({ materials: data || [] });
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      set({ loading: false });
    }
  },

  saveMaterial: async (material) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Debes iniciar sesión para guardar materiales');

      const { data, error } = await supabase
        .from('materials')
        .insert({
          ...material,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      set({ materials: [data, ...get().materials] });
    } catch (error) {
      console.error('Error saving material:', error);
      throw error;
    }
  },

  deleteMaterial: async (id) => {
    try {
      const { error } = await supabase
        .from('materials')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set({ materials: get().materials.filter(m => m.id !== id) });
    } catch (error) {
      console.error('Error deleting material:', error);
      throw error;
    }
  },

  updateMaterial: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set({
        materials: get().materials.map(m =>
          m.id === id ? data : m
        ),
      });
    } catch (error) {
      console.error('Error updating material:', error);
      throw error;
    }
  },
}));
