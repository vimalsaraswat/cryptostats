import { BackButton } from "@/components/button";
import { getUserData, getUserTokens } from "@/lib/supabase";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurPrice } from "@/app/coin";
import { currencyFormat } from "@/helpers";

export default async function Page({ searchParams }) {
  const { coinId, price, quantity } = searchParams;
  const amount = price * quantity;

  const newPrice = await getCurPrice(coinId);

  const results = await Promise.allSettled([getUserData(), getUserTokens()]);
  const [userData, tokens] = results.map((res) => res.value);

  if (amount > 0 && userData.cash < amount)
    return redirect("/home/buy?message=Not have sufficient cash balance");

  if (amount < 0) {
    if (!tokens.get(coinId) || tokens.get(coinId) < Math.abs(quantity)) {
      return redirect(
        `/home/sell?message=Not have sufficient ${coinId} tokens`,
      );
    }
  }

  const handleTransaction = async () => {
    "use server";
    const supabase = await createClient();
    const user = (await supabase.auth.getUser()).data.user;

    // Update user's cash
    const updatedCash = userData.cash - amount;
    const { data: cashUpdated, error: cashUpdateError } = await supabase
      .from("user_data")
      .update({ cash: updatedCash })
      .eq("user_id", user.id)
      .select();

    // create transaction if cash is updated
    const { data: transaction, error } = await supabase
      .from("transactions")
      .insert([
        {
          user_id: user.id,
          coinId: coinId,
          quantity: quantity,
          price: price,
        },
      ])
      .select();
    console.log({ amount });
    console.log(cashUpdated, transaction);

    revalidatePath("/home");
    return redirect("/home");
  };

  if (!(coinId && price && quantity && newPrice && newPrice === price))
    return (
      <p>
        Invalid data
        <br />
        Please try again.
        <BackButton />
      </p>
    );

  return (
    <section>
      <div>
        Please confirm that you want to {quantity > 0 ? "buy" : "sell"} {coinId}
        {Math.abs(quantity)} for {currencyFormat(Math.abs(amount))}.
        <form
          className="flex flex-col justify-center"
          action={handleTransaction}
        >
          <button
            type="submit"
            className="mt-5 rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Confirm Payment
          </button>
        </form>
      </div>
    </section>
  );
}
