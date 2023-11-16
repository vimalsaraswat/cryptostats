"use client";

import { useContext, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { currencyFormat } from "@/helpers";
import { getCurPrice } from "@/app/coin";
import Loading from "@/components/loading";
import { useToast } from "@/utils/ToastContext";
import { UserDataContext } from "@/utils/UserContext";

export default function Buy() {
  const { addToast } = useToast();
  const cash = useContext(UserDataContext).user_data.cash;

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [resultsList, setResultsList] = useState([]);
  const [coinId, setCoinId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState(null);
  const [showResultsList, setShowResultsList] = useState(false);
  const amount = price && quantity ? price * quantity : 0;

  const resultsRef = useRef(null);

  // Clicked outside of the search results, hide them
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target)) {
        setShowResultsList(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (showResultsList) {
      fetch(`http://localhost:3000/api/coin/list?key=${coinId}`)
        .then((response) => response.text())
        .then((result) => setResultsList(JSON.parse(result).data));
    } else {
      console.log("searching");
      setShowResultsList(true);
    }
  }, [coinId]);

  useEffect(() => {
    if (coinId && quantity) {
      const timeoutId = setTimeout(() => {
        getCurPrice(coinId)
          .then((value) => setPrice(value))
          .catch((error) => {
            console.error(error);
          });
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [quantity]);

  const handleBuy = (e) => {
    e.preventDefault();

    if (amount > cash) {
      addToast("warning", "Not enough cash balance!", 3);
    } else if (amount < 1) {
      addToast("warning", "Amount should be greater than $1", 3);
    } else if (amount > 10000000) {
      addToast("warning", "Amount should be less than $10000000", 3);
    } else {
      setShowConfirmation(true);
    }
  };

  const handleCoinSelect = (selectedCoinId) => {
    setShowResultsList(false);
    setResultsList([]);
    setCoinId(selectedCoinId);
  };

  if (showConfirmation) {
    return (
      <ConfirmBuy
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
        onSubmit={handleBuy}
        autoComplete="off"
        className="mx-auto max-w-2xl"
      >
        <fieldset className="mb-6">
          <label
            htmlFor="token"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Token
          </label>
          <input
            onChange={(e) => setCoinId(e.target.value)}
            value={coinId}
            autoFocus
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            name="token"
            placeholder="Symbol"
            type="text"
            required
          />
        </fieldset>
        {showResultsList && (
          <div
            ref={resultsRef}
            id="search-resuts"
            className="relative h-0 w-full"
          >
            {resultsList.length > 0 && (
              <ul className="absolute left-0 top-0 flex h-fit max-h-60 flex-col overflow-y-scroll rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium  dark:border-gray-700 dark:bg-gray-800">
                {resultsList.map((result, i) => {
                  return (
                    <li key={i} className="w-48 pb-3 last:pb-0 sm:pb-4">
                      <button
                        onClick={() => handleCoinSelect(result.id)}
                        className="flex w-full items-center justify-between space-x-4"
                      >
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {result.name}
                        </p>
                        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                          {result.symbol}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
        <fieldset className="mb-6">
          <label
            htmlFor="coins"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Quantity
          </label>
          <input
            onChange={(e) => setQuantity(e.target.value)}
            value={quantity}
            min={1e-5}
            step={1e-5}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            name="coins"
            placeholder="Quantity"
            type="number"
            required
          />
        </fieldset>
        {price && quantity && (
          <p className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Amount:{" "}
            <span className="text-base font-bold">
              {currencyFormat(amount)}
            </span>
          </p>
        )}
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
        >
          Buy
        </button>
      </form>
    </>
  );
}

function ConfirmBuy(props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleConfirmBuy = async (e) => {
    e.preventDefault();
    setLoading(true);

    const buy = {
      coinId: props.coinId,
      price: props.price,
      quantity: props.quantity,
    };

    const response = await fetch("/api/buy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buy),
    }).finally(() => setLoading(false));

    if (response.ok) {
      props.addToast("success", "Transaction successful!");
      router.push("/home?r=true");
    } else {
      props.addToast(
        "error",
        (await response.json()).message || "Something went wrong!",
      );
      props.setShowConfirmation(false);
    }
  };
  return (
    <section>
      <article>
        You are buying {props.quantity}
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
          onClick={handleConfirmBuy}
          className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
        >
          Confirm Payment
        </button>
      )}
    </section>
  );
}
