# 🚀 Guía de Ejecución - SkillMatch

## Estructura del Proyecto

```
SkillMatch/
├── src/                           # Frontend React/TypeScript (Vite)
├── SkillMatch Backend/            # Backend FastAPI (Python)
├── .env.local                     # Variables de entorno del frontend
├── package.json                   # Dependencias del frontend
└── vite.config.ts                 # Configuración de Vite
```

---

## 📋 Prerequisitos

Antes de empezar, asegúrate de tener instalado:
- **Node.js** (versión 18+)
- **Python** (versión 3.8+)
- **pip** (gestor de paquetes de Python)

---

## 🏃 Ejecutar en Modo Desarrollo

### Opción 1: Ejecutar en Dos Terminales (Recomendado)

#### Terminal 1 - Ejecutar el Backend (FastAPI)

```bash
# Navega a la carpeta del backend
cd "SkillMatch Backend"

# Instala las dependencias Python
pip install -r requirements.txt

# Ejecuta el servidor FastAPI
python app/main.py
# O si usas uvicorn directamente:
# uvicorn app.main:app --reload --port 8000
```

El backend estará disponible en: **http://localhost:8000**

#### Terminal 2 - Ejecutar el Frontend (React/Vite)

```bash
# En la raíz del proyecto (SkillMatch)
npm run dev
```

El frontend estará disponible en: **http://localhost:5173**

---

## ⚙️ Configuración

### Variables de Entorno del Frontend

El archivo `.env.local` ya está configurado:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_API_CV_ENDPOINT=/api/cv/analyze
```

**Para cambiar el puerto del backend**, edita `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8000  # Cambia 8000 por el puerto de tu backend
```

### Variables de Entorno del Backend

El archivo `.env` en `SkillMatch Backend/` contiene:

```env
RAPIDAPI_KEY=...
GROQ_API_KEY=...
DATABASE_URL=sqlite:///skillmatch.db

# Opcional: clave para firmar los tokens de sesión.
# Si no se define, el backend genera una y la guarda en `.auth_secret`
# (ignorado por git). En producción DEFÍNELA explícitamente.
AUTH_SECRET_KEY=una-clave-larga-y-aleatoria
```

---

## 🔐 Sesiones y Autenticación

El login es real y no requiere dependencias extra de Python: las contraseñas
se guardan con **PBKDF2-HMAC-SHA256** (salt único por usuario) y la sesión
viaja en un **JWT HS256**, todo con la librería estándar.

**Cómo se mantiene la sesión:**

| Dónde | Qué guarda | Cuándo caduca |
|---|---|---|
| `localStorage` (con "Recordarme") | token + usuario | 30 días |
| `sessionStorage` (sin "Recordarme") | token + usuario | al cerrar la pestaña |
| Tabla `user_profiles` | último análisis, perfil y preferencias | permanente |
| Tabla `analysis_runs` | historial de análisis (score, brechas, fecha) | permanente |

Al recargar la página, el frontend rehidrata la sesión desde el navegador y
la revalida contra `/api/auth/me`. Mientras esa comprobación ocurre muestra
una pantalla de "Restaurando tu sesión...", por lo que **recargar o usar el
botón atrás ya no devuelve al login**. Si el backend está caído, la sesión
local se conserva en vez de expulsar al usuario.

Cada pantalla tiene su propia URL (`/login`, `/subir-cv`, `/resultados`,
`/vacantes`, `/panel`, ...), así que el historial del navegador, los
marcadores y el botón atrás funcionan de forma nativa.

---

## 🔌 Endpoints Disponibles

### Autenticación

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/register` | Crea cuenta y devuelve token |
| POST | `/api/auth/login` | Inicia sesión (`remember` alarga el token a 30 días) |
| GET | `/api/auth/me` | Valida el token guardado |
| POST | `/api/auth/logout` | Cierra sesión |
| GET | `/api/auth/session` | Recupera el último análisis/perfil guardado |
| PUT | `/api/auth/session` | Guarda el estado de la sesión |
| GET | `/api/auth/stats` | Métricas reales: nº de análisis, evolución del score, historial |

Cada `PUT /api/auth/session` que incluya `analysis` deja una entrada en la
tabla `analysis_runs`. De ahí salen las cifras del panel (análisis realizados,
"último: hace 2 días", variación de puntuación) y la actividad reciente:
ninguna está codificada a mano en el frontend.

```bash
# Registro
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"María González","email":"maria@ejemplo.com","password":"password123"}'

# Uso del token en rutas protegidas
curl "http://localhost:8000/api/auth/me" -H "Authorization: Bearer <token>"
```

