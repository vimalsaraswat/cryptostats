import { createClient } from "@/utils/supabase/server";
import { DateTime } from "luxon";
import Link from "next/link";
import { currencyFormat } from "@/helpers";

export default async function History() {
  const supabase = createClient();

  let { data: transactions, error } = await supabase
    .from("transactions")
    .select("*");

  if (error)
    return (
      <>
        Something went wrong,
        <br />
        Try refreshing after some time.
      </>
    );
  else
    return (
      <div className="my-2 h-full w-full overflow-auto">
        <h2 className="mx-auto mb-4 w-fit bg-gradient-to-r from-sky-400 to-emerald-600 bg-clip-text text-3xl font-extrabold text-transparent md:text-5xl lg:text-6xl">
          History
        </h2>
        <table className="mx-auto h-fit w-fit overflow-auto rounded-md bg-gray-200 bg-opacity-40 bg-clip-padding py-4 text-left text-sm text-gray-500 backdrop-blur-sm backdrop-filter dark:bg-gray-800 dark:text-gray-400">
          <thead className="bg-gray-50 bg-opacity-75 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Token
              </th>
              <th scope="col" className="hidden px-6 py-3 sm:block">
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
                <tr key={i}>
                  <th
                    scope="row"
                    className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                  >
                    <Link href={`/coin/${transaction.coinId}`}>
                      {transaction.coinId.toUpperCase()}
                    </Link>
                  </th>
                  <td className="hidden px-6 py-4 sm:block">
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
