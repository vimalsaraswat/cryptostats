import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Input from "@/components/Input";

export default function Login({ searchParams }) {
  const signIn = async (formData) => {
    "use server";
    console.log(formData);
    const email = formData.get("email");
    const password = formData.get("password");
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/auth/login?message=Could not authenticate user");
    }

    return redirect("/");
  };

  return (
    <div className="flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
      <form
        className="animate-in text-foreground flex w-full flex-1 flex-col justify-center gap-2"
        action={signIn}
      >
        <fieldset className="mb-6">
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Your email id
          </label>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="you@example.com"
            required
          />
        </fieldset>
        <fieldset className="mb-6">
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Your password
          </label>
          <Input
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            required
          />
        </fieldset>
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          LogIn
        </button>

        {searchParams?.message && (
          <p className="bg-foreground/10 text-foreground mt-4 p-4 text-center">
            {searchParams.message}
          </p>
        )}

        <p className="my-4 flex flex-col">
          <span>Don't have an account?</span>
          <Link
            href={"/auth/register"}
            className="font-medium text-blue-600 hover:underline dark:text-blue-500"
          >
            Register now
          </Link>
        </p>
      </form>
    </div>
  );
}
