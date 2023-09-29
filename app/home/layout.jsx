"use client";

import useSWR from "swr";
import { UserDataContext } from "@/utils/UserContext";
import Loading from "@/components/loading";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function HomeLayout({ children }) {
  const { data, error, isLoading } = useSWR("/api/user/data", fetcher);

  if (error)
    return (
      <div>
        <p>
          Something went wrong,
          <br />
          Try refreshing after some time.
        </p>
      </div>
    );
  if (isLoading) return <Loading type="large" />;

  return (
    <UserDataContext.Provider value={data.data}>
      {children}
    </UserDataContext.Provider>
  );
}
