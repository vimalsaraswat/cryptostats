import Form from "@/components/forms/buy";
import { createClient } from "@/utils/supabase/server";

export default async function Buy({ searchParams }) {
  const supabase = createClient();
  const cash = (await supabase.from("user_data").select("cash")).data[0].cash;

  const query = searchParams?.query || "";
  const coinList = query ? await getCoinList() : [];
  const filteredList = processList(query, coinList);

  return <Form cash={cash} searchResults={filteredList} />;
}

async function getCoinList() {
  const res = await fetch("https://api.coingecko.com/api/v3/coins/list", {
    next: { revalidate: 24 * 60 * 60 },
  });
  const data = await res.json();

  return data;
}

function processList(key, list) {
  const filteredList = [];

  for (const item of list) {
    if (item.name.toLowerCase().startsWith(key.toLowerCase())) {
      filteredList.push(item);
    }
    if (filteredList.length === 10) {
      break;
    }
  }

  return filteredList;
}
