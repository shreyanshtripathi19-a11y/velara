"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface DrawerContextType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

const DrawerContext = createContext<DrawerContextType>({
  isOpen: false,
  toggle: () => {},
  close: () => {},
});

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((p) => !p);
  const close = () => setIsOpen(false);
  return (
    <DrawerContext.Provider value={{ isOpen, toggle, close }}>
      {children}
    </DrawerContext.Provider>
  );
}

export const useDrawer = () => useContext(DrawerContext);
