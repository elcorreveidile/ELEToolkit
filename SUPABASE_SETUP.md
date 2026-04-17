# 🔧 Configuración de Supabase para ELEToolkit

## Paso 1: Crear proyecto en Supabase

1. Ve a https://supabase.com
2. Haz clic en "Start your project"
3. Inicia sesión con GitHub (o crea cuenta)
4. Haz clic en "New Project"

## Paso 2: Configurar el proyecto

### Datos del proyecto:
- **Name**: `ELEToolkit`
- **Database Password**: `EligeUnaContraseñaSegura123!` (guárdala)
- **Region**: `Europe West (Ireland)` o la más cercana a España
- **Pricing Plan**: Gratis (Free Tier)

### Tiempo de espera:
- Supabase tardará ~2-3 minutos en crear el proyecto

## Paso 3: Obtener credenciales

Una vez creado el proyecto:

1. En el dashboard, ve a **Settings** → **API**
2. Copia estos dos valores:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Paso 4: Actualizar tu archivo .env

Edita el archivo `.env` en tu proyecto:

```env
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_real_aqui
EXPO_PUBLIC_OPENAI_API_KEY=tu_openai_api_key_aqui
```

## Paso 5: Crear la tabla de materiales

Ve a **SQL Editor** → **New Query** y ejecuta:

```sql
-- Crear tabla de materiales
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('generador', 'simulador', 'adaptador')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice para mejor performance
CREATE INDEX idx_materials_user_id ON materials(user_id);
CREATE INDEX idx_materials_type ON materials(type);
CREATE INDEX idx_materials_created_at ON materials(created_at DESC);

-- Activar Row Level Security
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad (RLS)
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
```

## Paso 6: Configurar Email Auth (Opcional)

Por defecto, Supabase ya tiene email auth habilitado.

Si quieres personalizar los emails, ve a:
**Authentication** → **Email Templates**

## Paso 7: Verificar configuración

### Test desde la app:

1. Inicia la app: `npm start --web`
2. Intenta registrar un usuario
3. Genera un ejercicio
4. Guárdalo en la base de datos

### Test desde Supabase:

1. Ve a **Table Editor** → **materials**
2. Deberías ver los materiales guardados
3. Ve a **Authentication** → **Users**
4. Deberías ver los usuarios registrados

## Paso 8: Security Best Practices

### ✅ Cosas que ya están configuradas:
- Row Level Security (RLS) activado
- Políticas para que cada usuario solo vea sus materiales
- Anon key con permisos limitados

### ⚠️ Cosas a revisar en producción:
- Configurar email verification
- Activar rate limiting
- Revisar políticas de RLS
- Configurar custom domain (opcional)

## Troubleshooting

### Error: "Invalid API key"
→ Verifica que la API key está correcta en `.env`

### Error: "Permission denied"
→ Verifica que las políticas RLS están creadas correctamente

### Error: "User not authenticated"
→ Asegúrate de que el usuario está logueado antes de guardar materiales

### Los materiales no se guardan
→ Verifica que la tabla `materials` existe y que el user_id es correcto

## URLs Útiles

- Dashboard: https://supabase.com/dashboard
- SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new
- API Docs: https://supabase.com/docs/reference/javascript

## Siguiente Paso

Una vez configurado Supabase, tendrás que:

1. **Configurar OpenAI API Key**
2. **Testear las integraciones**
3. **Probar la app completa**

---

📞 **¿Problemas?**
Revisa los logs en: Supabase Dashboard → Logs → Database Logs
