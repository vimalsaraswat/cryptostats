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

  if (loading) return <Loading type="large" />;
  else if (error)
    return (
      <>
        Something went wrong,
        <br />
        Try refreshing after some time.
      </>
    );
  else
    return (
      <div className="my-2 w-full h-full overflow-auto">
        <h2 className="mb-4 w-fit mx-auto text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 md:text-5xl lg:text-6xl">
          Trending
        </h2>
        <table className="w-fit h-fit py-4 mx-auto overflow-auto bg-gray-200 dark:bg-gray-800 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-opacity-75 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Token</th>
              <th className="px-6 py-3">Symbol</th>
              <th className="px-6 py-3">Price</th>
            </tr>
          </thead>
          <tbody>
            {trendingCoins.map((coin, i) => {
              return (
                <tr key={i}>
                  <td className="px-6 py-4 font-medium">
                    <Link
                      className="flex gap-2 items-center"
                      href={`/coin/${coin.item.id}`}
                    >
                      <img
                        className="h-10 w-10 rounded"
                        src={coin.item.small}
                        alt={`${coin.item.name}`}
                      />
                      <div className="">
                        <span className="block truncate text-gray-900 dark:text-white">
                          {coin.item.name}
                        </span>
                        <span className="text-xs">
                          Rank: {coin.item.market_cap_rank}
                        </span>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">{coin.item.symbol}</td>
                  <td className="px-6 py-4">
                    {currencyFormat(btcExchangeRate * coin.item.price_btc)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
}
