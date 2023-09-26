import { initSupabase } from "@/utils/supabase";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const revalidate = 0;

export async function GET(req) {
  const nextCookies = cookies();
  const supabase = await initSupabase(req, nextCookies);

  let { data: transactions, error } = await supabase
    .from("transactions")
    .select("*");

  if (transactions) {
    return NextResponse.json(
      { message: `Logged in successfully`, data: transactions },
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
