"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { currencyFormat } from "@/app/helpers";
import { getCurPrice } from "@/app/coin";

export default function Buy() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [coinId, setCoinId] = useState("");
  const [quantity, setQuantity] = useState();
  const [price, setPrice] = useState(null);
  const amount = price && quantity ? price * quantity : 0;
  console.log(amount);

  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    getCurPrice(coinId)
      .then((value) => setPrice(value))
      .catch((error) => {
        console.error(error);
        setError(true);
      });
  }, [coinId]);

  const handleBuy = async (e) => {
    e.preventDefault();
    setLoading(true);
    getCurPrice(coinId)
      .then((value) => setPrice(value))
      .catch((error) => {
        console.error(error);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
        setShowConfirmation(true);
      });
    setLoading(false);
  };

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
      <main className="flex items-center justify-center">
        {showConfirmation ? (
          <ConfirmBuy coinId={coinId} quantity={quantity} price={price} />
        ) : (
          <form
            onSubmit={handleBuy}
            autoComplete="off"
            className="max-w-2xl mx-auto"
          >
            <fieldset className="mb-6">
              <label
                htmlFor="token"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Token
              </label>
              <input
                onChange={(e) => setCoinId(e.target.value)}
                value={coinId}
                autocomplete="off"
                autofocus
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                name="token"
                placeholder="Symbol"
                type="text"
              />
            </fieldset>
            <fieldset className="mb-6">
              <label
                htmlFor="coins"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Quantity
              </label>
              <input
                onChange={(e) => setQuantity(e.target.value)}
                value={quantity}
                autocomplete="off"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                name="coins"
                placeholder="Quantity"
                type="number"
              />
            </fieldset>
            {price && quantity && <p>Amount:{currencyFormat(amount)}</p>}
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Buy
            </button>
          </form>
        )}
      </main>
    );
}

function ConfirmBuy(props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleConfirmBuy = async (e) => {
    e.preventDefault();
    setLoading(true);
    const user = {
      coinId: props.coinId,
      price: props.price,
      quantity: props.quantity,
    };
    const response = await fetch("/api/buy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .catch((error) => setError(true))
      .finally(() => setLoading(false));

    if (response.ok) {
      router.push("/home");
    }
  };
  return (
    <section>
      <article>
        You are buying {props.quantity}
        {props.coinId} at {currencyFormat(props.quantity * props.price)}.
      </article>
      {loading ? (
        <main>Loading....</main>
      ) : error ? (
        <main>
          Something went wrong,
          <br />
          Try refreshing after some time.
        </main>
      ) : (
        <button
          type="submit"
          onClick={handleConfirmBuy}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Confirm Payment
        </button>
      )}
    </section>
  );
}
