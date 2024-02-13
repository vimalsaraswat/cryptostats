import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { currencyFormat } from "@/helpers";
import { TokensTable } from "@/components/table";

async function getUserDataAndTransactions() {
  const supabase = createClient();

  const results = await Promise.allSettled([
    supabase.from("user_data").select("*"),
    supabase.from("transactions").select("coinId,quantity"),
  ]);

  const errors = results.filter((res) => res.status !== "fulfilled");

  if (errors.length > 0) {
    return null;
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

export default async function Home() {
  const [user_data, transactions] = await getUserDataAndTransactions();
  const tokens = processTransactions(transactions);
  const userData = user_data[0];
  const cash = userData.cash;
  console.log(userData);

  return (
    <div className="h-full w-full grow overflow-y-scroll">
      <section
        id="hero"
        className="m-4 flex items-center justify-center space-x-4"
      >
        <img
          className="h-10 w-10 rounded-full"
          src="https://source.boringavatars.com/"
          alt=""
        />
        <div className="font-medium dark:text-white">
          <h2 className="text-xl md:text-2xl">{userData.username}</h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {currencyFormat(cash)}
          </div>
        </div>
      </section>
      {tokens.length > 0 ? (
        <TokensTable tokens={tokens} />
      ) : (
        <NoTokens cash={cash} />
      )}
    </div>
  );
}

function NoTokens({ cash }) {
  return (
    <div className="text-center text-2xl">
      You don't have any tokens, you can{" "}
      <Link className="text-sky-400 underline" href="/home/buy">
        buy
      </Link>{" "}
      some now using your {currencyFormat(cash)} cash.
    </div>
  );
}
