import UsersHeader from "@/components/layout/users/users-header";
import React from "react";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-3">
      <UsersHeader />
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
