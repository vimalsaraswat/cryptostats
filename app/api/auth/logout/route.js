import { initSupabase } from "@/utils/supabase";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  const supabase = await initSupabase(req);
  const nextCookies = cookies();

  const { error } = await supabase.auth.signOut();

  if (!error) {
    // Deleting auth session cookies
    nextCookies.delete("my-refresh-token");
    nextCookies.delete("my-access-token");

    return NextResponse.json(
      { message: `Logged out successfully` },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      { message: `Unable to logout` },
      {
        status: 400,
      }
    );
  }
}
