import { DateTime } from "luxon";

export default async function getCoinChartData(coinId, currency = "usd") {
  const now = DateTime.now().toUnixInteger();
  const from = DateTime.now().plus({ days: -0.5 }).toUnixInteger();

  // Your timestamp and value data
  const rawData =
    (await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart/range?vs_currency=${currency}&from=${from}&to=${now}`
    )
      .then((response) => response.text())
      .then((result) => JSON.parse(result).prices)
      .catch((error) => console.log("error", error))) || [];

  function unixTimestampToISO(d) {
    return new Date(d).toISOString();
  }
  const timestamps = rawData.map(([value]) => unixTimestampToISO(value));

  // Convert the raw data into the desired format
  const chartData = {
    labels: timestamps,
    prices: rawData.map(([, price]) => price),
  };
  return chartData;
}
