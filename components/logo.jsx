import { Kalam } from "next/font/google";

const kalam = Kalam({ subsets: ["latin"], weight: "700" });

export default function Logo() {
  return (
    <div className={kalam.className}>
      <h1 className="text-2xl sm:text-4xl md:text-5xl mt-2 bg-gradient-to-r from-[#62B6B7] to-[#C147E9] bg-clip-text text-transparent">
        CRYPTO$TATS
      </h1>
    </div>
  );
}
