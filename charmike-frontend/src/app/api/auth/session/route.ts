import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("cm_session")?.value;

  if (!sessionCookie) {
    return NextResponse.json({ user: null, role: null }, { status: 401 });
  }

  try {
    const session = JSON.parse(sessionCookie);
    return NextResponse.json(session);
  } catch {
    return NextResponse.json({ user: null, role: null }, { status: 401 });
  }
}
