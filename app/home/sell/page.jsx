"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { currencyFormat } from "@/helpers";
import { getCurPrice } from "@/app/coin";
import Loading from "@/components/loading";
import Toast from "@/components/ui/Toast";

export default function Sell() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [showConfirmation, setShowConfirmation] = useState(false);

  const [coinId, setCoinId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState(null);
  const amount = price && quantity ? price * quantity : 0;

  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    if (coinId && quantity) {
      getCurPrice(coinId)
        .then((value) => setPrice(value))
        .catch((error) => {
          console.error(error);
        });
    }
  }, [coinId]);

  const handleSell = async (e) => {
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
        if (amount < 1) {
          setErrorMsg("Amount should be greater than $1");
        } else if (amount > 10000000) {
          setErrorMsg("Amount should be less than $10000000");
        } else {
          setShowConfirmation(true);
        }
      });
    setLoading(false);
  };

  if (showConfirmation) {
    return (
      <ConfirmSell
        coinId={coinId}
        quantity={quantity}
        price={price}
        setShowConfirmation={setShowConfirmation}
        setErrorMsg={setErrorMsg}
      />
    );
  }

  if (loading)
    return (
      <>
        <Loading type="large" />
        <span className="sr-only">Loading</span>
      </>
    );
  else
    return (
      <>
        <form
          onSubmit={handleSell}
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
              autoFocus
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="token"
              placeholder="Symbol"
              type="text"
              required
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
              min={1e-8}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="coins"
              placeholder="Quantity"
              type="number"
              required
            />
          </fieldset>
          {price && quantity && (
            <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Amount:{" "}
              <span className="text-base font-bold">
                {currencyFormat(amount)}
              </span>
            </p>
          )}
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Sell
          </button>
        </form>

        {errorMsg && (
          <Toast
            type="error"
            message={errorMsg}
            onRemove={() => setErrorMsg("")}
          />
        )}
      </>
    );
}

function ConfirmSell(props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleConfirmSell = async (e) => {
    e.preventDefault();
    setLoading(true);

    const sell = {
      coinId: props.coinId,
      price: props.price,
      quantity: props.quantity,
    };
    const response = await fetch("/api/sell", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sell),
    })
      .then((result) => result.json())
      .finally(() => setLoading(false));

    if (response.ok) {
      router.push("/home");
    } else {
      props.setErrorMsg(response.message);
      props.setShowConfirmation(false);
    }
  };
  return (
    <section>
      <article>
        You are solding {props.quantity}
        {props.coinId} at {currencyFormat(props.quantity * props.price)}.
      </article>
      {loading ? (
        <>
          <Loading />
          <span className="sr-only">Loading</span>
        </>
      ) : error ? (
        <main>
          Something went wrong,
          <br />
          Try refreshing after some time.
        </main>
      ) : (
        <button
          type="submit"
          onClick={handleConfirmSell}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Confirm Transaction
        </button>
      )}
    </section>
  );
}
