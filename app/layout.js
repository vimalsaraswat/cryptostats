import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import Toast from "@/components/ui/Toast";
import { ToastProvider } from "@/utils/ToastContext";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CryptoStats",
  description:
    "Elevate your trading skills with real-time market data. Stay ahead of the game with our powerful analytics. No financial risk, just pure practice.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} flex h-screen w-screen flex-col justify-between  bg-[conic-gradient(at_left,_var(--tw-gradient-stops))] from-indigo-100 via-slate-400 to-indigo-100 text-stone-800 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-gray-700 dark:via-gray-900 dark:to-black dark:text-stone-300`}
      >
        <Header />
        <main className="flex grow flex-col items-center justify-center overflow-hidden">
          <ToastProvider>
            {children}
            <Toast />
          </ToastProvider>
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
