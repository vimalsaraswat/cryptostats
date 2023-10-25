import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

let supabaseInstance = null;

export async function initSupabase(req) {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
    });
  }

  if (req) {
    const refreshToken = req.cookies.get("my-refresh-token")?.value;
    const accessToken = req.cookies.get("my-access-token")?.value;

    if (refreshToken && accessToken) {
      await supabaseInstance.auth.setSession({
        refresh_token: refreshToken,
        access_token: accessToken,
        auth: { persistSession: false },
      });
    }
  }

  return supabaseInstance;
}

export async function getUser(req) {
  const supabase = await initSupabase(req);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? user : "";
}
