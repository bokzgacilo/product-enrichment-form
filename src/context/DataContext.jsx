"use client";
import { createContext, useContext, useState } from "react";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [data, setData] = useState([]);

  const value = {
    data,
    setData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error("useData must be used inside DataProvider");
  }
  return ctx;
}