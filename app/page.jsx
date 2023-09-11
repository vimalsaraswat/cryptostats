export default function Home() {
  return (
    <>
      <Hero />
    </>
  );
}

function Hero() {
  return (
    <section className="p-4">
      <h2 className="w-fit text-4xl md:text-6xl text-cyan-200 font-mono font-bold tracking-wider border-b">
        CryptoStats
      </h2>
      <p className="py-4 text-2xl sm:text-3xl text-purple-300">
        Your one stop solution <br />
        for practicing your trading skills
        <br /> with real market stats and <br />
        no money risk involved!
      </p>
    </section>
  );
}
