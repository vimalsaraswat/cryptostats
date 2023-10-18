import { initSupabase } from "@/utils/supabase";
import { NextResponse } from "next/server";

const HTTP_STATUS_BAD_REQUEST = 400;
const HTTP_STATUS_OK = 200;

async function getUserDataAndTransactions(request) {
  const supabase = await initSupabase(request);

  const results = await Promise.allSettled([
    supabase.from("user_data").select("*"),
    supabase.from("transactions").select("coinId,quantity"),
  ]);

  const errors = results.filter((res) => res.status !== "fulfilled");

  if (errors.length > 0) {
    return NextResponse.json(
      { message: `Unable to get user data!` },
      { status: HTTP_STATUS_BAD_REQUEST },
    );
  }

  return results.map((res) => res.value.data);
}

function processTransactions(transactions) {
  const tokens = Object.values(
    transactions.reduce((acc, item) => {
      const { coinId, quantity } = item;
      acc[coinId] = acc[coinId] || { coinId, quantity: 0 };
      acc[coinId].quantity += quantity;
      return acc;
    }, {}),
  ).filter((item) => item.quantity !== 0);

  return tokens;
}

export const revalidate = 1;

export async function GET(request) {
  try {
    const [user_data, transactions] = await getUserDataAndTransactions(request);
    const tokens = processTransactions(transactions);

    return NextResponse.json(
      { data: { user_data: user_data[0], tokens: tokens } },
      { status: HTTP_STATUS_OK },
    );
  } catch (error) {
    console.error("Error processing data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
