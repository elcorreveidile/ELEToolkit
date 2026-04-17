-- ============================================
-- ELETOOLKIT - SUPABASE DATABASE SCHEMA
-- ============================================
-- Ejecuta este SQL en: Supabase Dashboard → SQL Editor
-- https://uvehoxzqgmxllzuykocz.supabase.co
-- ============================================

-- 1. CREAR TABLA DE MATERIALES
CREATE TABLE IF NOT EXISTS materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('generador', 'simulador', 'adaptador')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CREAR ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_materials_user_id ON materials(user_id);
CREATE INDEX IF NOT EXISTS idx_materials_type ON materials(type);
CREATE INDEX IF NOT EXISTS idx_materials_created_at ON materials(created_at DESC);

-- 3. ACTIVAR ROW LEVEL SECURITY (RLS)
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- 4. CREAR POLÍTICAS DE SEGURIDAD (RLS POLICIES)
-- Los usuarios solo pueden ver SUS propios materiales
CREATE POLICY "Users can view own materials"
  ON materials FOR SELECT
  USING (auth.uid() = user_id);

-- Los usuarios pueden insertar SUS propios materiales
CREATE POLICY "Users can insert own materials"
  ON materials FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Los usuarios pueden actualizar SUS propios materiales
CREATE POLICY "Users can update own materials"
  ON materials FOR UPDATE
  USING (auth.uid() = user_id);

-- Los usuarios pueden borrar SUS propios materiales
CREATE POLICY "Users can delete own materials"
  ON materials FOR DELETE
  USING (auth.uid() = user_id);

-- 5. CREAR FUNCIÓN PARA ACTUALIZAR updated_at AUTOMÁTICAMENTE
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. CREAR TRIGGER PARA updated_at
CREATE TRIGGER update_materials_updated_at
  BEFORE UPDATE ON materials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 7. DAR PERMISOS AL AUTENTICATED
GRANT ALL ON materials TO authenticated;

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Verificar que la tabla se creó correctamente
SELECT
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'materials'
ORDER BY ordinal_position;

-- Verificar que las políticas se crearon
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'materials';

-- ============================================
-- TEST DATA (opcional - para probar)
-- ============================================

-- Insertar un material de prueba (descomenta para probar)
-- INSERT INTO materials (user_id, title, content, type)
-- VALUES (
--   auth.uid(),
--   'Ejercicio de prueba - Ser vs Estar',
--   'Completa con ser o estar:
-- 1. Yo ___ profesor de español.
-- 2. Tú ___ en casa.
-- 3. Ellos ___ amigos.',
--   'generador'
-- );

-- ============================================
-- INSTRUCCIONES DE USO:
-- ============================================
--
-- 1. Copia todo este código
-- 2. Ve a: https://uvehoxzqgmxllzuykocz.supabase.co
-- 3. En el menú lateral, ve a: SQL Editor
-- 4. Clic en "New query"
-- 5. Pega este código
-- 6. Clic en "Run" ▶
-- 7. Verifica que no haya errores
--
-- ============================================
