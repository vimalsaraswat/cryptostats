import { auth } from "@/auth";
import Link from "next/link";
import GoogleLogin from "./auth/google-login";
import Logout from "./auth/logout";

const Header = async () => {
  const session = await auth();
  const isLoggedIn = !!session?.user?.id;

  return (
    <div className="drawer sticky top-0 z-40">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar bg-base-300/60 backdrop-blur-md w-full">
          <div className="flex-none md:hidden">
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 px-2">Crypto$tats</div>
          <div className="hidden flex-none md:block">
            <ul className="menu menu-horizontal items-center">
              {/* Navbar menu content here */}
              <NavItems isLoggedIn={isLoggedIn} />
            </ul>
          </div>
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="menu bg-base-200/80 backdrop-blur-md min-h-full w-80 max-w-[75%] p-4">
          {/* Sidebar content here */}
          <label
            aria-label="close sidebar"
            htmlFor="my-drawer-3"
            className="btn btn-square btn-ghost text-2xl font-mono"
          >
            x
          </label>
          <ul className="flex-1 flex flex-col items-end">
            <NavItems isLoggedIn={isLoggedIn} />
          </ul>
        </div>
      </div>
    </div>
  );
};

const NavItems = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return (
    <>
      {isLoggedIn && (
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
      )}
      <li>{isLoggedIn ? <Logout /> : <GoogleLogin />}</li>
    </>
  );
};

export default Header;
