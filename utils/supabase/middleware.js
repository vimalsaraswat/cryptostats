import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export const createClient = (request) => {
  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          // If the cookie is updated, update the cookies for the request and response
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name, options) {
          // If the cookie is removed, update the cookies for the request and response
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    },
  );

  return { supabase, response };
};

export const updateSession = async (request) => {
  const { supabase, response } = createClient(request);
  const user = (await supabase.auth.getUser()).data.user;

  const url = request.nextUrl.pathname;

  if (user) {
    if (url.startsWith("/auth/login") || url.startsWith("/auth/register")) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  } else {
    if (url.startsWith("/home") || url.startsWith("/auth/logout"))
      return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return response;
};
