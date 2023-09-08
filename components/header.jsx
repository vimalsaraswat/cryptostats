"use client";

import { useState } from "react";
import Search from "@/app/home/search";
import Logo from "@/components/logo";
import NavItems from "./navItems";

export default function header() {
  return (
    <header className="bg-white max-w-screen dark:bg-gray-900 w-full border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap gap-x-4 sm:gap-y-4 items-center justify-between sm:justify-evenly lg:justify-between mx-auto p-4">
        <Logo />
        <Nav />
      </div>
    </header>
  );
}

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <div className="lg:hidden sm:order-3 flex gap-2">
        <SearchIcon searchOpen={searchOpen} setSearchOpen={setSearchOpen} />

        <HamburgerMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      </div>
      <div className={`${!searchOpen && "hidden"} sm:block w-full sm:w-auto`}>
        <Search />
      </div>
      <div
        className={`${!menuOpen && "hidden"} order-4 lg:block w-full sm:w-auto`}
      >
        <NavItems />
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
      data-collapse-toggle="navbar-search"
      aria-controls="navbar-search"
      aria-expanded="false"
      className="sm:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 mr-1"
    >
      <svg
        className="w-5 h-5"
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
      className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      aria-controls="navbar-sticky"
      aria-expanded="false"
    >
      <span className="sr-only">Open main menu</span>
      <svg
        className="w-5 h-5"
        aria-hidden="true"
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
