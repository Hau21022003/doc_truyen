import UsersHeader from "@/components/layout/users/users-header";
import React from "react";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center">
      <UsersHeader />
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
