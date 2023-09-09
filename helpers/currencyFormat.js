export default function currencyFormat(value) {
  if (value >= 1) {
    let USDollar = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
    return USDollar.format(value);
  } else {
    return (
      "$" +
      // value
      //   .toFixed(20)
      //   .toString()
      //   .replace(/\.?0+$/, "")
      value.toFixed(20).match(/^-?\d*\.?0*\d{0,4}/)[0]
    );
  }
}
