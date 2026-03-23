import type { RsData } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<RsData<T>> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
  });

  const result = await response.json();

  console.log("REQUEST URL:", `${API_BASE_URL}${path}`);
  console.log("STATUS:", response.status);
  console.log("RESPONSE:", result);

  if (!response.ok) {
    throw new Error(
      typeof result === "string" ? result : JSON.stringify(result, null, 2)
    );
  }

  return result;
}

export const apiClient = {
  get: <T>(path: string) =>
    request<T>(path, {
      method: "GET",
    }),

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(path: string) =>
    request<T>(path, {
      method: "DELETE",
    }),
};