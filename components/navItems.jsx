import NavItem from "./navItem";
import { usePathname } from "next/navigation";

export default function NavItems({ userLoggedIn }) {
  const pathname = usePathname();

  const items = userLoggedIn
    ? [
        {
          name: "Home",
          link: "/home",
        },
        {
          name: "Trending",
          link: "/trending",
        },
        {
          name: "Buy",
          link: "/home/buy",
        },
        {
          name: "Sell",
          link: "/home/sell",
        },
        {
          name: "History",
          link: "/home/history",
        },
        {
          name: "LogOut",
          link: "/auth/logout",
        },
      ]
    : [
        {
          name: "Trending",
          link: "/trending",
        },
        {
          name: "Register",
          link: "/auth/register",
        },
        {
          name: "LogIn",
          link: "/auth/login",
        },
      ];
  return (
    <ul className="flex flex-col p-4 sm:p-0 mt-4 sm:bg-transparent font-medium border border-gray-100 rounded-lg bg-gray-50 sm:flex-row sm:space-x-8 sm:mt-0 sm:border-0 dark:bg-gray-800 dark:border-gray-700">
      {items.map((item, i) => (
        <NavItem
          key={i}
          name={item.name}
          link={item.link}
          active={pathname === item.link}
        />
      ))}
    </ul>
  );
}
