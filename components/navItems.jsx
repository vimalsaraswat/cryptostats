import NavItem from "./navItem";

export default function NavItems() {
  const items = [
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
      name: "LogOut",
      link: "/auth/logout",
    },
  ];
  return (
    <ul className="flex flex-col p-4 sm:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 sm:flex-row sm:space-x-8 sm:mt-0 sm:border-0 sm:bg-white dark:bg-gray-800 sm:dark:bg-gray-900 dark:border-gray-700">
      {items.map((item, i) => (
        <NavItem key={i} name={item.name} link={item.link} />
      ))}
    </ul>
  );
}
