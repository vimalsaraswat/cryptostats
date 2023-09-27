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

  if (loading)
    return (
      <>
        <Loading type="large" />
        <span className="sr-only">Loading</span>
      </>
    );
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
      <div className="max-w-5xl flex flex-col items-center justify-center">
        <h2 className="mb-4 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 md:text-5xl">
          History
        </h2>
        <div className="h-80 overflow-scroll">
          <table className="text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Token Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Price Then
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
                console.log(
                  DateTime.fromISO(transaction.created_at).toLocaleString(
                    "DATETIME_SHORT_WITH_SECONDS"
                  )
                );
                return (
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
                      <Link href={`/coin/${transaction.coinId}`}>
                        {transaction.coinId.toUpperCase()}
                      </Link>
                    </th>
                    <td className="px-6 py-4">
                      {currencyFormat(transaction.price)}
                    </td>
                    <td className="px-6 py-4">{transaction.quantity}</td>

                    <td className="px-6 py-4">
                      {DateTime.fromISO(transaction.created_at).toLocaleString(
                        "f"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
}
