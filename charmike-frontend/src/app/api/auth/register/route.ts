import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const LARAVEL_URL = process.env.LARAVEL_API_URL;

export async function POST(req: NextRequest) {
  const body = await req.json();

  let laravelRes: Response;
  try {
    laravelRes = await fetch(`${LARAVEL_URL}/client/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch {
    return NextResponse.json(
      { message: "Could not reach the API. Is Laravel running?" },
      { status: 502 }
    );
  }

  const data = await laravelRes.json();

  if (!laravelRes.ok) {
    // Laravel's default validation error shape: { message, errors: {field: [..]} }
    return NextResponse.json(data, { status: laravelRes.status });
  }

  const token = data?.data?.token;
  const user = data?.data?.user;

  if (!token || !user) {
    return NextResponse.json(
      { message: "Unexpected response shape from API" },
      { status: 502 }
    );
  }

  const cookieStore = cookies();
  const isProd = process.env.NODE_ENV === "production";
  const maxAge = 60 * 60 * 24 * 7;

  cookieStore.set("cm_token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  cookieStore.set("cm_session", JSON.stringify({ user, role: "client" }), {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  return NextResponse.json({ success: true, user, role: "client" });
}
