import { initSupabase, getUser } from "@/utils/supabase";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req) {
  const supabase = await initSupabase(req);
  const { coinId, price, quantity } = await req.json();
  const amount = price * quantity;

  const userId = (await getUser(req)).id;

  let { data: cash } = await supabase.from("user_data").select("cash");
  let { data: transactions } = await supabase
    .from("transactions")
    .select("coinId,quantity");

  if (!transactions) {
    return NextResponse.json(
      { message: `Insufficient token balance!` },
      { status: 400 },
    );
  }

  // Creating map of coinIds and their respective total quantities
  const tokens = new Map();
  transactions.forEach((item) => {
    const existingQuantity = tokens.get(item.coinId) || 0;
    tokens.set(item.coinId, existingQuantity + item.quantity);
  });

  // Getting the available quantity of token to be sold
  let quantityAvailable = 0;
  if (tokens.has(coinId)) {
    quantityAvailable = tokens.get(coinId);
  }

  if (quantityAvailable < quantity) {
    return NextResponse.json(
      { message: `Insufficient token balance!` },
      { status: 400 },
    );
  }

  // Update user's cash balance
  const updatedCash = cash[0].cash + amount;
  const { data: cashUpdated, error: cashUpdateError } = await supabase
    .from("user_data")
    .update({ cash: updatedCash })
    .eq("user_id", userId)
    .select();

  if (!cashUpdated) {
    return NextResponse.json(
      { message: `Transaction Failed!` },
      { status: 400 },
    );
  }

  // Create transaction
  const { data: transaction, error } = await supabase
    .from("transactions")
    .insert([
      {
        user_id: userId,
        coinId: coinId,
        quantity: -1 * quantity,
        price: price,
      },
    ])
    .select();

  if (transaction) {
    revalidatePath("/");
    return NextResponse.json(
      { message: `Transaction Successful!` },
      { status: 200 },
    );
  } else {
    return NextResponse.json(
      { message: `Transaction Failed!` },
      {
        status: 400,
      },
    );
  }
}
