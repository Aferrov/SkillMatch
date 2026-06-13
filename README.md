# SkillMatch

SkillMatch es una aplicación web que analiza el CV de un profesional, lo compara con vacantes reales o simuladas del mercado peruano (con foco en Arequipa) y entrega un diagnóstico accionable: porcentaje de compatibilidad por oferta, brechas de habilidades, cursos recomendados para cerrarlas y un panel para gestionar el perfil.

Construida con **React 18 + TypeScript + Vite 6** y CSS de **Tailwind v4** precompilado de forma estática.

---

## Características implementadas

| # | Módulo | Pantalla(s) |
|---|---|---|
| 1 | Inicio y presentación | `Home` |
| 2 | Registro e inicio de sesión | `RegisterPricing`, `Login` |
| 3 | One-Click Onboarding (PDF / Word / LinkedIn / manual) | `UploadCV`, `ManualProfile` |
| 4 | Procesamiento del CV con IA / NLP (simulado) | `AnalysisProcess`, `CVAnalysisReview` |
| 5 | Base de datos de vacantes y requisitos | `VacancyList` + `src/data/vacancies.ts` |
| 6 | Cálculo del porcentaje de compatibilidad | `src/data/matching.ts` |
| 7 | Dashboard de resultados | `ResultsDashboard` |
| 8 | Módulo de análisis de brechas | `SkillGapAnalysis` |
| 9 | Recomendación de cursos | `CourseRecommendations` + `src/data/courses.ts` |
| 10 | Recomendación de empleos | `JobRecommendations` |
| 13 | Perfil del usuario (editable) | `ProfilePage` |

Pantalla transversal: `UserDashboard` (resumen, plan, accesos rápidos a todos los módulos).

---

## Flujo principal

```
home
 ├─ register ──┐
 └─ login ─────┤
               ▼
            upload ──► manualProfile (alternativa)
               │
               ▼
          preferences
               │
               ▼
           analyzing
               │
               ▼
           cvReview ──► results (Dashboard de diagnóstico)
                          │
                          ├─► recommendations (empleos curados con "Postular")
                          ├─► vacancies (BD completa con filtros)
                          ├─► skillGap (Detectadas vs Faltantes)
                          ├─► courses (rutas de aprendizaje)
                          └─► dashboard (cuenta) ──► profile
```

La navegación se hace por `useState<Screen>` en `src/App.tsx` (no hay router); cada pantalla recibe los handlers que necesita.

---

## Stack

- **React 18** + **TypeScript** + **Vite 6** (SWC)
- **Tailwind v4** precompilado en `src/index.css` (sin `postcss.config` ni `tailwind.config`)
- **lucide-react** para iconografía
- **Radix UI** (instalado en `src/components/ui/`, no usado por los módulos nuevos)

---

## Estructura del proyecto

```
src/
├─ App.tsx                       Hub de navegación
├─ main.tsx                      Entrypoint
├─ index.css                     Tailwind v4 precompilado
│
├─ components/
│  ├─ Home.tsx
│  ├─ Login.tsx
│  ├─ RegisterPricing.tsx
│  ├─ UploadCV.tsx
│  ├─ ManualProfile.tsx
│  ├─ PreferencesForm.tsx
│  ├─ AnalysisProcess.tsx        Simulación NLP
│  ├─ CVAnalysisReview.tsx       Datos extraídos editables
│  ├─ ResultsDashboard.tsx       Panel de diagnóstico (Req 7)
│  ├─ JobRecommendations.tsx     Empleos curados (Req 10)
│  ├─ VacancyList.tsx            BD navegable (Req 5)
│  ├─ SkillGapAnalysis.tsx       Habilidades detectadas vs faltantes (Req 8)
│  ├─ CourseRecommendations.tsx  Cursos por brecha (Req 9)
│  ├─ ProfilePage.tsx            Perfil editable (Req 13)
│  └─ UserDashboard.tsx          Cuenta del usuario
│
└─ data/
   ├─ vacancies.ts               16 vacantes + helpers
   ├─ userProfile.ts             Mock del usuario + tipos
   ├─ matching.ts                Motor de scoring + análisis de brechas
   └─ courses.ts                 33 cursos + recomendación por brecha
```

