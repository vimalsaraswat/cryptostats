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
        <Hero
          price={price}
          symbol={coinData.symbol}
          priceChange24h={coinData.market_data.price_change_percentage_24h}
          high24h={coinData.market_data.high_24h.usd}
          low24h={coinData.market_data.low_24h.usd}
        />
        <TokenChart coinId={coin} />
      </main>
    );
}

function Hero({ price, symbol, priceChange24h, high24h, low24h }) {
  return (
    <section className="w-11/12 flex justify-between">
      <div className="w-4/10">
        <span className="text-4xl">{currencyFormat(price)}</span>
        <div className="flex gap-2">
          <h2>{symbol.toUpperCase()}</h2>
          <span
            className={`text-2xl ${
              priceChange24h > 0 ? "text-[#00ff00]" : "text-[#ff00ff]"
            }`}
          >
            {priceChange24h}%
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 justify-between">
        <span>
          <p className="text-xs opacity-60">24h High</p>
          {currencyFormat(high24h)}
        </span>
        <span>
          <p className="text-xs opacity-60">24h Low</p>
          {currencyFormat(low24h)}
        </span>
      </div>
    </section>
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

function AboutToken(coinData) {
  return (
    <section id="about">
      <p>{coinData.description.en}</p>
      <table>
        <tr>
          <td>Circulating Supply:</td>
          <td>{coinData.market_data.circulating_supply}</td>
        </tr>
        <tr>
          <td>Total Supply:</td>
          <td>{coinData.market_data.total_supply}</td>
        </tr>
        <tr>
          <td>All-Time High Price:</td>
          <td>{currencyFormat(coinData.market_data.ath.usd)}</td>
        </tr>
        <tr>
          <td>All-Time Low Price:</td>
          <td>{currencyFormat(coinData.market_data.atl.usd)}</td>
        </tr>
        <tr>
          <td>Market Cap:</td>
          <td>{currencyFormat(coinData.market_data.market_cap.usd)}</td>
        </tr>
      </table>
    </section>
  );
}
