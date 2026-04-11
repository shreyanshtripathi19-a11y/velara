"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface QuoteModalContextType {
  isOpen: boolean;
  product: string;
  category: string;
  open: (product?: string, category?: string) => void;
  close: () => void;
}

const QuoteModalContext = createContext<QuoteModalContextType>({
  isOpen: false,
  product: "",
  category: "",
  open: () => {},
  close: () => {},
});

export function QuoteModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState("");
  const [category, setCategory] = useState("");

  const open = (p = "", c = "") => {
    setProduct(p);
    setCategory(c);
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);

  return (
    <QuoteModalContext.Provider value={{ isOpen, product, category, open, close }}>
      {children}
    </QuoteModalContext.Provider>
  );
}

export const useQuoteModal = () => useContext(QuoteModalContext);
