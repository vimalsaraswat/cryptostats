export default async function first({ params }) {
  const coin = params.coinId;

  return (
    <main>
      <h2>{coin}</h2>
    </main>
  );
}
