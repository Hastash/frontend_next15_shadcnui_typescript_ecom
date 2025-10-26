import { useState } from "react";

/**
 * Custom hook: useFilters
 * 
 * @param initialFilters - object chứa các field dùng để filter (VD: { name: "", description: "" })
 * @returns { filters, handleChange, resetFilters, setFilters }
 */
export function useFilters<T extends object>(initialFilters: T) {
  const [filters, setFilters] = useState<T>(initialFilters);
/** Cập nhật từng field trong filters */
  const handleChange = <K extends keyof T>(key: K, value: T[K]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };
  /** Reset filters về giá trị ban đầu */
  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return { filters, handleChange, resetFilters, setFilters };
}