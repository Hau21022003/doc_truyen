// src/components/layout/admin/admin-sidebar.tsx
import { IconLogo } from "@/components/icons/icon-logo";
import { LayoutDashboard, Users, BookOpen, Settings } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Stories",
    href: "/admin/stories",
    icon: BookOpen,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  return (
    <aside className="hidden w-64 border-r bg-background md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-6 lg:h-[60px]">
          <IconLogo className="h-8 w-8 text-primary" />
          <span className="ml-2 font-bold text-xl">Admin</span>
        </div>

        <div className="flex-1">
          <nav className="grid items-start px-4 text-sm font-medium">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  "hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
