import type { RsData } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<RsData<T>> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.msg || "요청 중 오류가 발생했습니다.");
  }

  return result;
}

export const apiClient = {
  get: <T>(path: string) =>
    request<T>(path, { method: "GET" }),

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(path: string) =>
    request<T>(path, { method: "DELETE" }),
};