import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:5000";

function jsonError(message: string, status: number, details?: unknown) {
  return NextResponse.json(
    {
      message,
      ...(details !== undefined ? { details } : {}),
    },
    { status }
  );
}

async function safeReadJson(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return {
      message: "Backend returned non-JSON response",
      raw: text,
    };
  }
}

export async function GET(req: NextRequest) {
  if (!BACKEND_URL) {
    return jsonError(
      "Configuration error: BACKEND_URL is missing.",
      500,
      {
        hint: "Set BACKEND_URL / NEXT_PUBLIC_BACKEND_URL to your backend origin, e.g. http://localhost:5000",
      }
    );
  }

  const cookieHeader = req.headers.get("cookie") || "";

  try {
    const backendUrl = `${BACKEND_URL}/api/auth/me`;

    const controller = new AbortController();
    const timeoutMs = Number(process.env.AUTH_PROXY_TIMEOUT_MS || "8000");
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const backendRes = await fetch(backendUrl, {
      method: "GET",
      headers: {
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
      },
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    const data = await safeReadJson(backendRes);

    if (!backendRes.ok) {
      const message = (data as { message?: unknown } | undefined)?.message;
      return jsonError(
        typeof message === "string" ? message : "Failed to fetch user",
        backendRes.status,
        data
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return jsonError(
      "Network error while contacting backend.",
      502,
      {
        backendUrl: `${BACKEND_URL}/api/auth/me`,
        error: err instanceof Error ? err.message : err,
      }
    );
  }
}


