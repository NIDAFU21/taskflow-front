import { API_URL, TOKEN_KEY } from '@/lib/constants';

// 1. Interfaces de Datos de TaskFlow API
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginResponseData {
  token: string;
  user: User;
}

export type RegisterResponseData = User;

/**
 * Cliente HTTP centralizado para TaskFlow API.
 * Inyecta automáticamente el token JWT almacenado en localStorage
 * y estandariza el manejo de respuestas y errores.
 */
export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  // Obtenemos el token guardado usando la clave dinámica configurada
  const token = localStorage.getItem(TOKEN_KEY);

  // Construcción de encabezados
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) headers.set('Authorization', `Bearer ${token}`);

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    let data: ApiResponse<T>;
    try {
      data = await response.json();
    } catch {
      throw new Error('La API devolvió una respuesta que no se pudo leer.');
    }

    if (!response.ok || data.success === false) {
      throw new Error(
        data.message || 'Ocurrió un error al procesar la solicitud'
      );
    }

    return data;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message === 'Failed to fetch'
          ? 'No se pudo conectar con la API. Verifica que el backend esté iniciado.'
          : error.message
        : 'Ocurrió un error inesperado al conectar con el servidor';

    console.error(
      `[API Error] ${options.method || 'GET'} ${endpoint}:`,
      errorMessage
    );
    throw new Error(errorMessage, { cause: error });
  }
}
