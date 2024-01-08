"use client";

import React, { useState } from "react";
import { EyeCloseIcon, EyeIcon } from "./icons";
import { cn } from "@/lib/utils";

const Input = ({ type, className, ...props }) => {
  const inputClasses =
    "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500";

  if (type === "password") {
    const [showPass, setShowPass] = useState(false);
    return (
      <div className="relative sm:block">
        <input
          type={showPass ? "text" : "password"}
          className={cn(inputClasses, "box-border pr-10 ", className)}
          {...props}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onClick={() => setShowPass(!showPass)}
        >
          {showPass ? <EyeCloseIcon /> : <EyeIcon />}
        </button>
      </div>
    );
  }

  return (
    <input type={type} className={cn(inputClasses, className)} {...props} />
  );
};

export default Input;
