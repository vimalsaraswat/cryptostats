"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Loading from "@/components/loading";
import { useToast } from "@/utils/ToastContext";

export default function Login() {
  const router = useRouter();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    const user = {
      email: email,
      password: password,
    };
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }).finally(() => setLoading(false));

    if (response.ok) {
      addToast("success", "Welcome my friend, welcome!", 10);
      router.push("/home");
    } else {
      addToast(
        "error",
        (await response.json()).message || "Something went wrong!"
      );
    }
  };

  return (
    <>
      <form
        onSubmit={handleLogIn}
        className="max-w-2xl flex flex-col items-center"
        autoComplete="off"
      >
        <fieldset className="mb-6">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your email id
          </label>
          <input
            type="email"
            name="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </fieldset>
        <fieldset className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </fieldset>
        {loading ? (
          <Loading />
        ) : (
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            LogIn
          </button>
        )}
      </form>
      <p className="flex flex-col my-4">
        <span>Don't have an account?</span>
        <Link
          href={"/auth/login"}
          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
        >
          Register now
        </Link>
      </p>
    </>
  );
}
