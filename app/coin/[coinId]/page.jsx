import { getCurPrice, getCoinData, getCoinChartData } from "@/app/coin";
import PriceChart from "@/components/priceChart";

export default async function first({ params }) {
  const coin = params.coinId;
  const curPrice = await getCurPrice(coin);
  const coinData = JSON.parse(await getCoinData(coin));

  return (
    <main className=" grid gap-4 place-items-center">
      <section className="w-11/12">
        <div className="flex justify-between">
          <h2>{coinData.name}</h2>
          <div className=" w-1/3 flex justify-between">
            <span>{currencyFormat(curPrice)}</span>

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

function currencyFormat(num) {
  return (
    "$" +
    num
      .toFixed(20)
      .toString()
      .replace(/\.?0+$/, "")
  );
}

async function TokenChart({ coinId }) {
  const chartData = await getCoinChartData(coinId);
  return (
    <div>
      <h2 className="sr-only">Token Price Chart</h2>
      <PriceChart data={chartData} />
    </div>
  );
}
