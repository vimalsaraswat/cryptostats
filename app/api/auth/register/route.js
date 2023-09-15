import { initSupabase } from "@/utils/supabase";
import { NextResponse } from "next/server";

export async function POST(req) {
  const supabase = await initSupabase(req);

  const { username, email, password } = await req.json();

  // Regiter a new user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (user) {
    // Set user's data in "user_data" table
    const { userData, error } = await supabase
      .from("user_data")
      .insert([{ user_id: user.id, username: username }])
      .select();

    if (userData) {
      return NextResponse.json(
        { message: `User registered successfully!` },
        { status: 200 }
      );
    }
  } else {
    return NextResponse.json(
      { message: `Unable to register nw user!` },
      {
        status: 400,
      }
    );
  }
}
