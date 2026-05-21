/**
 * Safely read a fetch Response body as JSON without throwing on HTML/plain errors.
 * Uses Content-Type when present; falls back to JSON-shaped bodies for API quirks.
 */
export type ParseJsonResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; message: string };

export async function parseResponseJson<T = unknown>(
  res: Response
): Promise<ParseJsonResult<T>> {
  const raw = await res.text();
  const trimmed = raw.trim();
  const contentType = (res.headers.get("content-type") ?? "").toLowerCase();

  const contentTypeSaysJson =
    contentType.includes("application/json") ||
    contentType.includes("application/problem+json") ||
    contentType.includes("+json");

  const bodyLooksLikeJson =
    trimmed.startsWith("{") ||
    trimmed.startsWith("[") ||
    trimmed.startsWith('"');

  if (!contentTypeSaysJson && !bodyLooksLikeJson) {
    return {
      ok: false,
      status: res.status,
      message:
        trimmed.replace(/\s+/g, " ").slice(0, 200) ||
        `Request failed (${res.status})`,
    };
  }

  try {
    return { ok: true, data: JSON.parse(raw) as T };
  } catch {
    return {
      ok: false,
      status: res.status,
      message: "Response was not valid JSON.",
    };
  }
}
