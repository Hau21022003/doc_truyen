import UsersHeader from "@/components/layout/users-header";
import React from "react";

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
