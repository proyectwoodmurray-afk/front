// En desarrollo usamos el proxy configurado en next.config.mjs
// Usar variable de entorno para la URL base
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

interface RequestInfo {
  url: string;
  method: string;
  hasBody: boolean;
  isFormData: boolean;
  contentType?: string;
}

interface ApiError extends Error {
  name: string;
  message: string;
  status?: number;
  stack?: string; 
  endpoint?: string;
  method?: string;
  timestamp?: string;
  requestInfo?: RequestInfo;
  responseData?: any;
}

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

interface SafeLogData {
  url: string;
  method: string;
  headers: HeadersInit | undefined;
  body?: unknown;
}

// Función helper para serializar errores de forma segura
function serializeError(error: unknown): Record<string, any> {
  if (error instanceof Error) {
    return {
      name: error.name || 'Error',
      message: error.message || 'Error desconocido',
      stack: error.stack,
      ...(error as any)
    };
  }
  return {
    message: String(error)
  };
}

// Función helper para hacer llamadas a la API
export async function fetchApi<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  let response: Response | null = null;
  let responseText: string | null = null;

  try {
    // 1. Construir URL: normalizar base (sin slash final) y asegurar un único slash entre base y endpoint
    const base = API_BASE_URL.replace(/\/$/, '');
    const url = endpoint.startsWith('/') ? `${base}${endpoint}` : `${base}/${endpoint}`;
    
    // 2. Preparar headers
    const headers = new Headers();
    
    // 3. Validar y configurar Content-Type
    if (options.body instanceof FormData) {
      // No establecer Content-Type para FormData, el navegador lo hará automáticamente
      console.log('📦 FormData detectado:', {
        entries: Array.from(options.body.entries()).map(([key]) => key)
      });
    } else {
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
    }
    
    // 4. Añadir token si existe
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    // 5. Configurar la petición
    // Por defecto no incluir credenciales en fetch (evita problemas de cookies entre dominios).
    // Si un caller necesita credenciales, puede pasar { credentials: 'include' } en options.
    const config: RequestInit = Object.assign({
      method: options.method || 'GET',
      headers,
      body: options.body
    }, options);

    // Logging de la petición
    console.log('📡 Request:', {
      url,
      method: config.method,
      headers: Object.fromEntries(headers.entries()),
      hasBody: !!config.body,
      isFormData: config.body instanceof FormData
    });

    // 6. Realizar la petición
    response = await fetch(url, config);
    
    // 7. Manejar respuesta
    responseText = await response.text();
    
    // Logging de la respuesta
    console.log('📥 Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseText.substring(0, 1000)
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        errorData = { message: responseText };
      }

      const apiError = new Error() as ApiError;
      apiError.message = errorData.message || `HTTP error! status: ${response.status}`;
      apiError.status = response.status;
      apiError.responseData = errorData;
      throw apiError;
    }
    
    // 8. Parsear respuesta
    try {
      const data = JSON.parse(responseText);
      return data as T;
    } catch (e) {
      console.error('Error al parsear respuesta JSON:', {
        error: serializeError(e),
        responseText: responseText?.substring(0, 1000)
      });
      throw new Error('Error al procesar la respuesta del servidor');
    }

  } catch (error) {
    // Capturar y enriquecer el error
    const enhancedError = (error instanceof Error ? error : new Error()) as ApiError;
    
    if (!(error instanceof Error)) {
      enhancedError.message = 'Error desconocido en la petición';
    }

    // Añadir información adicional al error
    Object.assign(enhancedError, {
      endpoint,
      method: options.method || 'GET',
      timestamp: new Date().toISOString(),
      status: response?.status,
      requestInfo: {
        url: `${API_BASE_URL}${endpoint}`,
        method: options.method || 'GET',
        hasBody: !!options.body,
        isFormData: options.body instanceof FormData,
        contentType: options.body instanceof FormData ? 'multipart/form-data' : 'application/json'
      }
    });

    // Crear un objeto serializable para el logging
    const errorDetails = {
      name: enhancedError.name || 'Error',
      message: enhancedError.message || 'Error desconocido',
      status: enhancedError.status || response?.status || 'Sin estado',
      endpoint: endpoint || 'Sin endpoint',
      method: options.method || 'GET',
      timestamp: enhancedError.timestamp,
      requestInfo: enhancedError.requestInfo || {},
      responseData: enhancedError.responseData || {},
      stack: enhancedError.stack?.split('\n').slice(0, 5).join('\n') || 'Sin stack trace'
    };

    // Asegurar que el objeto es serializable
    const safeErrorDetails = JSON.parse(JSON.stringify(errorDetails));
    console.error('❌ Error detallado:', safeErrorDetails);

    throw enhancedError;
  }
}