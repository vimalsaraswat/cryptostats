"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/utils/ToastContext";
import Loading from "@/components/loading";

export default function Login() {
  const router = useRouter();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(false);

  const handleLogOut = async () => {
    setLoading(true);
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    }).finally(() => setLoading(false));

    if (response.ok) {
      addToast("success", "Logged out successfully!");
      addToast("error", "But I will miss you🥺", 8);
      router.refresh();
    } else {
      addToast("error", "Something went wrong, please try again!");
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="max-w-2xl mx-auto">
        <p className="block mb-6 text-lg font-medium text-gray-900 dark:text-white">
          So you decided to leave me, Huh!
          <br />
          Think again before its too late.
        </p>
        {loading ? (
          <Loading />
        ) : (
          <button
            type="submit"
            onClick={handleLogOut}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            LogOut
          </button>
        )}
      </div>
    </div>
  );
}
