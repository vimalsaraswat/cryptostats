"use client";

import { signInUser } from "@/actions/user";
import Link from "next/link";
import { useActionState } from "react";

export function SignIn() {
  const [state, formAction, isPending] = useActionState(signInUser, null);

  return (
    <div className="w-full p-6 bg-background/60 rounded-lg shadow-md space-y-6">
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            defaultValue={state?.initialValues?.email}
            required
            className="mt-1 block w-full input"
          />
        </div>
        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            defaultValue={state?.initialValues?.password}
            required
            className="mt-1 block w-full input"
          />
        </div>

        <button type="submit" disabled={isPending} className="w-full btn">
          {isPending ? "Sending..." : "Send Email"}
        </button>

        {state?.message && (
          <div
            className={`mt-4 p-3 rounded ${
              state?.success
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {state?.message}
          </div>
        )}
      </form>
      <p className="text-center">
        {"Don't have an account? "}
        <Link href="/sign-up" className="link">
          Sign in
        </Link>
      </p>
    </div>
  );
}
