import { initSupabase, getUser } from "@/utils/supabase";
import { NextResponse } from "next/server";

export async function POST(req) {
  const supabase = await initSupabase(req);
  const { coinId, price, quantity } = await req.json();
  const amount = price * quantity;

  const userId = (await getUser(req)).id;

  let { data: cash } = await supabase.from("user_data").select("cash");

  if (cash[0].cash > amount) {
    // Update user's cash if cash > amount
    const updatedCash = cash[0].cash - amount;
    const { data: cashUpdated, error: cashUpdateError } = await supabase
      .from("user_data")
      .update({ cash: updatedCash })
      .eq("user_id", userId)
      .select();

    if (cashUpdated) {
      // create transaction if cash is updated
      const { data, error } = await supabase
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
      if (!error) {
        return NextResponse.json(
          { message: `Transaction Successful!` },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: `Transaction Failed!` },
          {
            status: 400,
          }
        );
      }
    } else {
      return NextResponse.json(
        { message: `Transaction Failed!` },
        {
          status: 400,
        }
      );
    }
  } else {
    console.log("!!cash > amount");
    return NextResponse.json(
      { message: `Insufficient cash balance!` },
      {
        status: 400,
      }
    );
  }
}
