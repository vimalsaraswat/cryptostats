"use client";

import { useState, useEffect } from "react";
import { currencyFormat } from "@/helpers";
import { getCurPrice, getCoinData, getCoinChartData } from "@/app/coin";
import PriceChart from "@/components/priceChart";
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

  if (loading)
    return (
      <>
        <Loading type="large" />
        <span className="sr-only">Loading</span>
      </>
    );
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
      <>
        {price ? (
          <div className="h-full">
            <div className="my-4 flex items-end justify-center">
              <img
                class="w-20 h-20 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
                src={coinData.image.small}
                alt={`${coinData.name}'s image`}
              />
              <h2 className="text-4xl p-4 font-bold text-stone-200 tracking-wider text-center ">
                {coinData.name}
              </h2>
            </div>
            <div className="flex gap-4 flex-col md:flex-row">
              <div className="md:min-w-2xl md:w-3/4 flex flex-col gap-4">
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
    <section className="w-11/12 mx-auto flex justify-between">
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

  if (loading)
    return (
      <>
        <Loading />
        <span className="sr-only">Loading</span>
      </>
    );
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
      <div className="w-10/12 mx-auto">
        <h3 className="sr-only">Token Price Chart</h3>
        <div className="bg-[#c6edfb0a]">
          <PriceChart data={chartData} />
        </div>
      </div>
    );
}

function AboutToken({ coinData }) {
  const [descOpen, setDescOpen] = useState(false);
  return (
    <section id="about" className="w-11/12 mx-auto flex flex-col gap-4">
      <h4 className="tracking-wide text-gray-500 md:text-lg dark:text-gray-400 underline underline-offset-2">
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
