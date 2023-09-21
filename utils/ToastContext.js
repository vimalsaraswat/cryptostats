"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState(() => {
    // Retrieve stored toasts from localStorage when the app starts
    const storedToasts = JSON.parse(localStorage.getItem("toasts")) || [];
    return storedToasts;
  });

  useEffect(() => {
    // Save toasts to localStorage whenever they change
    localStorage.setItem("toasts", JSON.stringify(toasts));
  }, [toasts]);

  const addToast = (type, message, duration = 5, onRemove = null) => {
    const id = Date.now(); // Generate a unique ID for each toast

    const newToast = {
      id,
      type,
      message,
      duration,
      onRemove,
    };

    // Update the toasts array with the new toast
    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Automatically remove the toast after its duration
    setTimeout(() => {
      removeToast(id);
    }, duration * 1000);
  };

  const removeToast = (id) => {
    // Filter out the toast with the specified ID
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}
