"use client";

import { signUpUser } from "@/actions/user";
import { useActionState } from "react";

export function SignUp() {
  const [state, formAction, isPending] = useActionState(signUpUser, null);

  return (
    <div className="max-w-md mx-auto p-6 bg-background/60 rounded-lg shadow-md">
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="name" className="label">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={state?.initialValues?.name}
            required
            className="mt-1 block w-full input"
          />
        </div>

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
    </div>
  );
}
