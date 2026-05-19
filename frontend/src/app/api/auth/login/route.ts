import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";







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

export async function POST(req: NextRequest) {
  if (!BACKEND_URL) {
    return jsonError(
      "Configuration error: BACKEND_URL is missing.",
      500,
      { hint: "Set BACKEND_URL to your backend origin, e.g. http://localhost:5000" }
    );
  }

  try {
    const body = await req.json();

    const controller = new AbortController();
    const timeoutMs = 8000;
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    let backendRes: Response;
    try {
      backendRes = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (err) {
      const name = (err as { name?: string } | undefined)?.name;
      if (name === "AbortError") {
        return jsonError(
          "Backend request timed out.",
          504,
          { backendUrl: `${BACKEND_URL}/api/auth/login`, timeoutMs }
        );
      }

      const code = (err as { code?: string } | undefined)?.code;

      // Node-fetch/undici errors sometimes include a code
      if (code === "ECONNREFUSED") {
        return jsonError(
          "Backend is offline or connection was refused.",
          502,
          { backendUrl: `${BACKEND_URL}/api/auth/login`, code }
        );
      }

      return jsonError(
        "Network error while contacting backend.",
        502,
        { backendUrl: `${BACKEND_URL}/api/auth/login`, code }
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

    // Expect backend to return { token, ... }
    const token = data?.token;

    if (!token) {
      return jsonError(
        "Backend login succeeded but did not return a token.",
        502,
        { backendResponse: data }
      );
    }

    const response = NextResponse.json({ message: "Login successful" }, { status: 200 });

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("[Login Route Error]:", error);

    // If request body isn't valid JSON, Next will throw; keep consistent shape.
    return jsonError(
      "Login route failed.",
      500,
      {
        name:
          typeof (error as { name?: unknown } | null | undefined)?.name === "string"
            ? (error as { name?: string }).name
            : undefined,
        message:
          typeof (error as { message?: unknown } | null | undefined)?.message === "string"
            ? (error as { message?: string }).message
            : undefined,
      }
    );
  }
}

