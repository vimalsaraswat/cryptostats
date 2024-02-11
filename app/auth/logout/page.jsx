import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const cookieStore = cookies();
const supabase = createClient(cookieStore);

export default async function Login() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/auth/login");
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="mx-auto max-w-2xl">
        <p className="mb-6 block text-lg font-medium text-gray-900 dark:text-white">
          So you decided to leave me, Huh!
          <br />
          Please think again .
        </p>
        <form action={signOut}>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
          >
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}
