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

function getCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";

  // Default to `lax` for same-site deployments.
  // If you host Next and backend on different domains and need cookie auth,
  // set AUTH_COOKIE_SAME_SITE=none and ensure you run over HTTPS.
  const sameSite = (process.env.AUTH_COOKIE_SAME_SITE || "lax") as
    | "lax"
    | "strict"
    | "none";

  const secure =
    isProd ||
    sameSite === "none" ||
    (process.env.AUTH_COOKIE_SECURE || "").toLowerCase() === "true";

  return {
    httpOnly: true,
    secure,
    sameSite,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  };
}

export async function POST(req: NextRequest) {
  if (!BACKEND_URL) {
    return jsonError(
      "Configuration error: BACKEND_URL is missing.",
      500,
      {
        hint: "Set BACKEND_URL / NEXT_PUBLIC_BACKEND_URL to your backend origin, e.g. http://localhost:5000",
      }
    );
  }

  try {
    const body = await req.json();

    const controller = new AbortController();
    const timeoutMs = Number(process.env.AUTH_PROXY_TIMEOUT_MS || "8000");
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const backendUrl = `${BACKEND_URL}/api/auth/login`;

    let backendRes: Response;
    try {
      backendRes = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (err) {
      const name = (err as { name?: string } | undefined)?.name;
      const code = (err as { code?: string } | undefined)?.code;

      if (name === "AbortError") {
        return jsonError(
          "Backend request timed out.",
          504,
          { backendUrl, timeoutMs }
        );
      }

      if (code === "ECONNREFUSED" || code === "ENOTFOUND") {
        return jsonError(
          "Backend is unreachable (connection refused/DNS failure).",
          502,
          { backendUrl, code }
        );
      }

      return jsonError(
        "Network error while contacting backend.",
        502,
        { backendUrl, code }
      );
    } finally {
      clearTimeout(timeout);
    }

    const data = await safeReadJson(backendRes);

    if (!backendRes.ok) {
      return jsonError(
        data?.message || "Authentication failed",
        backendRes.status,
        data
      );
    }

    const token = (data as { token?: string } | undefined)?.token;
    if (!token) {
      return jsonError(
        "Backend login succeeded but did not return a token.",
        502,
        { backendResponse: data }
      );
    }

    const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    );

    response.cookies.set("auth-token", token, getCookieOptions());

    return response;
  } catch (error: unknown) {
    console.error("[Login Route Error]:", error);

    return jsonError(
      "Login route failed.",
      500,
      {
        name:
          typeof (error as { name?: unknown } | null | undefined)?.name ===
          "string"
            ? (error as { name?: string }).name
            : undefined,
        message:
          typeof (error as { message?: unknown } | null | undefined)?.message ===
          "string"
            ? (error as { message?: string }).message
            : undefined,
      }
    );
  }
}


