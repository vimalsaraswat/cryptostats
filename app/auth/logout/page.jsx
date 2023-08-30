"use client";

import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const handleLogOut = async () => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });
    if (response.ok) {
      router.refresh();
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto">
        <p className="block mb-6 text-sm font-medium text-gray-900 dark:text-white">
          Are you sure you want to Logout?
        </p>
        <button
          type="submit"
          onClick={handleLogOut}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          LogOut
        </button>
      </div>
    </div>
  );
}