Las rutas `/api/auth/me` y `/api/auth/session` responden **401** con un token
ausente, inválido o caducado; el frontend lo interpreta limpiando la sesión.

### CV Analysis

**POST** `/api/cv/analyze`

Analiza un archivo PDF de CV.

**Request:**
```bash
curl -X POST "http://localhost:8000/api/cv/analyze" \
  -H "accept: application/json" \
  -F "file=@path/to/cv.pdf"
```

**Response:**
```json
{
  "skills": [...],
  "experience": [...],
  "education": [...]
}
```

---

## 🛠️ Comando de Construcción (Producción)

### Frontend

```bash
npm run typecheck   # solo verifica tipos
npm run build       # verifica tipos y compila
```

Genera la carpeta `build/` lista para producción.

> `npm run build` ahora ejecuta `tsc --noEmit` antes de compilar. Vite por sí
> solo elimina los tipos sin comprobarlos, así que errores como un componente
> usado sin importar pasaban desapercibidos hasta romper en el navegador.

**Importante al desplegar:** la app usa rutas reales (`/resultados`, `/panel`,
...), así que el servidor debe redirigir cualquier ruta desconocida a
`index.html`. En Nginx:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### Backend

El backend FastAPI está listo para producción. Para servirlo con **Gunicorn**:

```bash
pip install gunicorn
cd "SkillMatch Backend"
gunicorn -w 4 -b 0.0.0.0:8000 app.main:app
```

---

## 🧪 Prueba de Integración

Una vez que ambos servidores estén corriendo:

1. Abre **http://localhost:5173** en tu navegador
2. Ve al formulario de "Sube tu CV"
3. Sube un archivo PDF
4. Verifica que el análisis se complete exitosamente

Si no funciona, revisa:
- ✅ El backend esté corriendo en `http://localhost:8000`
- ✅ Las variables en `.env.local` sean correctas
- ✅ El navegador no tenga problemas de CORS (ya está configurado en el backend)
- ✅ Los archivos PDF sean válidos

---

## 📝 Troubleshooting

### Error: "Cannot POST /api/cv/analyze"
- El backend no está corriendo. Ejecuta `python app/main.py` en la carpeta `SkillMatch Backend`

### Error: "CORS policy"
- Ya está configurado en el backend. Si sigue ocurriendo, verifica que `CORSMiddleware` esté en `app/main.py`

### Error: "Failed to load module script"
- Asegúrate de que `npm install` se ejecutó correctamente
- Intenta: `rm -r node_modules package-lock.json && npm install`

### El backend no inicia
- Verifica que Python 3.8+ esté instalado: `python --version`
- Instala dependencias: `pip install -r requirements.txt`
- Revisa que el puerto 8000 no esté en uso: `netstat -ano | findstr :8000` (Windows)

---

## 🔗 Integración de Código

### Cómo usar el servicio de API en componentes

```typescript
import { analyzeCV } from '../services/api';

// En tu componente
const handleAnalyzeCV = async (file: File) => {
  const result = await analyzeCV(file);
  
  if (result.success) {
    console.log('CV Analysis:', result.data);
  } else {
    console.error('Error:', result.error);
  }
};
```

---

## 📦 Estructura de Carpetas

### Frontend
```
src/
├── components/               # Componentes React (una pantalla por archivo)
├── context/
│   └── AuthContext.tsx       # Estado global de sesión (checking/authenticated/guest)
├── hooks/
│   ├── useRouter.ts          # Router sobre la History API (URLs + botón atrás)
│   └── useAnalysisSession.ts # Análisis de CV persistido y sincronizado
├── services/
│   ├── api.ts                # Cliente HTTP (CV, cursos, agentes)
│   └── auth.ts               # Login/registro y almacenamiento del token
├── data/                     # Datos estáticos
├── App.tsx                   # Rutas, guardas de acceso y flujo entre pantallas
└── main.tsx                  # Entry point
```

### Backend
```
SkillMatch Backend/
├── app/
│   ├── main.py           # Aplicación FastAPI
│   ├── routes/           # Endpoints
│   ├── services/         # Lógica de negocio
│   ├── models/           # Modelos de datos
│   └── utils/            # Utilidades
├── .env                  # Variables de entorno
├── requirements.txt      # Dependencias Python
└── skillmatch.db         # Base de datos SQLite
```

---

**¡Listo! Tu SkillMatch ya debe estar funcionando con frontend y backend conectados.** 🎉
