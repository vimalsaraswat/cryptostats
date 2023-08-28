import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

export async function initSupabase(req) {
  // Creating Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  // Getting auth-tokens from cookies
  const refreshToken = req.cookies.get("my-refresh-token")?.value;
  const accessToken = req.cookies.get("my-access-token")?.value;

  // Updating user's auth session
  await supabase.auth.setSession({
    refresh_token: refreshToken,
    access_token: accessToken,
  });

  return supabase;
}
