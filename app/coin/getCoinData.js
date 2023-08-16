export default async function getCoinData(coinId) {
  let data;
  let requestOptions = {
    method: "GET",
    Headers: {
      accept: "application/json",
    },
  };

  data = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coinId}`,
    requestOptions
  )
    .then((response) => response.text())
    .catch((error) => console.log("error", error));

  console.log(JSON.parse(data).name);
  return data;
}
