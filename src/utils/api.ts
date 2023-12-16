// src/utils/api.ts
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

async function request<T>(method: HttpMethod, url: string, body?: object): Promise<T | null | any> {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        // Aquí puedes agregar cualquier otro encabezado necesario
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    
    if (!response.ok) {
      console.error(`Error aaa ${method} request to ${url}:`, response.status, response.statusText);
      return await response.json();
    }

    const result: T = await response.json();
    return result;
  } catch (error) {
    console.error(`Error ${method} request to ${url}:`, error);
    return null;
  }
}
export default request;