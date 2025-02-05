import { getUser } from "@/db/queries/user";
import NextAuth from "next-auth";
import { db } from "@/db/drizzle";
import Credentials from "next-auth/providers/credentials";
// import { saltAndHashPassword } from "@/actions/user";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { compare } from "bcrypt-ts";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        const user = await getUser(email as string);

        if (user.length === 0) return null;

        const passwordsMatch = await compare(
          password as string,
          user[0].password!,
        );
        if (passwordsMatch) return user[0];

        return null;
      },
    }),
  ],
});
