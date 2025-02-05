import { signOut } from "@/auth";

export default function Logout() {
  return (
    <form
      className="p-0 w-fit"
      action={async () => {
        "use server";
        await signOut({
          redirectTo: "/",
        });
      }}
    >
      <button type="submit" className="btn btn-ghost">
        Logout
      </button>
    </form>
  );
}
