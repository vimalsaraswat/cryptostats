"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Loading from "@/components/loading";
import { useToast } from "@/utils/ToastContext";
import Input from "@/components/Input";

export default function Register() {
  const router = useRouter();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const user = {
      username: username,
      email: email,
      password: password,
    };

    let response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }).finally(() => setLoading(false));

    if (response.ok) {
      addToast("success", "Account created Successfully!");
      addToast("success", "Please Login to proceed", 8);
      router.push("/auth/login");
    } else {
      addToast(
        "error",
        (await response.json()).message ||
          "Something went wrong, please try again!",
      );
    }
  };

  return (
    <>
      <p className="mb-6 text-center text-lg font-medium text-gray-900 dark:text-white">
        Welcome! Join the party,
        <br />
        it's just a click away.😄
      </p>
      <form
        onSubmit={handleRegister}
        autoComplete="off"
        className="mx-auto max-w-2xl"
      >
        <fieldset className="mb-6">
          <label
            htmlFor="username"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Username
          </label>
          <Input
            name="username"
            id="username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            type="text"
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
            name="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
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
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </fieldset>
        {loading ? (
          <Loading />
        ) : (
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
          >
            Submit
          </button>
        )}
      </form>
      <p className="my-4 flex flex-col">
        <span>Already have an account?</span>
        <Link
          href={"/auth/login"}
          className="font-medium text-blue-600 hover:underline dark:text-blue-500"
        >
          Login Now
        </Link>
      </p>
    </>
  );
}
