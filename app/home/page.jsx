"use client";

import { useContext } from "react";
import useSWR from "swr";
import Link from "next/link";
import { currencyFormat } from "@/helpers";
import Loading from "@/components/loading";
import { UserDataContext } from "@/utils/UserContext";

export default function Home() {
  const userData = useContext(UserDataContext);
  return (
    <div className="w-full h-full">
      <section
        id="hero"
        className="flex items-center justify-center space-x-4 m-4"
      >
        <img
          className="w-10 h-10 rounded-full"
          src="https://source.boringavatars.com/"
          alt=""
        />
        <div className="font-medium dark:text-white">
          <h2 className="text-xl md:text-2xl">{userData.user_data.username}</h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {currencyFormat(userData.user_data.cash)}
          </div>
        </div>
      </section>
      <Tokens tokens={userData.tokens} />
    </div>
  );
}

function Tokens({ tokens }) {
  let ids = "";
  tokens.forEach((item, i) =>
    i === 0 ? (ids += item.coinId) : (ids += `%2C${item.coinId}`)
  );
  const { data, error, isLoading } = useSWR(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
    (...args) => fetch(...args).then((res) => res.json())
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
    <section
      id="user-owned-tokens"
      className="relative max-w-fit h-full mx-auto overflow-auto"
    >
      <h3 className="sr-only">Your Tokens:</h3>
      <table className="h-fit w-fit bg-gray-200 dark:bg-gray-800 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-opacity-75 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Token Name
            </th>
            <th scope="col" className="px-6 py-3 hidden sm:block">
              Current Price
            </th>
            <th scope="col" className="px-6 py-3">
              Quantity
            </th>
            <th scope="col" className="px-6 py-3 hidden sm:block">
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
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
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
                  } px-6 py-4 hidden sm:block`}
                >
                  {currencyFormat(token.price)}
                </td>
                <td className="px-6 py-4">{token.quantity}</td>
                <td className="px-6 py-4 hidden sm:block">
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
