import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request) {
  return await updateSession(request);
}

export const config = {
  matcher: ["/home/:path*", "/auth/:path*"],
};
