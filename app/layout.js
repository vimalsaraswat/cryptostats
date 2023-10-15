import "./globals.css";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import Header from "@/components/ui/header";
import Toast from "@/components/ui/Toast";
import { ToastProvider } from "@/utils/ToastContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CryptoStats",
  description:
    "Elevate your trading skills with real-time market data. Stay ahead of the game with our powerful analytics. No financial risk, just pure practice.",
};

export default function RootLayout({ children }) {
  let userLoggedIn = false;
  if (cookies().get("my-refresh-token")) {
    userLoggedIn = true;
  }

  return (
    <html lang="en">
      <body
        className={`${inter.className} flex h-screen w-screen flex-col justify-between  bg-[conic-gradient(at_left,_var(--tw-gradient-stops))] from-indigo-200 via-slate-600 to-indigo-200 text-stone-800 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-gray-700 dark:via-gray-900 dark:to-black dark:text-stone-300`}
      >
        <Header userLoggedIn={userLoggedIn} />
        <main className="flex grow flex-col items-center justify-center overflow-hidden">
          <ToastProvider>
            {children}
            <Toast />
          </ToastProvider>
        </main>
      </body>
    </html>
  );
}
