/**
 * API Service - Gestiona todas las comunicaciones con el backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const CV_ENDPOINT = import.meta.env.VITE_API_CV_ENDPOINT || "/api/cv/analyze";
const LINKEDIN_ENDPOINT = "/api/linkedin/analyze";

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
 * Analiza un perfil de LinkedIn dado su URL
 * @param linkedinUrl - URL del perfil (https://linkedin.com/in/usuario)
 * @returns Respuesta del análisis (mismo formato que analyzeCV)
 */
export async function analyzeLinkedIn(linkedinUrl: string): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_BASE_URL}${LINKEDIN_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: linkedinUrl }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || "Error al analizar el perfil de LinkedIn",
        status: response.status,
      };
    }

    return {
      success: true,
      data,
      status: response.status,
    };
  } catch (error) {
    console.error("Error en analyzeLinkedIn:", error);
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
