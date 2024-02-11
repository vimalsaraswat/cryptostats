import { initSupabase, getUser } from "@/utils/supabase";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req) {
  const supabase = await initSupabase(req);
  const { coinId, price, quantity } = await req.json();
  const amount = price * quantity;

  const userId = (await getUser(req)).id;
  let { data: cash } = await supabase.from("user_data").select("cash");

  if (cash[0].cash < amount) {
    return NextResponse.json(
      { message: `Insufficient cash balance!` },
      {
        status: 400,
      },
    );
  }

  // Update user's cash
  const updatedCash = cash[0].cash - amount;
  const { data: cashUpdated, error: cashUpdateError } = await supabase
    .from("user_data")
    .update({ cash: updatedCash })
    .eq("user_id", userId)
    .select();

  if (!cashUpdated) {
    return NextResponse.json(
      { message: `Transaction Failed!` },
      {
        status: 400,
      },
    );
  }

  // create transaction if cash is updated
  const { data: transaction, error } = await supabase
    .from("transactions")
    .insert([
      {
        user_id: userId,
        coinId: coinId,
        quantity: quantity,
        price: price,
      },
    ])
    .select();

  if (!transaction) {
    return NextResponse.json(
      { message: `Transaction Failed!` },
      {
        status: 400,
      },
    );
  }

  revalidatePath("/");
  return NextResponse.json(
    { message: `Transaction Successful!` },
    { status: 200 },
  );
}
