import UsersHeader from "@/components/layout/users-header";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: {
    default: "Đọc Truyện",
    template: "%s | Đọc Truyện",
  },
  description: "Ứng dụng đọc truyện online",
  icons: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon.png",
    },
  ],
};

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-3 dark:bg-[#262626] min-h-screen">
      <UsersHeader />
      <div className="flex-1 overflow-hidden w-full py-6">{children}</div>
    </div>
  );
}
