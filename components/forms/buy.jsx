"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { currencyFormat } from "@/helpers";
import { getCurPrice } from "@/app/coin";
import { useToast } from "@/utils/ToastContext";
import Input from "../Input";

export default function Form({ cash, searchResults }) {
  const { addToast } = useToast();
  const pathname = usePathname();
  const router = useRouter();

  const [coinId, setCoinId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState(null);
  const [showResultsList, setShowResultsList] = useState(true);
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

  const handleCoinIdChange = (query) => {
    setCoinId(query);
    price && setPrice(null);
    !showResultsList && setShowResultsList(true);
    const params = new URLSearchParams();
    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if (coinId && quantity > 0) {
      searchResults.forEach((coin) => {
        if (coinId === coin.id) {
          if (!price) updatePrice();
          const intervalId = setInterval(() => {
            updatePrice();
          }, 60000);
          return () => clearInterval(intervalId);
        }
      });
    }
  }, [quantity]);

  function updatePrice() {
    getCurPrice(coinId)
      .then((value) => {
        setPrice(value);
        console.log({ value });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleBuy = (e) => {
    e.preventDefault();

    if (amount > cash) {
      addToast("warning", "Not enough cash balance!", 3);
    } else if (amount < 1) {
      addToast("warning", "Amount should be greater than $1", 3);
    } else if (amount > 10000000) {
      addToast("warning", "Amount should be less than $10000000", 3);
    } else {
      const params = new URLSearchParams();
      params.set("coinId", coinId);
      params.set("price", price);
      params.set("quantity", quantity);

      router.push(`/home/transaction?${params.toString()}`);
    }
  };

  return (
    <form onSubmit={handleBuy} className="mx-auto max-w-2xl">
      <fieldset className="mb-6">
        <label
          htmlFor="token"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          Token
        </label>
        <Input
          onChange={(e) => handleCoinIdChange(e.target.value)}
          value={coinId}
          autoFocus
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
          {searchResults.length > 0 && (
            <ul className="absolute left-0 top-0 flex h-fit max-h-60 flex-col overflow-y-scroll rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium  dark:border-gray-700 dark:bg-gray-800">
              {searchResults.map((result, i) => {
                return (
                  <li key={i} className="w-48 pb-3 last:pb-0 sm:pb-4">
                    <button
                      onClick={() => {
                        setShowResultsList(false);
                        setCoinId(result.id);
                      }}
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
        <Input
          onChange={(e) => setQuantity(e.target.value)}
          value={quantity}
          min={1e-5}
          step={1e-5}
          name="coins"
          placeholder="Quantity"
          type="number"
          required
        />
      </fieldset>
      {amount > 0 && (
        <p className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
          Amount:{" "}
          <span className="text-base font-bold">{currencyFormat(amount)}</span>
        </p>
      )}
      <button
        type="submit"
        className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Buy
      </button>
    </form>
  );
}
