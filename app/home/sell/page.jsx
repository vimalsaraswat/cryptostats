import Form from "@/components/forms/sell";
import { getUserTokens } from "@/lib/supabase";

export default async function Sell() {
  const tokens = await getUserTokens();

  return <Form tokens={tokens} />;
}
