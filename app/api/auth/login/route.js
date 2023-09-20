import { initSupabase } from "@/utils/supabase";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  const supabase = await initSupabase(req);
  const nextCookies = cookies();
  const { email, password } = await req.json();

  // Signing user in
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (data.user) {
    // Setting auth session cookies
    nextCookies.set("my-refresh-token", data.session.refresh_token, {
      maxAge: 172800,
    });
    nextCookies.set("my-access-token", data.session.access_token, {
      maxAge: 172800,
    });

    return NextResponse.json(
      { message: `Logged in successfully!` },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      { message: `Incorrect email or password!` },
      {
        status: 400,
      }
    );
  }
}
