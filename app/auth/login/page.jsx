import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Input from "@/components/Input";
import { SubmitButton } from "@/components/button";

export default function Login({ searchParams }) {
  const signIn = async (formData) => {
    "use server";

    const email = formData.get("email");
    const password = formData.get("password");
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/auth/login?message=Could not authenticate user");
    }

    revalidatePath("/");
    return redirect("/home");
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
        <SubmitButton text="Login" />

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
