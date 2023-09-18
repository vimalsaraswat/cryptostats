import { NextResponse } from "next/server";
import { getUser } from "./utils/supabase";

export default async function middleware(request) {
  const user = await getUser(request);
  const url = request.nextUrl.pathname;

  if (user) {
    if (url.startsWith("/auth/login") || url.startsWith("/auth/register")) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  } else if (!user) {
    if (url.startsWith("/home") || url.startsWith("/auth/logout"))
      return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: ["/home/:path*", "/auth/:path*"],
};
