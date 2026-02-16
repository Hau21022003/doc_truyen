"use client";

import { useLogoutMutation } from "@/features/auth/mutations";
import { usePathname, useRouter } from "@/i18n/navigation";
import { handleErrorApi } from "@/lib/error";
import { cn } from "@/lib/utils";
import { useConfirm } from "@/providers/confirm-provider";
import { useSidebar } from "@/providers/sidebar-provider";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { toast } from "sonner";
import {
  IconCloseSidebar,
  IconLayout,
  IconLogo,
  IconLogout,
  IconOpenSidebar,
  IconSetting,
  IconTag,
  IconUser,
} from "../icons";
import { Sheet, SheetContent } from "../ui/sheet";

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: IconLayout,
  },
  {
    title: "Tags",
    href: "/admin/tags",
    icon: IconTag,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: IconUser,
  },
];

export function AdminSidebar() {
  const t = useTranslations("AdminLayout");
  const router = useRouter();
  const pathname = usePathname();
  const { state, open, openMobile, setOpenMobile, isMobile, toggleSidebar } =
    useSidebar();

  const { mutateAsync: logout } = useLogoutMutation();
  const { confirm } = useConfirm();

  const processLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleLogout = async () => {
    const confirmed = await confirm({
      title: t("Log out"),
      description: t("Are you sure you want to log out?"),
      confirmText: t("Log out"),
      cancelText: t("Cancel"),
    });

    if (confirmed) {
      toast.promise(processLogout(), {
        loading: `${t("Logging out")}...`,
        success: () => t("Logged out successfully"),
        error: (error) => {
          handleErrorApi({ error });
          return t("Logout failed");
        },
      });
    }
  };

  const sidebarContent = (
    <div className="flex h-full flex-col gap-2 bg-background">
      <div className={cn("flex items-center justify-between px-4 lg:h-20")}>
        {/* LEFT */}
        <div className="flex items-center">
          {/* LOGO AREA */}
          <div className="group relative flex h-10 w-10 items-center justify-center">
            {/* LOGO */}
            <IconLogo
              className={cn(
                `text-primary-orange  transition-all`,
                state === "collapsed" && "group-hover:opacity-0",
              )}
              size={state === "expanded" ? "xl" : "lg"}
            />

            {/* BUTTON OPEN (overlay) */}
            {state === "collapsed" && !isMobile && (
              <button
                onClick={toggleSidebar}
                className="absolute inset-1 flex items-center justify-center p-2 rounded-md hover:bg-accent cursor-pointer"
              >
                <IconOpenSidebar
                  className={cn(
                    "text-gray-600 dark:text-gray-400 hover:text-primary",
                    "absolute opacity-0 group-hover:opacity-100 transition",
                  )}
                  title={t("Open sidebar")}
                />
              </button>
            )}
          </div>

          {/* TEXT */}
          {state === "expanded" && (
            <span className="ml-4 font-medium text-lg">Admin</span>
          )}
        </div>

        {/* RIGHT BUTTON (CLOSE WHEN EXPANDED) */}
        {state === "expanded" && !isMobile && (
          <IconCloseSidebar
            className="cursor-pointer text-gray-600 dark:text-gray-400 hover:dark:text-primary"
            title={t("Close sidebar")}
            onClick={toggleSidebar}
          />
        )}
      </div>

      <nav className="grid gap-2 px-4 text-sm font-medium">
        {sidebarLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "h-10 flex items-center gap-3 rounded-lg text-muted-foreground transition-all",
              "hover:bg-accent hover:text-accent-foreground",
              state === "expanded" ? "px-3 py-2" : "px-2 py-2 w-10",
              pathname === link.href && "text-primary",
            )}
          >
            <link.icon
              variant={"default"}
              color="custom"
              title={t(link.title)}
            />
            {state === "expanded" && t(link.title)}
          </Link>
        ))}
      </nav>

      {/* Logout button at bottom */}
      <div className="mt-auto px-4 pb-4 grid gap-2">
        <button
          onClick={handleLogout}
          className={cn(
            "h-10 w-full flex items-center gap-3 rounded-lg text-muted-foreground transition-all",
            "hover:bg-accent hover:text-accent-foreground font-medium",
            state === "expanded" ? "px-3 py-2" : "px-2 py-2 w-10",
          )}
        >
          <IconSetting
            variant={"default"}
            color="custom"
            title={t("Settings")}
          />
          {state === "expanded" && t("Settings")}
        </button>

        <button
          onClick={handleLogout}
          className={cn(
            "h-10 w-full flex items-center gap-3 rounded-lg text-muted-foreground transition-all",
            "hover:bg-accent hover:text-accent-foreground font-medium",
            state === "expanded" ? "px-3 py-2" : "px-2 py-2 w-10",
          )}
        >
          <IconLogout variant={"default"} color="custom" title={t("Log out")} />
          {state === "expanded" && t("Log out")}
        </button>
      </div>
    </div>
  );

  // 📱 MOBILE → SHEET
  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side="left" className="p-0 pt-6 w-64">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    );
  }

  // 🖥 DESKTOP → NORMAL SIDEBAR
  return (
    <aside
      className={cn(
        "hidden md:block border-r transition-all duration-300",
        state === "expanded" ? "w-64" : "w-20",
      )}
    >
      {sidebarContent}
    </aside>
  );
}
