import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Input from "@/components/Input";
import { SubmitButton } from "@/components/button";

export default function Register({ searchParams }) {
  const signUp = async (formData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email");
    const password = formData.get("password");
    const username = formData.get("username");
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return redirect("/auth/login?message=Could not authenticate user");
    }

    await supabase
      .from("user_data")
      .insert([{ user_id: user.id, username: username }])
      .select();

    return redirect(
      "/auth/login?message=User successfully registered, please login to continue",
    );
  };

  return (
    <div className="flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
      <form
        className="animate-in text-foreground flex w-full flex-1 flex-col justify-center gap-2"
        action={signUp}
      >
        <fieldset className="mb-6">
          <label
            htmlFor="username"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Name
          </label>
          <Input
            name="username"
            id="username"
            type="text"
            placeholder="Your Name"
            required
          />
        </fieldset>
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
        <SubmitButton text="Register" />

        {searchParams?.message && (
          <p className="bg-foreground/10 text-foreground mt-4 p-4 text-center">
            {searchParams.message}
          </p>
        )}

        <p className="my-4 flex flex-col">
          <span>Already have an account?</span>
          <Link
            href={"/auth/login"}
            className="font-medium text-blue-600 hover:underline dark:text-blue-500"
          >
            Login Now
          </Link>
        </p>
      </form>
    </div>
  );
}
