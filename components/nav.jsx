"use client";

import { useState } from "react";
import Search from "@/app/home/search";
import NavItems from "@/components/navItems";
import { SearchIcon, HamburgerIcon } from "@/components/icons";

export default function Nav({ userLoggedIn }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <div className="flex gap-2 sm:order-3 lg:hidden">
        <Magnifier searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
        <HamburgerMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      </div>
      <div className={`${!searchOpen && "hidden"} w-full sm:block sm:w-auto`}>
        <Search />
      </div>
      <div
        className={`${!menuOpen && "hidden"} order-4 w-full sm:w-auto lg:block`}
      >
        <NavItems
          userLoggedIn={userLoggedIn}
          closeMenu={() => setMenuOpen(false)}
        />
      </div>
    </>
  );
}

function Magnifier({ searchOpen, setSearchOpen }) {
  return (
    <button
      onClick={() => {
        searchOpen ? setSearchOpen(false) : setSearchOpen(true);
      }}
      type="button"
      className="mr-1 rounded-lg p-2.5 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700 sm:hidden"
    >
      <SearchIcon />
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
      <HamburgerIcon />
    </button>
  );
}
