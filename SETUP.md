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
```

---

## 🔌 Endpoints Disponibles

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
npm run build
```

Genera la carpeta `dist/` lista para producción.

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
├── components/      # Componentes React
├── services/
│   └── api.ts       # Cliente HTTP (comunicación con backend)
├── data/            # Datos estáticos
├── App.tsx          # Componente principal
└── main.tsx         # Entry point
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
