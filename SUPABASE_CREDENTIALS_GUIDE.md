# 🔑 Encontrar las credenciales correctas de Supabase

## NO uses la "Publishable key" que estás viendo

Esa es para servicios de pago (Stripe), no para la base de datos.

## ✅ Las credenciales correctas están aquí:

### PASO 1: Navegar a la sección correcta

1. En tu dashboard de Supabase, busca el proyecto "ELEToolkit"
2. En el menú lateral izquierdo, ve a:
   **⚙️ Settings** → **API**

### PASO 2: Encontrar las credenciales correctas

En la página "API", busca una sección que dice **"Project API keys"** o similar.

Verás algo como esto:

```
Project URL

https://xxxxxxxxxxxx.supabase.co
📋 Copy


Project API keys

anon public
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi... (muy larga)
📋 Copy


service_role
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi... (muy larga)
📋 Copy
```

### ❗ LAS QUE NECESITO:

1. **Project URL**
   - Empieza por: `https://`
   - Termina por: `.supabase.co`

2. **anon public** key
   - Empieza por: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`
   - Es una clave muy larga

### ❗ NO uses:
- ~~Publishable key~~ (esa es para Stripe/pagos)
- ~~service_role key~~ (esa es para servidor, no la queremos)

## 🎯 Lo que debes hacer:

1. Ve a: **Settings** → **API** (en el menú lateral del proyecto)
2. Busca la sección **"Project URL"** → cópiala
3. Busca la sección **"anon public"** → cópiala
4. Pégalas ambas aquí

## 📸 Si no las encuentras:

Haz una captura de pantalla de la página **Settings → API** y muéstramela.
