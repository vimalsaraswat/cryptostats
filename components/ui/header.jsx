"use client";

import { useState } from "react";
import Search from "@/app/home/search";
import Logo from "@/components/logo";
import NavItems from "@/components/navItems";

export default function header({ userLoggedIn }) {
  return (
    <header className="h-fit w-full border-b border-gray-400 bg-gray-300 bg-opacity-60 bg-clip-padding backdrop-blur-md backdrop-filter dark:border-gray-600 dark:bg-gray-800">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between gap-x-4 p-4 sm:justify-evenly sm:gap-y-4 lg:justify-between">
        <Logo />
        <Nav userLoggedIn={userLoggedIn} />
      </div>
    </header>
  );
}

function Nav({ userLoggedIn }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <div className="flex gap-2 sm:order-3 lg:hidden">
        <SearchIcon searchOpen={searchOpen} setSearchOpen={setSearchOpen} />

        <HamburgerMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      </div>
      <div className={`${!searchOpen && "hidden"} w-full sm:block sm:w-auto`}>
        <Search />
      </div>
      <div
        className={`${!menuOpen && "hidden"} order-4 w-full sm:w-auto lg:block`}
      >
        <NavItems userLoggedIn={userLoggedIn} />
      </div>
    </>
  );
}

function SearchIcon({ searchOpen, setSearchOpen }) {
  return (
    <button
      onClick={() => {
        searchOpen ? setSearchOpen(false) : setSearchOpen(true);
      }}
      type="button"
      className="mr-1 rounded-lg p-2.5 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700 sm:hidden"
    >
      <svg
        className="h-5 w-5"
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
      <span className="sr-only">Search</span>
    </button>
  );
}

function HamburgerMenu({ menuOpen, setMenuOpen }) {
  return (
    <button
      onClick={() => {
        menuOpen ? setMenuOpen(false) : setMenuOpen(true);
      }}
      type="button"
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
    >
      <span className="sr-only">Open main menu</span>
      <svg
        className="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 17 14"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M1 1h15M1 7h15M1 13h15"
        />
      </svg>
    </button>
  );
}
