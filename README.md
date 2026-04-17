# ELE Toolkit 🇪🇸

Toolkit para profesores de español con IA. Generador de ejercicios, simulador de conversación y adaptador de textos.

## 🎯 Características

- **Generador**: Crea ejercicios personalizados por nivel (A1-C2)
- **Simulador**: Practica conversaciones con IA
- **Adaptador**: Adapta textos a diferentes niveles
- **Multiplataforma**: iOS y Web (Android próximamente)

## 🚀 Inicio Rápido

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:

```env
EXPO_PUBLIC_SUPABASE_URL=tu_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
EXPO_PUBLIC_OPENAI_API_KEY=tu_openai_api_key
```

### 3. Iniciar desarrollo

```bash
# Web
npm start --web

# iOS (requiere macOS + Xcode)
npm start --ios
```

## 📦 Stack Tecnológico

- **Frontend**: React Native + Expo
- **Navegación**: Expo Router (File-based)
- **Backend**: Supabase (Auth + PostgreSQL)
- **IA**: OpenAI API (GPT-4)
- **Estado**: Zustand
- **Estilos**: NativeWind (Tailwind)
- **Tipado**: TypeScript

## 🗄️ Setup Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ejecuta el SQL en `PROJECT_STRUCTURE.md`
3. Copia URL y anon key a `.env`

## 📱 Screenshots

*Coming soon*

## 🏗️ Estructura del Proyecto

Ver `PROJECT_STRUCTURE.md` para detalles completos.

## 🤝 Contribuir

1. Fork
2. Branch (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. PR

## 📄 Licencia

MIT

## 👨‍💻 Autor

Javier Benítez