---

## Motor de matching

`src/data/matching.ts` expone funciones puras (sin side effects, fáciles de testear):

```ts
calculateMatch(profile, vacancy)        → MatchResult { score, breakdown, matched, missing }
calculateAllMatches(profile, vacancies) → MatchResult[]  // ordenado por score desc
calculateProfileScore(profile, matches) → ProfileScore   // 0-100 con desglose
aggregateMissingSkills(matches, limit)  → MissingSkillAgg[]
analyzeSkillGap(profile, vacancies)     → SkillGapEntry[]
```

**Pesos del score (0-100)**

| Componente | Peso |
|---|---|
| Skills (required + nice-to-have) | 50% |
| Experiencia (años) | 25% |
| Modalidad (preferencia del usuario) | 15% |
| Ubicación | 10% |

La comparación de skills usa normalización (`lowercase`, sin tildes, sin signos) para tolerar variaciones como `"Power BI"` ↔ `"power bi"`.

---

## Base de datos de vacantes

`src/data/vacancies.ts` — 16 vacantes con cobertura realista del mercado peruano:

- **Banca**: Interbank, BCP, Credicorp, Caja Arequipa
- **Industria / Minería**: Yura, Cementos Yura, Backus, Cerro Verde
- **Tech**: Rappi, Belatrix, Globant, IBM Perú
- **Retail / Servicios**: Falabella, Plaza Vea, Sodimac, Movistar

Cada `Vacancy` tiene `title`, `company`, `location`, `modalidad`, `salary?`, `contractType`, `requiredSkills`, `niceToHaveSkills?`, `experienciaMinimaAnios`, `experienciaNivel`, `description`, `responsibilities`, `industry`, `postedAt`.

---

## Base de cursos

`src/data/courses.ts` — 33 cursos asociados a habilidades concretas:

- Plataformas: Coursera, Udemy, Platzi, edX, Scrum.org, PMI, AWS Skill Builder, Cibertec, Británico, etc.
- Para cada curso: `name`, `platform`, `skill`, `level`, `url`, `duration`, `rating?`, `isFree?`, `isCertification?`
- `recommendCoursesForGaps(gaps)` mapea las brechas detectadas → cursos sugeridos ordenados por demanda

---

## Correr localmente

```bash
npm install
npm run dev        # servidor de desarrollo (Vite)
npm run build      # build de producción → build/
npm run preview    # preview del build
```

Requiere Node 18+.

---

## Notas sobre el estado

- El perfil del usuario es un mock estático (`MOCK_USER_PROFILE`) compartido entre pantallas.
- `ProfilePage` permite editar todas las secciones, pero el cambio es **local al componente** — no se propaga a `Recommendations`, `SkillGapAnalysis` ni `CourseRecommendations` (que leen el mock directamente).
- Para reactividad cross-screen es necesario levantar el estado a `App.tsx` o introducir un contexto (`UserProfileContext`). Las funciones del motor de matching ya están preparadas: todas reciben `profile` como argumento, no leen el mock por su cuenta.
- Tailwind v4 está precompilado: no se puede usar cualquier clase arbitraria; sólo las ya presentes en `src/index.css`. Antes de añadir clases nuevas, verificar con grep.

---

## Próximos pasos sugeridos

- **State centralizado** del perfil para que las ediciones propaguen al matching.
- **Backend real** para vacantes y cursos (la firma de los tipos en `data/` no cambia).
- **NLP real** sustituyendo el mock de `AnalysisProcess.tsx` por una llamada a un servicio que procese el PDF/Word.
- **Persistencia** vía localStorage o backend para que las postulaciones, perfil editado y favoritos sobrevivan al refresh.
