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
      backendRes = await fetch(`${BACKEND_URL}/api/auth/register`, {
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
          { backendUrl: `${BACKEND_URL}/api/auth/register`, timeoutMs }
        );
      }

      const code = (err as { code?: string } | undefined)?.code;
      if (code === "ECONNREFUSED") {
        return jsonError(
          "Backend is offline or connection was refused.",
          502,
          { backendUrl: `${BACKEND_URL}/api/auth/register`, code }
        );
      }

      return jsonError(
        "Network error while contacting backend.",
        502,
        { backendUrl: `${BACKEND_URL}/api/auth/register`, code }
      );
    } finally {
      clearTimeout(timeout);
    }

    const data = await safeReadJson(backendRes);

    if (!backendRes.ok) {
      return jsonError(
        data?.message || "Registration failed",
        backendRes.status,
        data
      );
    }

    const token = data?.token;
    if (!token) {
      return jsonError(
        "Backend registration succeeded but did not return a token.",
        502,
        { backendResponse: data }
      );
    }

    const response = NextResponse.json({ message: "Register successful" }, { status: 200 });

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("[Register Route Error]:", error);
    return jsonError(
      "Register route failed.",
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

