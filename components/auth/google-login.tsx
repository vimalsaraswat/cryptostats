import { signIn } from "@/auth";

export default function GoogleLogin() {
  return (
    <form
      className="p-0 w-fit"
      action={async () => {
        "use server";
        await signIn("google", {
          redirectTo: "/dashboard",
        });
      }}
    >
      <button type="submit" className="btn btn-soft">
        Sign in with Google
      </button>
    </form>
  );
}
