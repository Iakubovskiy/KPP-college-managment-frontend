import { API_BASE_URL } from "../config";

class APIService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
      url: string,
      method: string = "GET",
      body?: any,
      headers: HeadersInit = this.getDefaultHeaders()
  ): Promise<T> {
    console.log(`${this.baseURL}/${url}`);
    const response = await fetch(`${this.baseURL}/${url}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(response.status);
      throw new Error(
          `HTTP Error! Status: ${response.status}, Message: ${errorText}`
      );
    }
    return response.json();
  }

  private getDefaultHeaders(): HeadersInit {
    const headers: HeadersInit = {
    };
    headers["Authorization"] = `Bearer testToken1234`;
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  getAll<T>(resource: string): Promise<T[]> {
    return this.request<T[]>(resource);
  }
  get<T>(resource: string): Promise<T[]> {
    return this.request<T[]>(resource);
  }

  getById<T>(resource: string, id: number | string): Promise<T> {
    return this.request<T>(`${resource}/${id}`);
  }

  create<T>(resource: string, data: any): Promise<T> {
    return this.request<T>(resource, "POST", data);
  }

  update<T>(resource: string, id: number | string, data: any): Promise<T> {
    return this.request<T>(`${resource}/${id}`, "PUT", data);
  }

  partialUpdate<T>(resource: string, id: number | string, data: any): Promise<T> {
    return this.request<T>(`${resource}/${id}`, "PATCH", data);
  }

  delete<T>(resource: string, id: number | string): Promise<T> {
    return this.request<T>(`${resource}/${id}`, "DELETE");
  }
}

export default APIService;
