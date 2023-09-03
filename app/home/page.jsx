"use client";

import { useState, useEffect } from "react";
import { currencyFormat } from "../helpers";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetch("/api/user/data")
      .then((response) => response.text())
      .then((result) => {
        setUserData(JSON.parse(result).data);
      })
      .catch((error) => {
        console.error(error);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <main>Loading....</main>;
  else if (error)
    return (
      <main>
        Something went wrong,
        <br />
        Try refreshing after some time.
      </main>
    );
  else
    return (
      <main className="w-10/12 max-w-2xl mx-auto">
        <section id="hero" class="flex items-center space-x-4 m-4">
          <img
            class="w-10 h-10 rounded-full"
            src="https://source.boringavatars.com/"
            alt=""
          />
          <div class="font-medium dark:text-white">
            <h2>{userData.user_data.username}</h2>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {currencyFormat(userData.user_data.cash)}
            </div>
          </div>
        </section>
      </main>
    );
}
