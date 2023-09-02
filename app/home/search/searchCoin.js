export default async function searchCoin(query = "") {
  let requestOptions = {
    method: "GET",
    Headers: {
      accept: "application/json",
    },
  };
  if (query === "") return "Empty query detected!";
  else {
    let data = await fetch(
      `https://api.coingecko.com/api/v3/search?query=${query}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => JSON.parse(result).coins)
      .catch((error) => console.log("error", error));

    if (data.length > 10) return data.slice(0, 10);
    else return data;
  }
}
