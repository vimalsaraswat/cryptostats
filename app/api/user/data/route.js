import { initSupabase } from "@/utils/supabase";
import { NextResponse } from "next/server";

export async function GET(req) {
  const supabase = await initSupabase(req);

  let { data: user_data, error: userDataError } = await supabase
    .from("user_data")
    .select("*");

  let { data: transactions, error: transactionsError } = await supabase
    .from("transactions")
    .select("coinId,quantity");

  // Creating list of token-names and their respective total quantities
  if (transactions) {
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
