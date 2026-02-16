"use client";

import { useLogoutMutation } from "@/features/auth/mutations";
import { usePathname, useRouter } from "@/i18n/navigation";
import { handleErrorApi } from "@/lib/error";
import { cn } from "@/lib/utils";
import { useConfirm } from "@/providers/confirm-provider";
import { useSidebar } from "@/providers/sidebar-provider";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { forwardRef, useMemo } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "../ui/popover";
import { Separator } from "../ui/separator";
import { Sheet, SheetContent } from "../ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { LanguageSection } from "./language-section";
import { ThemeSection } from "./theme-section";

const SidebarItem = forwardRef<
  HTMLDivElement,
  {
    href?: string;
    icon: React.ComponentType<any>;
    title: string;
    isActive?: boolean;
    isExpanded: boolean;
    onClick?: () => void;
    tooltipText?: string;
    showTooltip?: boolean;
  }
>(function SidebarItem(
  {
    href,
    icon: Icon,
    title,
    isActive,
    isExpanded,
    onClick,
    tooltipText,
    showTooltip = true,

    ...props // ⭐ VERY IMPORTANT
  },
  ref,
) {
  const className = cn(
    "h-10 flex items-center gap-3 rounded-lg text-muted-foreground transition-all",
    "hover:bg-accent hover:text-accent-foreground font-medium text-sm",
    isExpanded ? "px-3 py-2" : "px-2 py-2 w-10",
    isActive && "text-primary",
  );

  const content = (
    <>
      <Icon variant="default" color="custom" />
      {isExpanded && title}
    </>
  );

  if (href) {
    const linkItem = (
      <Link href={href} className={className}>
        {content}
      </Link>
    );

    if (showTooltip && !isExpanded) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{linkItem}</TooltipTrigger>
          <TooltipContent side="right">
            <p>{tooltipText || title}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return linkItem;
  }

  if (showTooltip && !isExpanded) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div ref={ref} {...props} onClick={onClick} className={className}>
            {content}
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{tooltipText || title}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div ref={ref} {...props} onClick={onClick} className={className}>
      {content}
    </div>
  );
});

export function AdminSidebar() {
  const t = useTranslations("AdminLayout");
  const router = useRouter();
  const pathname = usePathname();
  const { state, openMobile, setOpenMobile, isMobile, toggleSidebar } =
    useSidebar();

  const { mutateAsync: logout } = useLogoutMutation();
  const { confirm } = useConfirm();

  const processLogout = async () => {
    await logout();
    router.push("/");
  };

  const sidebarLinks = useMemo(
    () => [
      {
        title: t("Dashboard"),
        href: "/admin",
        icon: IconLayout,
      },
      {
        title: t("Tags"),
        href: "/admin/tags",
        icon: IconTag,
      },
      {
        title: t("Users"),
        href: "/admin/users",
        icon: IconUser,
      },
    ],
    [t],
  );

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

  const isExpanded = state === "expanded";

  const sidebarContent = (
    <div className="flex h-full flex-col gap-2 bg-background">
      {/* Sibar header - logo và button đóng mở sidebar */}
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
              size={isExpanded ? "xl" : "lg"}
            />

            {/* BUTTON OPEN (overlay) */}
            {state === "collapsed" && !isMobile && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={toggleSidebar}
                    className="absolute inset-1 flex items-center justify-center p-2 rounded-md hover:bg-accent cursor-pointer text-muted-foreground hover:text-accent-foreground"
                  >
                    <IconOpenSidebar className="absolute opacity-0 group-hover:opacity-100 transition" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{t("Open sidebar")}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* TEXT */}
          {isExpanded && (
            <span className="ml-4 font-medium text-lg">Admin</span>
          )}
        </div>

        {/* RIGHT BUTTON (CLOSE WHEN EXPANDED) */}
        {isExpanded && !isMobile && (
          <Tooltip>
            <TooltipTrigger asChild>
              <IconCloseSidebar
                className="cursor-pointer text-muted-foreground hover:text-accent-foreground"
                onClick={toggleSidebar}
              />
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{t("Close sidebar")}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      <nav className="grid gap-2 px-4 text-sm font-medium">
        {sidebarLinks.map((link) => (
          <SidebarItem
            key={link.href}
            href={link.href}
            icon={link.icon}
            title={link.title}
            isActive={pathname === link.href}
            isExpanded={isExpanded}
          />
        ))}
      </nav>

      {/* Logout button at bottom */}
      <div className="mt-auto px-4 pb-4 grid gap-2">
        {isMobile ? (
          <Dialog>
            <DialogTrigger asChild>
              <SidebarItem
                icon={IconSetting}
                title={t("Settings")}
                isExpanded={isExpanded}
                tooltipText={t("Settings")}
                showTooltip={false}
              />
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t("Settings")}</DialogTitle>
              </DialogHeader>
              <ThemeSection />
              <LanguageSection />
            </DialogContent>
          </Dialog>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <SidebarItem
                icon={IconSetting}
                title={t("Settings")}
                isExpanded={isExpanded}
                tooltipText={t("Settings")}
              />
            </PopoverTrigger>
            <PopoverContent align="start" className="p-0 w-64">
              <PopoverHeader className="px-4 py-3">
                <PopoverTitle>{t("Settings")}</PopoverTitle>
              </PopoverHeader>

              <Separator />

              <div className="py-2">
                <ThemeSection />
                <LanguageSection />
              </div>
            </PopoverContent>
          </Popover>
        )}
        <SidebarItem
          icon={IconLogout}
          title={t("Log out")}
          isExpanded={isExpanded}
          onClick={handleLogout}
          tooltipText={t("Log out")}
        />
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
