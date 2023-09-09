"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { currencyFormat } from "../../helpers";
import { getCurPrice } from "@/app/coin";

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
        <section id="hero" className="flex items-center space-x-4 m-4">
          <img
            className="w-10 h-10 rounded-full"
            src="https://source.boringavatars.com/"
            alt=""
          />
          <div className="font-medium dark:text-white">
            <h2>{userData.user_data.username}</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {currencyFormat(userData.user_data.cash)}
            </div>
          </div>
        </section>
        <Tokens tokens={userData.tokens} />
      </main>
    );
}

function Tokens({ tokens }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [userTokens, setUserTokens] = useState([]);

  useEffect(() => {
    // Create a function to fetch token prices asynchronously
    const fetchTokenPrices = async () => {
      try {
        const updatedUserTokens = await Promise.all(
          tokens.map(async (token) => {
            try {
              const price = await getCurPrice(token.coinId);
              return {
                id: token.coinId,
                price: price,
                quantity: token.quantity,
                value: price * token.quantity,
              };
            } catch (error) {
              console.error(error);
              setError(true);
              return null; // Return null for tokens with errors
            }
          })
        );

        // Filter out tokens with errors (null values)
        const filteredUserTokens = updatedUserTokens.filter(
          (token) => token !== null
        );
        setUserTokens(filteredUserTokens);
      } catch (error) {
        console.error(error);
        setError(true);
      }

      setLoading(false);
    };

    // Call the async function
    fetchTokenPrices();
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
  else console.log(userTokens);
  return (
    <section
      id="user-owned-tokens"
      className="relative overflow-x-auto shadow-md rounded-sm sm:rounded-lg"
    >
      <h3 className="text-2xl text-[#b0ccda]">Your Tokens:</h3>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Token Name
            </th>
            <th scope="col" className="hidden px-6 py-3 sm:block">
              Current Price
            </th>
            <th scope="col" className="px-6 py-3">
              Quantity
            </th>
            <th scope="col" className="px-6 py-3">
              Value Now
            </th>
            <th scope="col" className="px-6 py-3 hidden sm:block">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {" "}
          {userTokens.map((token, i) => {
            return (
              <>
                <tr
                  className={
                    i % 2 == 0
                      ? "bg-white border-b dark:bg-gray-900 dark:border-gray-700"
                      : "border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                  }
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <Link href={`/coin/${token.id}`}>
                      {token.id.toUpperCase()}
                    </Link>
                  </th>
                  <td className="px-6 py-4 hidden sm:block">
                    {currencyFormat(token.price)}
                  </td>
                  <td className="px-6 py-4">{token.quantity}</td>

                  <td className="px-6 py-4">{currencyFormat(token.value)}</td>
                  <td className="px-6 py-4 hidden sm:block">
                    <a
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </a>
                  </td>
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
