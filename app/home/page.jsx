import Link from "next/link";
import { currencyFormat } from "@/helpers";
import { TokensTable } from "@/components/table";
import { getUserData, getUserTokens } from "@/lib/supabase";

async function getUserDataAndTransactions() {
  const results = await Promise.allSettled([getUserData(), getUserTokens()]);
  const errors = results.filter((res) => res.status !== "fulfilled");

  if (errors.length > 0) {
    return null;
  }
  return results.map((res) => res.value);
}

export default async function Home() {
  const [userData, tokens] = await getUserDataAndTransactions();
  const cash = userData.cash;

  const filteredTokens = Array.from(tokens, ([key, value]) => {
    return { coinId: key, quantity: value };
  }).filter((item) => item.quantity !== 0);

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
      {filteredTokens.length > 0 ? (
        <TokensTable tokens={filteredTokens} />
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
