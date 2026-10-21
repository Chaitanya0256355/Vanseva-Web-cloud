import { ApiResponse } from '../types';

export async function apiRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : endpoint;
  const headers = new Headers(options.headers || {});

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  headers.set('Accept', 'application/json');

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // sends VANSEVA_SESSION cookie automatically
  };

  const response = await fetch(url, config);

  // If 401 or not json
  if (response.status === 401 && endpoint.includes('/api/auth/me')) {
    throw new Error('Not authenticated');
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const json = await response.json();
    if (!response.ok || json.success === false) {
      throw new Error(json.message || `Request failed with status ${response.status}`);
    }
    return json.data !== undefined ? json.data : json;
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return (await response.text()) as any;
}
