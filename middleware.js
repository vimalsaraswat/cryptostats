import { NextResponse } from "next/server";

export default async function middleware(request) {
  let userLoggedIn = false;
  if (request.cookies.get("my-refresh-token")) {
    userLoggedIn = true;
  }
  const url = request.nextUrl.pathname;

  if (userLoggedIn) {
    if (url.startsWith("/auth/login") || url.startsWith("/auth/register")) {
      return NextResponse.rewrite(new URL("/home", request.url));
    }
  } else {
    if (url.startsWith("/home") || url.startsWith("/auth/logout"))
      return NextResponse.rewrite(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: ["/home/:path*", "/auth/:path*"],
};
