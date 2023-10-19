import NavItem from "./navItem";
import { usePathname } from "next/navigation";

export default function NavItems({ userLoggedIn, closeMenu }) {
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
    <ul className="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium dark:border-gray-700 dark:bg-gray-800 sm:mt-0 sm:flex-row sm:space-x-8 sm:border-0 sm:bg-transparent sm:p-0">
      {items.map((item, i) => (
        <NavItem
          key={i}
          name={item.name}
          link={item.link}
          onClick={closeMenu}
          active={pathname === item.link}
        />
      ))}
    </ul>
  );
}
