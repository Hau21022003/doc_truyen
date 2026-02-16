"use client";

import { IconHamburger } from "@/components/icons";
import { useSidebar } from "@/providers/sidebar-provider";

export function AdminHeader() {
  const { toggleSidebar } = useSidebar();

  // Chỉ hiển thị trên di động
  return (
    <header className="sticky top-0 z-30 flex h-12 items-center gap-4 border-b bg-background px-4 md:hidden">
      {/* Nút toggle sidebar chỉ hiển thị trên di động */}
      <button className="cursor-pointer">
        <IconHamburger aria-label="Toggle menu" onClick={toggleSidebar} />
      </button>

      <p className="text-sm font-medium">Đọc truyện</p>

      <div className="flex-1" />

      {/* Phần bên phải của header nếu cần */}
    </header>
  );
}
