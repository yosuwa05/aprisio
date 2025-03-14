import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const response = NextResponse.next();

  if (req.headers.get("origin") === "https://secure.payu.in") {
    response.headers.set(
      "Access-Control-Allow-Origin",
      "https://secure.payu.in"
    );
    response.headers.set("Vary", "Origin");
  }

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
