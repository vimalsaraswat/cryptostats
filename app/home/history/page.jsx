"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { currencyFormat } from "@/helpers";
import { DateTime } from "luxon";
import Loading from "@/components/loading";

export default function History() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [transactions, setTransactions] = useState(null);

  useEffect(() => {
    fetch("/api/user/transactions")
      .then((response) => response.text())
      .then((result) => {
        setTransactions(JSON.parse(result).data);
      })
      .catch((error) => {
        console.error(error);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading type="large" />;
  else if (error)
    return (
      <>
        Something went wrong,
        <br />
        Try refreshing after some time.
      </>
    );
  else
    return (
      <div className="my-2 w-full h-full overflow-auto">
        <h2 className="mb-4 w-fit mx-auto text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 md:text-5xl lg:text-6xl">
          History
        </h2>
        <table className="w-fit h-fit py-4 mx-auto overflow-auto bg-gray-200 dark:bg-gray-800 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-opacity-75 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Token
              </th>
              <th scope="col" className="px-6 py-3 hidden sm:block">
                Rate
              </th>
              <th scope="col" className="px-6 py-3">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3">
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions?.map((transaction, i) => {
              return (
                <tr id={i}>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <Link href={`/coin/${transaction.coinId}`}>
                      {transaction.coinId.toUpperCase()}
                    </Link>
                  </th>
                  <td className="px-6 py-4 hidden sm:block">
                    {currencyFormat(transaction.price)}
                  </td>
                  <td className="px-6 py-4">{transaction.quantity}</td>
                  <td className="px-6 py-4">
                    {DateTime.fromISO(transaction.created_at).toFormat("ff")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
}
