"use client";

import React, { useEffect } from "react";
import { useToast } from "@/utils/ToastContext";
import {
  SuccessIcon,
  ErrorIcon,
  WarningIcon,
  CloseIcon,
} from "@/components/icons";

export default function Toast() {
  const { toasts, removeToast } = useToast();

  useEffect(() => {
    // Handle toast removal when duration expires
    const timers = toasts?.map((toast) =>
      setTimeout(() => removeToast(toast.id), toast.duration * 1000),
    );

    return () => {
      // Clear timers on component unmount
      timers?.forEach((timer) => clearTimeout(timer));
    };
  }, [toasts, removeToast]);

  return (
    <div className="fixed bottom-0 right-0">
      {toasts?.map((toast) => (
        <div
          key={toast.id}
          className="animate-in slide-in-from-bottom-10 mb-4 flex w-full max-w-xs items-center rounded-lg bg-white p-4 text-gray-500 shadow duration-1000 dark:bg-gray-800 dark:text-gray-400"
          role="alert"
        >
          {toast.type === "success" && <SuccessIcon />}
          {toast.type === "error" && <ErrorIcon />}
          {toast.type === "warning" && <WarningIcon />}
          <div className="ml-3 text-sm font-normal">{toast.message}</div>
          <button
            onClick={() => removeToast(toast.id)}
            className="-mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span className="sr-only">Close</span>
            <CloseIcon />
          </button>
        </div>
      ))}
    </div>
  );
}
