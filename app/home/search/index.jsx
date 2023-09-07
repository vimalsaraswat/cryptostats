"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import searchCoin from "./searchCoin";

export default function Search() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef(null);

  // Add a click event listener to the document
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target)) {
        // Clicked outside of the search results, hide them
        setShowResults(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      // Clean up the event listener when the component unmounts
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

    console.table(searchResults);
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
      <div className="sm:p-0 mt-4 sm:m-0 flex flex-col">
        <div className="relative sm:block">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span className="sr-only">Search icon</span>
          </div>
          <input
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
            className="block w-full p-2 px-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search..."
          />
          <button
            onClick={handleSearch}
            type="submit"
            className="hidden md:block text-white absolute right-0.5 inset-y-0 h-8 my-auto bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
        </div>
        {showResults && (
          <div
            ref={resultsRef}
            id="search-resuts"
            className="relative w-0 h-0 z-10"
          >
            {searchResults.length > 0 ? (
              <ul className="absolute top-0 left-0 h-60 overflow-y-scroll flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50  dark:bg-gray-800 dark:border-gray-700">
                {searchResults.map((result, i) => {
                  console.log(result, i);
                  return (
                    <li className="pb-3 sm:pb-4">
                      <Link
                        href={`/coin/${result.id}`}
                        className="flex items-center space-x-4"
                      >
                        <div className="flex-shrink-0">
                          <img
                            className="w-8 h-8 rounded-full"
                            src={result.thumb}
                            alt={`${result.name} image`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            {result.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                            {`Market Cap Rank: ${result.market_cap_rank}`}
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
              <p className="absolute top-0 left-0 p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50  dark:bg-gray-800 dark:border-gray-700">
                Nothing
              </p>
            )}
          </div>
        )}
      </div>
    );
}
