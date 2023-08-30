import { NextResponse } from "next/server";
import { getUser } from "./utils/supabase";

export default async function middleware(request) {
  const user = await getUser(request);

  if (user) {
    if (request.nextUrl.pathname.startsWith("/auth/login")) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  } else if (!user) {
    if (
      request.nextUrl.pathname.startsWith("/home") ||
      request.nextUrl.pathname.startsWith("/auth/logout")
    )
      return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: ["/home/:path*", "/auth/:path*"],
};
