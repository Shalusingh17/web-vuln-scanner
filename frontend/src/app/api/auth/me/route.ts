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

export async function GET(req: NextRequest) {
  if (!BACKEND_URL) {
    return jsonError(
      "Configuration error: BACKEND_URL is missing.",
      500,
      { hint: "Set BACKEND_URL to your backend origin, e.g. http://localhost:5000" }
    );
  }

  const cookieHeader = req.headers.get("cookie") || "";

  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
      },
    });

    const text = await backendRes.text();
    let data: unknown;

    try {
      data = JSON.parse(text);
    } catch {
      data = { message: "Backend returned non-JSON response", raw: text };
    }

    if (!backendRes.ok) {
      return jsonError(data?.message || "Failed to fetch user", backendRes.status, data);
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return jsonError("Network error while contacting backend.", 502, err);
  }
}

