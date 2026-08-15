const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://theblinghaven.onrender.com';
  }
  return 'http://localhost:4000';
};

const API_BASE_URL = getApiBaseUrl();

export interface ApiClientOptions extends RequestInit {
  data?: any;
}

export class ApiError extends Error {
  code: string;
  status: number;
  details?: any;

  constructor(message: string, code: string, status: number, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const { data, headers = {}, ...customConfig } = options;

  let token: string | null = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('tbh_admin_access_token');
  }

  const reqHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers as Record<string, string>),
  };

  const config: RequestInit = {
    ...customConfig,
    headers: reqHeaders,
    credentials: 'include', // include cookies for HttpOnly fallback
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const response = await fetch(`${API_BASE_URL}${cleanEndpoint}`, config);

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg =
      json?.error?.message ||
      json?.message ||
      'An unexpected error occurred. Please try again.';
    const errorCode = json?.error?.code || `HTTP_${response.status}`;
    const errorDetails = json?.error?.details || null;

    if (response.status === 401 && typeof window !== 'undefined') {
      // Clear token on unauthorized if not on login page
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('tbh_admin_access_token');
        localStorage.removeItem('tbh_admin_user');
      }
    }

    throw new ApiError(errorMsg, errorCode, response.status, errorDetails);
  }

  // Handle standard API wrapper { success: true, data: T, meta?: Meta }
  if (json && typeof json === 'object' && 'data' in json && 'success' in json) {
    if ('meta' in json && json.meta) {
      return { data: json.data, meta: json.meta } as T;
    }
    return json.data as T;
  }

  return json as T;
}
