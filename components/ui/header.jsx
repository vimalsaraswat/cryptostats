import Logo from "@/components/logo";
import Nav from "@/components/nav";

export default function Header({ userLoggedIn }) {
  return (
    <header className="h-fit w-full border-b border-gray-400 bg-gray-300 bg-opacity-60 bg-clip-padding backdrop-blur-md backdrop-filter dark:border-gray-600 dark:bg-gray-800">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between gap-x-4 p-4 sm:justify-evenly sm:gap-y-4 lg:justify-between">
        <Logo />
        <Nav userLoggedIn={userLoggedIn} />
      </div>
    </header>
  );
}
