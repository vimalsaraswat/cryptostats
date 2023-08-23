export default async function btcExchangeRates(currency = "usd") {
  let requestOptions = {
    method: "GET",
    Headers: {
      accept: "application/json",
    },
  };

  let rate = await fetch(
    "https://api.coingecko.com/api/v3/exchange_rates",
    requestOptions
  )
    .then((response) => response.text())
    .then((exchangeRate) => JSON.parse(exchangeRate).rates[currency].value)

    .catch((error) => console.log("error", error));

  return rate;
}
