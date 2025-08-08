import useUserStore from "@/src/stores/userStore";

const getBaseUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  return envUrl && envUrl.length > 0 ? envUrl : "http://localhost:4001";
};

export type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export async function apiFetch<TResponse>(
  path: string,
  options: { method?: HttpMethod; body?: unknown; headers?: Record<string, string> } = {}
): Promise<TResponse> {
  const { token } = useUserStore.getState();
  const url = `${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json() : null;
  console.log({ response });
  if (!response.ok) {
    const message = payload?.error?.message || payload?.message || `HTTP ${response.status}`;

    if (
      response.status === 401 ||
      message.toLowerCase().includes("token expired") ||
      message.toLowerCase().includes("unauthorized")
    ) {
      const { clearUser } = useUserStore.getState();

      clearUser();
    }

    throw new Error(message);
  }

  if (payload && typeof payload === "object" && "success" in payload) {
    if (payload.success) return payload.data as TResponse;
    const message = payload?.error?.message || "Request failed";

    if (message.toLowerCase().includes("token expired") || message.toLowerCase().includes("unauthorized")) {
      const { clearUser } = useUserStore.getState();

      clearUser();
    }

    throw new Error(message);
  }

  return payload as TResponse;
}
