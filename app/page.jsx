import { cookies } from "next/headers";
import Link from "next/link";

export default function Home() {
  let userLoggedIn = false;
  if (cookies().get("my-refresh-token")) {
    userLoggedIn = true;
  }
  return (
    <>
      <Hero userLoggedIn={userLoggedIn} />
    </>
  );
}

function Hero({ userLoggedIn }) {
  return (
    <section className="px-8 text-black dark:text-white">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-4 text-4xl font-bold tracking-wide md:text-6xl">
          Welcome to CryptoStats
        </h2>
        <p className="mb-8 text-lg md:text-xl">
          Elevate your trading skills with real-time market data. Stay ahead of
          the game with our powerful analytics.
          <br /> No financial risk, just pure practice.
        </p>

        {userLoggedIn ? (
          <div className="flex space-x-4">
            <Link
              className="transform rounded-lg bg-blue-500 px-6 py-3 text-lg text-white transition-transform hover:scale-105 hover:bg-blue-600"
              href={"/home"}
            >
              Dashboard
            </Link>
            <Link
              className="transform rounded-lg border border-white bg-transparent px-6 py-3 text-lg transition-transform hover:scale-105 hover:bg-white hover:text-cyan-500"
              href={"/trending"}
            >
              Trending
            </Link>
          </div>
        ) : (
          <div className="flex space-x-4">
            <Link
              className="transform rounded-lg bg-blue-500 px-6 py-3 text-lg text-white transition-transform hover:scale-105 hover:bg-blue-600"
              href={"/auth/register"}
            >
              Register for Free
            </Link>
            <Link
              className="transform rounded-lg border border-white bg-transparent px-6 py-3 text-lg transition-transform hover:scale-105 hover:bg-white hover:text-cyan-500"
              href={"/auth/login"}
            >
              Login Now
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
