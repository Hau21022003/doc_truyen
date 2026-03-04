import { useState } from "react";

export type UpsertMode = "create" | "edit";

export function useUpsertModal<T>() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<UpsertMode>("create");
  const [data, setData] = useState<T | null>(null);

  const openCreate = () => {
    setMode("create");
    setData(null);
    setIsOpen(true);
  };

  const openEdit = (value: T) => {
    setMode("edit");
    setData(value);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setData(null);
  };

  return {
    isOpen,
    mode,
    data,
    openCreate,
    openEdit,
    close,
  };
}
