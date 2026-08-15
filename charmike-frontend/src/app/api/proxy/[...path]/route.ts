import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const LARAVEL_URL = process.env.LARAVEL_API_URL;

async function handler(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const cookieStore = cookies();
  const token = cookieStore.get("cm_token")?.value;

  const path = params.path.join("/");
  const search = req.nextUrl.search;
  const url = `${LARAVEL_URL}/${path}${search}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let body: string | undefined;
  const method = req.method;
  if (method !== "GET" && method !== "HEAD") {
    const text = await req.text();
    if (text) {
      body = text;
      headers["Content-Type"] =
        req.headers.get("content-type") || "application/json";
    }
  }

  let laravelRes: Response;
  try {
    laravelRes = await fetch(url, { method, headers, body });
  } catch {
    return NextResponse.json(
      { success: false, message: "Could not reach the API. Is Laravel running?" },
      { status: 502 }
    );
  }

  const contentType = laravelRes.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const data = await laravelRes.json();
    return NextResponse.json(data, { status: laravelRes.status });
  }

  const text = await laravelRes.text();
  return new NextResponse(text, { status: laravelRes.status });
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
