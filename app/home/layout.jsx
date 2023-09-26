"use client";

import { useContext, useState, useEffect } from "react";
import { UserDataContext } from "@/utils/UserContext";
import Loading from "@/components/loading";

export default function HomeLayout({ children }) {
  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/user/data")
      .then((response) => response.text())
      .then((result) => {
        setData(JSON.parse(result).data);
      })
      .catch((error) => {
        console.error(error);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <Loading type="large" />
        <span className="sr-only">Loading</span>
      </>
    );
  }
  if (error) {
    return (
      <p>
        Something went wrong,
        <br />
        Try refreshing after some time.
      </p>
    );
  }

  return (
    <UserDataContext.Provider value={data}>{children}</UserDataContext.Provider>
  );
}
