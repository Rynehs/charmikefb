import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const LARAVEL_URL = process.env.LARAVEL_API_URL;

const LOGIN_PATHS: Record<string, string> = {
  admin: "/admin/login",
  agent: "/agent/login",
  client: "/client/login",
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { role, phone, password } = body;

  if (!role || !LOGIN_PATHS[role]) {
    return NextResponse.json(
      { success: false, message: "Invalid role" },
      { status: 400 }
    );
  }

  let laravelRes: Response;
  try {
    laravelRes = await fetch(`${LARAVEL_URL}${LOGIN_PATHS[role]}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ phone, password }),
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Could not reach the API. Is Laravel running?" },
      { status: 502 }
    );
  }

  const data = await laravelRes.json();

  if (!laravelRes.ok) {
    return NextResponse.json(data, { status: laravelRes.status });
  }

  const token = data?.data?.token;
  const user = data?.data?.user;

  if (!token || !user) {
    return NextResponse.json(
      { success: false, message: "Unexpected response shape from API" },
      { status: 502 }
    );
  }

  const cookieStore = cookies();
  const isProd = process.env.NODE_ENV === "production";
  const maxAge = 60 * 60 * 24 * 7; // 7 days

  cookieStore.set("cm_token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  cookieStore.set("cm_session", JSON.stringify({ user, role }), {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  return NextResponse.json({ success: true, user, role });
}
