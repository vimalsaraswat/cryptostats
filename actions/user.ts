"use server";

import { signIn } from "@/auth";
import { DB } from "@/db/queries";
import { compare } from "bcrypt-ts";

type PreviousSignInState = {
  success: boolean;
  message: string;
  initialValues?: {
    email: string;
    password: string;
  };
} | null;

type PreviousSignUpState = {
  success: boolean;
  message: string;
  initialValues?: {
    name: string;
    email: string;
    password: string;
  };
} | null;

export async function signInUser(
  prevState: PreviousSignInState,
  formData: FormData,
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const initialValues = { email, password };

  try {
    const user = await DB.getUser(email);

    if (user.length === 0)
      return {
        success: false,
        message: "Invalid email address",
        initialValues,
      };

    const passwordsMatch = await compare(password, user[0].password!);
    if (!passwordsMatch) {
      return {
        success: false,
        message: "Invalid password",
        initialValues,
      };
    }

    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    return { success: true, message: "Logged in successfully!" };
  } catch (err) {
    const error = err as Error;

    console.error("Error logging in: ", error.message);
    return {
      success: false,
      message: "Failed to login user. Please try again.",
      initialValues,
    };
  }
}

export async function signUpUser(
  prevState: PreviousSignUpState,
  formData: FormData,
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  const initialValues = { name, email, password };

  try {
    const user = await DB.getUser(email);
    if (user.length > 0) {
      return {
        success: false,
        message: "Email already in use!",
        initialValues,
      };
    }

    const res = await DB.createUser({ name, email, password });

    console.log("res", res);

    return {
      success: true,
      message: "Registered successfully!",
    };
  } catch (err) {
    const error = err as Error;
    console.error("Error registering user: ", error.message);

    return {
      success: false,
      message: "Failed to register user. Please try again.",
      initialValues,
    };
  }
}
