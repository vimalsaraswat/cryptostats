import { NextResponse } from "next/server";

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

export async function GET(request) {
  try {
    const key = request.nextUrl.searchParams.get("key");
    const coinList = await getCoinList();

    const filteredList = processList(key, coinList);

    return NextResponse.json({ data: filteredList }, { status: 200 });
  } catch (error) {
    console.error("Error processing data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
