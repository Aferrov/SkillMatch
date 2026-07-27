/**
 * API Service - Gestiona todas las comunicaciones con el backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const CV_ENDPOINT = import.meta.env.VITE_API_CV_ENDPOINT || "/api/cv/analyze";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
}

/**
 * Analiza un CV enviándolo al backend
 * @param file - Archivo PDF del CV
 * @returns Respuesta del análisis
 */
export async function analyzeCV(file: File): Promise<ApiResponse<any>> {
  try {
    if (!file.name.endsWith(".pdf")) {
      return {
        success: false,
        error: "Solo se permiten archivos PDF",
        status: 400,
      };
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}${CV_ENDPOINT}`, {
      method: "POST",
      body: formData,
      // No incluir Content-Type, el navegador lo detectará automáticamente
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || "Error al analizar el CV",
        status: response.status,
      };
    }

    return {
      success: true,
      data,
      status: response.status,
    };
  } catch (error) {
    console.error("Error en analyzeCV:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error de conexión con el servidor",
      status: 0,
    };
  }
}


/**
 * Obtiene el estado del backend
 * @returns true si el backend está disponible
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.ok;
  } catch (error) {
    console.warn("Backend no disponible:", error);
    return false;
  }
}

/**
 * Retorna la URL base del API
 */
export function getApiBaseUrl(): string {
  return API_BASE_URL;
}

// ─── Cursos (Backend) ───────────────────────────────────────────────

interface BackendCourse {
  id: number;
  name: string;
  platform: string;
  skill: string;
  level: string;
  url: string;
  duration: string;
  rating: number | null;
  is_free: boolean;
  is_certification: boolean;
  source: string;
}

interface CoursesResponse {
  total: number;
  courses: BackendCourse[];
}

/**
 * Obtiene cursos desde el backend con filtros opcionales.
 * Retorna null si el backend no está disponible (para fallback a datos estáticos).
 */
export async function fetchCourses(params?: {
  skill?: string;
  platform?: string;
  level?: string;
  is_free?: boolean;
  limit?: number;
}): Promise<CoursesResponse | null> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.skill) searchParams.set("skill", params.skill);
    if (params?.platform) searchParams.set("platform", params.platform);
    if (params?.level) searchParams.set("level", params.level);
    if (params?.is_free !== undefined)
      searchParams.set("is_free", String(params.is_free));
    if (params?.limit) searchParams.set("limit", String(params.limit));

    const qs = searchParams.toString();
    const url = `${API_BASE_URL}/api/courses${qs ? `?${qs}` : ""}`;
    const response = await fetch(url, { method: "GET" });

    if (!response.ok) return null;
    return await response.json();
  } catch {
    console.warn("Backend de cursos no disponible, usando datos estáticos");
    return null;
  }
}

/**
 * Obtiene cursos recomendados para las skills faltantes del usuario.
 */
export async function fetchRecommendedCourses(
  missingSkills: string[]
): Promise<ApiResponse<any>> {
  try {
    const skills = missingSkills.join(",");
    const response = await fetch(
      `${API_BASE_URL}/api/courses/recommend?skills=${encodeURIComponent(skills)}`,
      { method: "GET" }
    );

    const data = await response.json();
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: "Backend de cursos no disponible",
      status: 0,
    };
  }
}

// ─── Agentes de Scraping ────────────────────────────────────────────

/**
 * Dispara la ejecución de agentes de scraping.
 * @param agentName - Nombre del agente (opcional, null = todos)
 */
export async function triggerAgentRun(
  agentName?: string
): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/agents/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agent: agentName || null }),
    });

    const data = await response.json();
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: "No se pudo conectar con el backend",
      status: 0,
    };
  }
}

/**
 * Obtiene el estado actual de los agentes.
 */
export async function getAgentStatus(): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/agents/status`, {
      method: "GET",
    });

    const data = await response.json();
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: "No se pudo obtener el estado de los agentes",
      status: 0,
    };
  }
}

/**
 * Obtiene el historial de ejecuciones de agentes.
 */
export async function getAgentHistory(
  limit: number = 20
): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/agents/history?limit=${limit}`,
      { method: "GET" }
    );

    const data = await response.json();
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: "No se pudo obtener el historial",
      status: 0,
    };
  }
}
