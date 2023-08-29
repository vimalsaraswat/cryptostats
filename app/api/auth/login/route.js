import { initSupabase } from "@/utils/supabase";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  const supabase = await initSupabase(req);
  const nextCookies = cookies();
  const { email, password } = await req.json();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (data) {
    // Setting auth session cookies
    nextCookies.set("my-refresh-token", data.session.refresh_token);
    nextCookies.set("my-access-token", data.session.access_token);

    return NextResponse.json(
      { message: `Logged in successfully` },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      { message: `Unable to login` },
      {
        status: 400,
      }
    );
  }
}
