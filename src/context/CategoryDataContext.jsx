"use client";
import { createContext, useContext, useState } from "react";

const CategoryDataContext = createContext(null);

export function CategoryDataProvider({ children }) {
  const [data, setData] = useState([]);

  const handleChange = (index, field, value) => {
    const updated = [...data];
    updated[index][field] = value;
    setData(updated);
  };

  const value = {
    data,
    setData,
    handleChange,
  };

  return <CategoryDataContext.Provider value={value}>{children}</CategoryDataContext.Provider>;
}

export function useCategoryData() {
  const ctx = useContext(CategoryDataContext);
  if (!ctx) {
    throw new Error("useCategoryData must be used inside CategoryDataProvider");
  }
  return ctx;
}