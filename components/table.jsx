"use client";

import useSWR from "swr";
import Link from "next/link";
import { currencyFormat } from "@/helpers";
import Loading from "@/components/loading";

function TokensTable({ tokens }) {
  let ids = "";
  tokens.forEach((item, i) =>
    i === 0 ? (ids += item.coinId) : (ids += `%2C${item.coinId}`),
  );
  const { data, error, isLoading } = useSWR(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
    (...args) => fetch(...args).then((res) => res.json()),
  );

  if (error)
    return (
      <div>
        <p>
          Something went wrong,
          <br />
          Try refreshing after some time.
        </p>
      </div>
    );
  if (isLoading)
    return (
      <div className="flex h-full items-center justify-center">
        <Loading type="large" />
      </div>
    );

  const userTokens = tokens.map((token) => {
    const coinId = token.coinId;
    const price = data[coinId].usd;
    return {
      id: coinId,
      price: price,
      quantity: token.quantity,
      value: price * token.quantity,
      usd_24h_change: data[coinId].usd_24h_change,
    };
  });

  return (
    <section className="my-2 h-full w-full">
      <h3 className="sr-only">Your Tokens:</h3>
      <table className="mx-auto w-fit rounded-md bg-gray-200 bg-opacity-40 bg-clip-padding py-4 text-left text-sm text-gray-500 backdrop-blur-sm backdrop-filter dark:bg-gray-800 dark:text-gray-400">
        <thead className="bg-gray-50 bg-opacity-75 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Token Name
            </th>
            <th scope="col" className="hidden px-6 py-3 sm:block">
              Current Price
            </th>
            <th scope="col" className="px-6 py-3">
              Quantity
            </th>
            <th scope="col" className="hidden px-6 py-3 sm:block">
              Value Now
            </th>
          </tr>
        </thead>
        <tbody>
          {userTokens.map((token, i) => {
            return (
              <tr key={i}>
                <th
                  scope="row"
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                >
                  <Link href={`/coin/${token.id}`}>
                    {token.id.toUpperCase()}
                  </Link>
                </th>

                <td
                  className={`${
                    token.usd_24h_change > 0
                      ? "text-emerald-400"
                      : "text-red-400"
                  } hidden px-6 py-4 text-right sm:block`}
                >
                  {currencyFormat(token.price)}
                </td>
                <td className="px-6 py-4 text-right">{token.quantity}</td>
                <td className="hidden px-6 py-4 text-right sm:block">
                  {currencyFormat(token.value)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

export { TokensTable };
