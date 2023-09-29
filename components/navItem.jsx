import Link from "next/link";

export default function NavItem(props) {
  return (
    <li>
      <Link
        href={props.link}
        className={`${
          props.active
            ? "text-fuchsia-400 font-bold underline text-lg"
            : "text-gray-900 dark:text-white"
        } block scale-100 sm:hover:scale-110 py-2 pl-3 pr-4 rounded hover:bg-gray-100 sm:hover:bg-transparent sm:hover:text-blue-700 sm:p-0 sm:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700`}
      >
        {props.name}
      </Link>
    </li>
  );
}
