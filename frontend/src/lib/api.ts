export type ApiError = {
  message: string;
  details?: unknown;
};

export async function apiFetch<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(input, init);
  const contentType = res.headers.get("content-type") || "";

  // Best-effort parse
  let data: unknown = null;
  if (contentType.includes("application/json")) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  } else {
    try {
      const text = await res.text();
      data = { message: text };
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const err = data as Partial<ApiError> | null;
    throw new Error(err?.message || `Request failed with status ${res.status}`);
  }

  return data as T;
}

