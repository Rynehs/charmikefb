import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const LARAVEL_URL = process.env.LARAVEL_API_URL;

export async function POST() {
  const cookieStore = cookies();
  const token = cookieStore.get("cm_token")?.value;

  if (token) {
    try {
      await fetch(`${LARAVEL_URL}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
    } catch {
      // Ignore network errors on logout — clear cookies regardless
    }
  }

  cookieStore.delete("cm_token");
  cookieStore.delete("cm_session");

  return NextResponse.json({ success: true });
}
