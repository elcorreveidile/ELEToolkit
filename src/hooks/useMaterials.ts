import { useEffect } from 'react';
import { useMaterialsStore } from '../store/materialsStore';

export const useMaterials = () => {
  const {
    materials,
    loading,
    fetchMaterials,
    saveMaterial,
    deleteMaterial,
    updateMaterial,
  } = useMaterialsStore();

  useEffect(() => {
    fetchMaterials();
  }, []);

  const getMaterialsByType = (type: 'generador' | 'simulador' | 'adaptador') => {
    return materials.filter(m => m.type === type);
  };

  return {
    materials,
    loading,
    getMaterialsByType,
    saveMaterial,
    deleteMaterial,
    updateMaterial,
    refreshMaterials: fetchMaterials,
  };
};
