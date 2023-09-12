"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { btcExchangeRates } from "@/app/coin";
import { currencyFormat } from "@/helpers";
import getTrendingCoins from "./getTrendingCoins";
import Loading from "@/components/loading";

export default function Trending() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [btcExchangeRate, setbtcexchangeRate] = useState(0);
  const [trendingCoins, settrendingCoins] = useState([]);

  useEffect(() => {
    Promise.all([
      getTrendingCoins().then((value) =>
        settrendingCoins(JSON.parse(value).coins)
      ),
      btcExchangeRates().then((value) => setbtcexchangeRate(value)),
    ])
      .catch((error) => {
        console.error(error);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <>
        <Loading type="large" />
        <span className="sr-only">Loading</span>
      </>
    );
  else if (error)
    return (
      <main>
        Something went wrong,
        <br />
        Try refreshing after some time.
      </main>
    );
  else
    return (
      <>
        <h2 className="mb-4 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 md:text-5xl lg:text-6xl">
          Trending
        </h2>
        <table className="w-10/12 max-w-5xl mx-4 text-sm text-left text-gray-500 dark:text-gray-400 rounded-md">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Coins</th>
              <th className="px-6 py-3">Symbol</th>
              <th className="px-6 py-3">Price</th>
              <th className="hidden sm:block px-6 py-3">Market Cap Rank</th>
            </tr>
          </thead>
          <tbody className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
            {trendingCoins.map((coin, i) => {
              return (
                <tr
                  key={coin.item.coin_id}
                  className={
                    i % 2 === 0
                      ? "bg-white border-b dark:bg-gray-900 dark:border-gray-700"
                      : "border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                  }
                >
                  <td className="px-6 py-4 w-4/10 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <Link
                      className="flex gap-2 items-center"
                      href={`/coin/${coin.item.id}`}
                    >
                      <img
                        className="h-10 w-10 rounded"
                        src={coin.item.small}
                        alt={`${coin.item.name}`}
                      />
                      <span>{coin.item.name}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-4">{coin.item.symbol}</td>
                  <td className="px-6 py-4">
                    {currencyFormat(btcExchangeRate * coin.item.price_btc)}
                  </td>
                  <td className="hidden sm:block px-6 py-4">
                    {coin.item.market_cap_rank}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    );
}
