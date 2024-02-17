import { createClient } from "@/utils/supabase/server";

async function getUserData() {
  const supabase = await createClient();
  const user_data = await supabase.from("user_data").select("*");
  const userData = user_data.data[0];

  return userData;
}

async function getUserTokens() {
  const transactions = await supabase
    .from("transactions")
    .select("coinId,quantity");
  const tokens = processTransactions(transactions.data);

  return tokens;
}

function processTransactions(transactions) {
  const tokens = new Map();
  transactions.forEach((item) => {
    const existingQuantity = tokens.get(item.coinId) || 0;
    tokens.set(item.coinId, existingQuantity + item.quantity);
  });

  return tokens;
}

export { getUserData, getUserTokens };
