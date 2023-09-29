import Link from "next/link";

export default function NavItem(props) {
  return (
    <li>
      <Link
        href={props.link}
        className="block sm:hover:scale-110 py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 sm:hover:bg-transparent sm:hover:text-blue-700 sm:p-0 sm:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
      >
        {props.name}
      </Link>
    </li>
  );
}
