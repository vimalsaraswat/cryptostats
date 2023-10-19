import Link from "next/link";

export default function NavItem(props) {
  return (
    <li>
      <Link
        href={props.link}
        onClick={props.onClick}
        className={`${
          props.active
            ? "text-lg font-bold text-fuchsia-400 underline"
            : "text-gray-900 dark:text-white"
        } block scale-100 rounded py-2 pl-3 pr-4 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white sm:p-0 sm:hover:scale-110 sm:hover:bg-transparent sm:hover:text-blue-700 sm:dark:hover:text-blue-500 lg:dark:hover:bg-transparent`}
      >
        {props.name}
      </Link>
    </li>
  );
}
