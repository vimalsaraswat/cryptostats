import { initSupabase } from "@/utils/supabase";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(request) {
  const supabase = await initSupabase(request);

  const results = await Promise.allSettled([
    supabase.from("user_data").select("*"),
    supabase.from("transactions").select("coinId,quantity"),
  ]);

  results.forEach((res) => {
    if (!res.status === "fulfilled") {
      return NextResponse.json(
        { message: `Unable to get user data!` },
        { status: 400 }
      );
    }
  });

  const user_data = results[0].value.data;
  const transactions = results[1].value.data;

  const tokens = Object.values(
    transactions.reduce((acc, item) => {
      const { coinId, quantity } = item;
      acc[coinId] = acc[coinId] || { coinId, quantity: 0 };
      acc[coinId].quantity += quantity;
      return acc;
    }, {})
  ).filter((item) => item.quantity !== 0);

  return NextResponse.json(
    { data: { user_data: user_data[0], tokens: tokens } },
    { status: 200 }
  );
}
