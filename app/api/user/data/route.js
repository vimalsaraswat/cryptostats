import { initSupabase } from "@/utils/supabase";
import { NextResponse } from "next/server";

// Revalidate user data every 10 seconds
export const revalidate = 10;

export async function GET(request) {
  const supabase = await initSupabase(request);

  let { data: user_data, error: userDataError } = await supabase
    .from("user_data")
    .select("*");

  let { data: transactions, error: transactionsError } = await supabase
    .from("transactions")
    .select("coinId,quantity");

  if (transactions) {
    // Creating list of token-names and their respective total quantities
    let tokens = Object.values(
      transactions.reduce((acc, item) => {
        acc[item.coinId] = acc[item.coinId]
          ? { ...item, quantity: item.quantity + acc[item.coinId].quantity }
          : item;
        return acc;
      }, {})
    );
    return NextResponse.json(
      { data: { user_data: user_data[0], tokens: tokens } },
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
