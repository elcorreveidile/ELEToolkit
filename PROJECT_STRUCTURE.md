# ELE Toolkit - Estructura del Proyecto

## 📁 Estructura de Carpetas

```
ELEToolkit/
├── app/                           # Expo Router (File-based routing)
│   ├── (tabs)/                   # Tab Navigator
│   │   ├── index.tsx            # Generador (Home tab)
│   │   ├── simulador.tsx        # Simulador tab
│   │   ├── adaptador.tsx        # Adaptador tab
│   │   └── _layout.tsx          # Tab layout configuration
│   ├── +html.tsx                # HTML entry para web
│   ├── +not-found.tsx           # 404 page
│   ├── _layout.tsx              # Root layout
│   └── modal.tsx                # Modal example
│
├── src/                          # Código fuente
│   ├── components/              # Componentes reutilizables
│   │   ├── ui/                 # Componentes base (Button, Input, Card)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Card.tsx
│   │   └── features/           # Componentes de dominio
│   │
│   ├── screens/                # Pantallas principales
│   │   ├── generador/         # Módulo Generador
│   │   │   └── GeneradorScreen.tsx
│   │   ├── simulador/         # Módulo Simulador
│   │   │   └── SimuladorScreen.tsx
│   │   └── adaptador/         # Módulo Adaptador
│   │       └── AdaptadorScreen.tsx
│   │
│   ├── lib/                    # Lógica de negocio
│   │   ├── supabase/          # Cliente Supabase
│   │   │   └── client.ts      # Cliente + Tipos DB
│   │   ├── openai/            # Cliente OpenAI
│   │   │   └── client.ts      # Cliente + Servicio
│   │   └── utils/             # Utilidades
│   │       └── index.ts
│   │
│   ├── store/                 # Zustand (Estado global)
│   │   ├── authStore.ts       # Estado autenticación
│   │   └── materialsStore.ts  # Estado materiales
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.ts
│   │   └── useMaterials.ts
│   │
│   ├── constants/             # Constantes de la app
│   │   └── index.ts          # Niveles, tipos, topics
│   │
│   └── types/                 # TypeScript types
│       └── index.ts          # Types globales
│
├── assets/                    # Recursos estáticos
│   ├── images/
│   └── fonts/
│
├── components/                # Componentes generados por Expo
│   └── (puedes mover los útiles a src/)
│
├── constants/                 # Constantes generadas por Expo
│
├── .env.example              # Plantilla variables entorno
├── .env                      # Tus variables reales (crear)
├── app.json                  # Configuración Expo
├── package.json              # Dependencias
├── tsconfig.json             # Config TypeScript
├── tailwind.config.js        # Config Tailwind/NativeWind
├── babel.config.js           # Config Babel + NativeWind
└── nativewind-env.d.ts       # Tipos NativeWind
```

## 🚀 Comandos

```bash
# Desarrollo
npm start              # Iniciar Expo
npm run web           # Abrir en navegador
npm run ios           # Abrir en iOS Simulator
npm run android       # Abrir en Android Emulator

# Producción
eas build --platform web
eas build --platform ios
```

## 🔐 Variables de Entorno

Crea `.env` basado en `.env.example`:

```env
EXPO_PUBLIC_SUPABASE_URL=tu_url_aqui
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_key_aqui
EXPO_PUBLIC_OPENAI_API_KEY=tu_key_aqui
```

## 🗄️ Schema Supabase

```sql
-- Tabla: materials
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('generador', 'simulador', 'adaptador')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

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

## 📱 Notas Platform-Specific

### Web vs iOS

- **SafeAreaView**: Solo necesario en iOS
- **KeyboardAvoidingView**: Comportamiento diferente
- **Platform.OS**: Usa para lógica específica

```typescript
import { Platform } from 'react-native';

if (Platform.OS === 'ios') {
  // iOS-specific code
}
```

### Archivos Platform-Specific

```
Button.tsx          # Compartido
Button.ios.tsx      # iOS-only
Button.web.tsx      # Web-only
```

## 🎨 Estilos con NativeWind

```tsx
import { View } from 'react-native';

<View className="flex-1 bg-white p-4 rounded-lg">
  {/* Tu contenido */}
</View>
```

## 📦 Librerías Principales

- **expo-router**: Navegación file-based
- **supabase-js**: Backend (Auth + DB)
- **openai**: API OpenAI
- **zustand**: Estado global
- **nativewind**: Tailwind para React Native
- **axios**: Peticiones HTTP
- **date-fns**: Fechas

## 🏗️ Arquitectura

```
┌─────────────────────────────────────┐
│           UI Layer                  │
│  (Screens + Components)             │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         State Layer                 │
│  (Zustand Stores)                   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        Service Layer                │
│  (OpenAI + Supabase Clients)        │
└─────────────────────────────────────┘
```

## 🔄 Flujo de Datos

1. Usuario interactúa con Screen
2. Screen llama Hook personalizado
3. Hook accede a Zustand Store
4. Store llama Service Layer
5. Service retorna datos a Store
6. Store notifica a Screen
7. Screen re-renderiza con nuevos datos
