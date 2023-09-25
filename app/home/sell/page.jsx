"use client";

import { useContext, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { currencyFormat } from "@/helpers";
import { getCurPrice } from "@/app/coin";
import Loading from "@/components/loading";
import { useToast } from "@/utils/ToastContext";
import { UserDataContext } from "@/utils/UserContext";

export default function Sell() {
  const { addToast } = useToast();
  const tokens = useContext(UserDataContext).tokens;

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
    const timeoutId = setTimeout(() => {
      getCurPrice(coinId)
        .then((value) => setPrice(value))
        .catch((error) => {
          console.error(error);
        });
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [coinId]);

  const handleSell = (e) => {
    e.preventDefault();

    if (amount < 1) {
      addToast("warning", "Amount should be greater than $1", 3);
    } else if (amount > 10000000) {
      addToast("warning", "Amount should be less than $10000000", 3);
    } else {
      setShowConfirmation(true);
    }
  };

  if (showConfirmation) {
    return (
      <ConfirmSell
        coinId={coinId}
        quantity={quantity}
        price={price}
        setShowConfirmation={setShowConfirmation}
        addToast={addToast}
      />
    );
  }

  return (
    <>
      <form
        onSubmit={handleSell}
        autoComplete="off"
        className="w-3xl flex flex-col items-center"
      >
        <fieldset className="mb-6 w-full">
          <label
            htmlFor="token"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Token
          </label>
          <select
            onChange={(e) => setCoinId(e.target.value)}
            value={coinId}
            autoFocus
            name="token"
            id="token"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          >
            <option value="" disabled default>
              Choose a token
            </option>
            {tokens.map((token, i) => {
              return (
                <option key={i} value={token.coinId}>
                  {token.coinId.toUpperCase()}
                </option>
              );
            })}
          </select>
        </fieldset>
        <fieldset className="mb-6 w-full">
          <label
            htmlFor="coins"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Quantity
          </label>
          <input
            onChange={(e) => setQuantity(e.target.value)}
            value={quantity}
            min={1e-5}
            step={1e-5}
            max={
              coinId && tokens.find((item) => item.coinId === coinId).quantity
            }
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
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Sell
        </button>
      </form>
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
    }).finally(() => setLoading(false));

    if (response.ok) {
      props.addToast("success", "Transaction successful!");
      router.push("/home");
    } else {
      props.addToast(
        "error",
        (await response.json()).message || "Something went wrong!"
      );
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
