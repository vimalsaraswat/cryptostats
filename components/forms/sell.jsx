"use client";

import Input from "@/components/Input";
import { currencyFormat } from "@/helpers";
import { getCurPrice } from "@/app/coin";
import { useToast } from "@/utils/ToastContext";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Form({ tokens }) {
  const { addToast } = useToast();
  const router = useRouter();

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
      const params = new URLSearchParams();
      params.set("coinId", coinId);
      params.set("price", price);
      params.set("quantity", -1 * quantity);

      router.push(`/home/transaction?${params.toString()}`);
    }
  };

  console.log(coinId);
  return (
    <form
      onSubmit={handleSell}
      autoComplete="off"
      className="w-3xl flex flex-col items-center"
    >
      <fieldset className="mb-6 w-full">
        <label
          htmlFor="token"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          Token
        </label>
        <select
          className="form-select block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          name="token"
          id="token"
          onChange={(e) => setCoinId(e.target.value)}
          value={coinId}
          required
        >
          <option value="" disabled>
            Choose a token
          </option>

          {Array.from(tokens.keys()).map((token, i) => {
            return (
              <option
                className="capitalize hover:uppercase"
                key={i}
                value={token}
              >
                {token}
              </option>
            );
          })}
        </select>
      </fieldset>

      <fieldset className="mb-6 w-full">
        <label
          htmlFor="coins"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          Quantity
        </label>
        <Input
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min={1e-5}
          step={1e-5}
          max={coinId && tokens.get(coinId)}
          name="coins"
          placeholder="Quantity"
          type="number"
          required
        />
      </fieldset>
      {price && quantity && (
        <p className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
          Amount:{" "}
          <span className="text-base font-bold">{currencyFormat(amount)}</span>
        </p>
      )}
      <button
        type="submit"
        className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Sell
      </button>
    </form>
  );
}
