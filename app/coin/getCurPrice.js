export default async function getCurPrice(coinId, currency = "usd") {
  let price;
  let requestOptions = {
    method: "GET",
    Headers: {
      accept: "application/json",
    },
  };

  price = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=${currency}
      `,
    requestOptions
  )
    .then((response) => response.text())
    .then((price) => JSON.parse(price)[coinId][currency])
    .catch((error) => console.log("error", error));
  console.log(price);
  return price;
}
