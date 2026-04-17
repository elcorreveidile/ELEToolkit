# 🔑 Configuración de OpenAI para ELEToolkit

## Paso 1: Crear cuenta en OpenAI

1. Ve a https://platform.openai.com
2. Haz clic en "Sign up" o "Log in"
3. Completa el registro

## Paso 2: Crear API Key

1. Ve a: https://platform.openai.com/api-keys
2. Haz clic en "+ Create new secret key"
3. Dale un nombre: "ELEToolkit"
4. **IMPORTANTE**: Copia la API key ahora mismo (solo se muestra una vez)
   - Formato: `sk-proj-xxxxxxxxxxxxx`

## Paso 3: Añadir créditos (Opcional pero recomendado)

OpenAI requiere que añadas fondos a tu cuenta:

1. Ve a: https://platform.openai.com/account/billing
2. Haz clic en "Add to credit balance"
3. Añade mínimo $5-$10 USD

**Costos estimados para ELEToolkit:**
- Generar ejercicio: ~$0.01-$0.05 por ejercicio
- Simular conversación: ~$0.02-$0.10 por conversación
- Adaptar texto: ~$0.01-$0.05 por texto

## Paso 4: Actualizar tu archivo .env

Edita el archivo `.env` en tu proyecto:

```env
EXPO_PUBLIC_SUPABASE_URL=tu_supabase_url_aqui
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui
EXPO_PUBLIC_OPENAI_API_KEY=sk-proj-TU_API_KEY_AQUI
```

## Paso 5: Verificar configuración

### Test desde la app:

1. Inicia la app: `npm start --web`
2. Ve a la pestaña "Generador"
3. Selecciona un nivel (ej: A1)
4. Escribe un tema (ej: "Presente de indicativo")
5. Haz clic en "Generar Ejercicio"
6. Deberías ver un ejercicio generado

### Test de errores comunes:

**Error: "Incorrect API key provided"**
→ Verifica que la API key está correcta en `.env`

**Error: "Insufficient quota"**
→ Necesitas añadir créditos a tu cuenta de OpenAI

**Error: "Rate limit exceeded"**
→ Has hecho demasiadas peticiones rápido, espera un minuto

## Límites y Costos

### Modelos que usa ELEToolkit:
- **GPT-4o**: Modelo principal, más inteligente pero más costoso

### Precios (aproximados):
- Input: ~$2.50 por 1M tokens
- Output: ~$10.00 por 1M tokens

### Estimación de uso:
- 100 ejercicios: ~$1-3 USD
- 100 conversaciones: ~$2-5 USD
- 100 adaptaciones: ~$1-3 USD

## Seguridad

✅ **Buenas prácticas implementadas:**
- API key en archivo `.env` (no en código)
- `.env` en `.gitignore` (no se sube a GitHub)
- Uso de `dangerouslyAllowBrowser: true` solo para desarrollo

⚠️ **Para producción:**
- Considerar usar un backend intermediary
- Implementar rate limiting
- Usar API keys con permisos limitados

## URLs Útiles

- Dashboard: https://platform.openai.com/dashboard
- API Keys: https://platform.openai.com/api-keys
- Billing: https://platform.openai.com/account/billing
- Usage: https://platform.openai.com/account/usage
- Docs: https://platform.openai.com/docs

## Troubleshooting

### Problema: "The model `gpt-4o` does not exist"
→ Tu cuenta puede no tener acceso a GPT-4o, verifica tu plan

### Problema: "Billing not set up"
→ Necesitas añadir un método de pago aunque no gastes

### Problema: "Request timed out"
→ Verifica tu conexión a internet o la API puede estar caída

---

📞 **¿Problemas?**
Revisa los logs en: https://platform.openai.com/account/logs
