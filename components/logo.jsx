import { Kalam } from "next/font/google";
import Link from "next/link";

const kalam = Kalam({ subsets: ["latin"], weight: "700" });

export default function Logo() {
  return (
    <Link href="/" className={kalam.className}>
      <h1 className="mt-2 bg-gradient-to-r from-[#62B6B7] to-[#C147E9] bg-clip-text text-2xl text-transparent sm:text-4xl md:text-5xl">
        CRYPTO$TATS
      </h1>
    </Link>
  );
}
