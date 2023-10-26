"use client";

import { useState, useEffect } from "react";
import { currencyFormat } from "@/helpers";
import { getCurPrice, getCoinData, getCoinChartData } from "@/app/coin";
import PriceChart from "@/components/ui/priceChart";
import Loading from "@/components/loading";

export default function Coin({ params }) {
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

  if (loading) return <Loading type="large" />;
  else if (error)
    return (
      <p>
        Something went wrong,
        <br />
        Try refreshing after some time.
      </p>
    );

  return (
    <>
      {price ? (
        <div className="my-2 h-full w-full overflow-auto">
          <div className="my-4 flex items-end justify-center">
            <img
              className="h-20 w-20 rounded-full p-1 ring-2 ring-gray-300 dark:ring-gray-500"
              src={coinData.image.small}
              alt={`${coinData.name}'s image`}
            />
            <h2 className="p-4 text-center text-4xl font-bold tracking-wider text-stone-600 dark:text-stone-200">
              {coinData.name}
            </h2>
          </div>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="md:min-w-2xl flex flex-col gap-4 md:w-3/4">
              <Hero
                price={price}
                symbol={coinData.symbol}
                priceChange24h={
                  coinData.market_data.price_change_percentage_24h
                }
                high24h={coinData.market_data.high_24h.usd}
                low24h={coinData.market_data.low_24h.usd}
              />
              <TokenChart coinId={coin} />
            </div>
            <div>
              <AboutToken coinData={coinData} />
            </div>
          </div>
        </div>
      ) : (
        <p className="text-2xl">Coin does't Exist!</p>
      )}
    </>
  );
}

function Hero({ price, symbol, priceChange24h, high24h, low24h }) {
  return (
    <section className="mx-auto flex w-11/12 justify-between">
      <div className="w-4/10">
        <span className="text-4xl">{currencyFormat(price)}</span>
        <div className="flex gap-2">
          <h2>{symbol.toUpperCase()}</h2>
          <span
            className={`text-2xl ${
              priceChange24h > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {priceChange24h}%
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-2">
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

  if (loading) return <Loading />;
  else if (error)
    return (
      <p>
        Something went wrong,
        <br />
        Try refreshing after some time.
      </p>
    );

  return (
    <div className="mx-auto w-full">
      <h3 className="sr-only">Token Price Chart</h3>
      <div className="mx-auto w-fit">
        <PriceChart data={chartData} />
      </div>
    </div>
  );
}

function AboutToken({ coinData }) {
  const [descOpen, setDescOpen] = useState(false);

  return (
    <section id="about" className="mx-auto flex w-11/12 flex-col gap-4">
      <h4 className="tracking-wide text-gray-500 underline underline-offset-2 dark:text-gray-400 md:text-lg">
        Info:
      </h4>
      <p
        onClick={() => (descOpen ? "" : setDescOpen(true))}
        className={(descOpen ? "" : "line-clamp-3") + " md:max-w-2xl"}
      >
        {coinData.description.en}
      </p>

      <ul>
        <li className="flex justify-between">
          <span>Circulating Supply:</span>
          <span>{coinData.market_data.circulating_supply}</span>
        </li>
        <li className="flex justify-between">
          <span>Total Supply:</span>
          <span>{coinData.market_data.total_supply}</span>
        </li>
        <li className="flex justify-between">
          <span>All-Time High Price:</span>
          <span>{currencyFormat(coinData.market_data.ath.usd)}</span>
        </li>
        <li className="flex justify-between">
          <span>All-Time Low Price:</span>
          <span>{currencyFormat(coinData.market_data.atl.usd)}</span>
        </li>
        <li className="flex justify-between">
          <span>Market Cap:</span>
          <span>{currencyFormat(coinData.market_data.market_cap.usd)}</span>
        </li>
      </ul>
    </section>
  );
}
