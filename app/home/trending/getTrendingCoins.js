export default async function getTrendingCoins() {
  let data;
  let requestOptions = {
    method: "GET",
    Headers: {
      accept: "application/json",
    },
  };

  data = await fetch(
    "https://api.coingecko.com/api/v3/search/trending",
    requestOptions
  )
    .then((response) => response.text())
    .catch((error) => console.log("error", error));

  return data;
}
