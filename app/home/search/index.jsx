"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import searchCoin from "./searchCoin";
import Loading from "@/components/loading";
import { SearchIcon } from "@/components/icons";
import Input from "@/components/Input";

export default function Search() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef(null);

  // Add a click event listener to hide search results if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    if (query === "") return;
    setLoading(true);
    searchCoin(query)
      .then((value) => setSearchResults(value))
      .catch((error) => {
        console.error(error);
        setError(true);
      })
      .finally(() => setLoading(false));
    setShowResults(true);
  };

  if (error)
    return (
      <main>
        Something went wrong,
        <br />
        Try refreshing after some time.
      </main>
    );
  else
    return (
      <div id="searchh" className="mt-4 flex flex-col sm:m-0 sm:p-0">
        <div ref={resultsRef} className="relative sm:block">
          <Input
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSearch();
              }
            }}
            value={query}
            type="text"
            id="search-navbar"
            className="p-2 pr-10"
            placeholder="Coin Search..."
          />
          <button
            type="button"
            onClick={() => {
              handleSearch();
            }}
            className="absolute inset-y-0 right-0 flex items-center px-3"
          >
            {loading ? (
              <Loading type="small" />
            ) : (
              <div className="pointer-events-none">
                <SearchIcon />
              </div>
            )}
          </button>
        </div>
        {showResults && (
          <div id="search-resuts" className="relative h-0 w-full">
            {searchResults.length > 0 ? (
              <ul
                id="search-results"
                className="absolute left-0 top-0 mt-4 flex h-fit max-h-60 flex-col overflow-y-scroll rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium  dark:border-gray-700 dark:bg-gray-800"
              >
                {searchResults.map((result, i) => {
                  return (
                    <li key={i} className="pb-3 last:pb-0 sm:pb-4">
                      <Link
                        href={`/coin/${result.id}`}
                        className="flex items-center space-x-4"
                      >
                        <div className="flex-shrink-0">
                          <img
                            className="h-8 w-8 rounded-full"
                            src={result.thumb}
                            alt={`${result.name} image`}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                            {result.name}
                          </p>
                          <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                            {`Market Rank: ${result.market_cap_rank}`}
                          </p>
                        </div>
                        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                          {result.symbol}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              !loading && (
                <p className="absolute left-0 top-0 mt-4 rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium dark:border-gray-700  dark:bg-gray-800 md:p-0">
                  Nothing
                </p>
              )
            )}
          </div>
        )}
      </div>
    );
}
