"use client";

import { useState, useEffect } from "react";
import { getCurPrice, getCoinData, getCoinChartData } from "@/app/coin";
import PriceChart from "@/components/priceChart";

export default function first({ params }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [price, setPrice] = useState(null);
  const [coinData, setCoinData] = useState({});
  const coin = params.coinId;

  useEffect(() => {
    Promise.all([
      getCurPrice(coin).then((value) => setPrice(value)),
      getCoinData(coin).then((value) => setCoinData(JSON.parse(value))),
    ])
      .catch((error) => {
        console.error(error);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <main>Loading....</main>;
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
      <main className=" grid gap-4 place-items-center">
        <section className="w-11/12">
          <div className="flex justify-between">
            <h2>{coinData.name}</h2>
            <div className=" w-1/3 flex justify-between">
              <span>{currencyFormat(price)}</span>

              <span>{coinData.market_data.price_change_percentage_24h}</span>
            </div>
          </div>
          <div className="flex justify-between">
            <h3>{coinData.symbol.toUpperCase()}</h3>
            <div className=" w-1/3 flex justify-between">
              <span>
                <p className="text-xs opacity-60">24h High</p>
                {currencyFormat(coinData.market_data.high_24h.usd)}
              </span>
              <span>
                <p className="text-xs opacity-60">24h Low</p>
                {currencyFormat(coinData.market_data.low_24h.usd)}
              </span>
            </div>
          </div>
          <TokenChart coinId={coin} />
        </section>
      </main>
    );
}

function currencyFormat(value) {
  if (value >= 0) {
    let USDollar = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
    return USDollar.format(value);
  } else {
    return (
      "$" +
      value
        .toFixed(20)
        .toString()
        .replace(/\.?0+$/, "")
    );
  }
}

function TokenChart({ coinId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [chartData, setChartData] = useState();

  useEffect(() => {
    getCoinChartData(coinId)
      .then((value) => setChartData(value))
      .catch((error) => {
        console.error(error);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <main>Loading....</main>;
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
      <div>
        <h2 className="sr-only">Token Price Chart</h2>
        <PriceChart data={chartData} />
      </div>
    );
}
