import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

export async function initSupabase(req) {
  // Creating Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  const { session, error } = await supabase.auth.getSession();

  if (!session) {
    // Getting auth-tokens from cookies
    const refreshToken = req.cookies.get("my-refresh-token")?.value;
    const accessToken = req.cookies.get("my-access-token")?.value;

    // Updating user's auth session
    if (refreshToken && accessToken) {
      await supabase.auth.setSession({
        refresh_token: refreshToken,
        access_token: accessToken,
        auth: { persistSession: false },
      });
    }
  }

  return supabase;
}

export async function getUser(req) {
  const supabase = await initSupabase(req);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) return user;
}
