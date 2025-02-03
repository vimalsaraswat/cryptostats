import { users } from "@/db/schema";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { genSaltSync, hashSync } from "bcrypt-ts";

export async function getUser(email: string) {
  return await db.select().from(users).where(eq(users.email, email));
}

export async function createUser(user: {
  name: string;
  email: string;
  password: string;
}) {
  const salt = genSaltSync(10);
  const hashedPassword = hashSync(user.password, salt);

  return await db
    .insert(users)
    .values({ name: user.name, email: user.email, password: hashedPassword });
}
