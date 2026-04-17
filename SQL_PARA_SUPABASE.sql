-- ============================================
-- ELETOOLKIT - SQL PARA SUPABASE
-- ============================================
-- INSTRUCCIONES:
-- 1. Ve a: https://uvehoxzqgmxllzuykocz.supabase.co
-- 2. En el menú lateral, ve a: SQL Editor
-- 3. Clic en: New query
-- 4. Copia y pega TODO este código
-- 5. Clic en: Run (▶)
-- ============================================

-- CREAR TABLA DE MATERIALES
CREATE TABLE IF NOT EXISTS materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('generador', 'simulador', 'adaptador')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CREAR ÍNDICES PARA MEJORAR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_materials_user_id ON materials(user_id);
CREATE INDEX IF NOT EXISTS idx_materials_type ON materials(type);
CREATE INDEX IF NOT EXISTS idx_materials_created_at ON materials(created_at DESC);

-- ACTIVAR ROW LEVEL SECURITY (SEGURIDAD)
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE SEGURIDAD - CADA USUARIO SOLO VE SUS MATERIALES
CREATE POLICY "Users can view own materials"
  ON materials FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own materials"
  ON materials FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own materials"
  ON materials FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own materials"
  ON materials FOR DELETE
  USING (auth.uid() = user_id);

-- DAR PERMISOS A USUARIOS AUTENTICADOS
GRANT ALL ON materials TO authenticated;

-- ============================================
-- VERIFICACIÓN (opcional)
-- ============================================

-- Verificar tabla creada
SELECT 'Tabla materials creada correctamente' as status;

-- Verificar políticas creadas
SELECT COUNT(*) as policies_created FROM pg_policies WHERE tablename = 'materials';

-- ============================================
-- LISTO! ✅
-- ============================================
-- Si ves Success en la parte superior,
-- significa que todo se creó correctamente.
-- ============================================
