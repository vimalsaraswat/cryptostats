import { SubmitButton } from "@/components/button";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function LogOut() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const signOut = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();

    revalidatePath("/");
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
          <SubmitButton text="LogOut" />
        </form>
      </div>
    </div>
  );
}
