"use client";

import {
  IconBookmark,
  IconCheck,
  IconHamburger,
  IconLanguage,
  IconLogo,
  IconLogout,
  IconMoon,
  IconNotifcations,
  IconSetting,
  IconSun,
  IconUser,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useAuthModal } from "@/features/auth/hooks/use-auth-modal.hook";
import { useLogoutMutation } from "@/features/auth/mutations";
import EditProfileModal from "@/features/users/components/edit-profile-modal";
import { useUpdateProfileMutation } from "@/features/users/mutations";
import { useEditProfileModalStore } from "@/features/users/stores/edit-profile-modal.store";
import { handleErrorApi } from "@/lib/error";
import { cn } from "@/lib/utils";
import { useConfirm } from "@/providers/confirm-provider";
import { useAuthStore } from "@/shared/stores";
import { generateAvatarUrl } from "@/shared/utils";
import { ChevronDownIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useMemo, useTransition } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "../ui/popover";
import { Separator } from "../ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Switch } from "../ui/switch";

const themes = ["light", "dark", "system"] as const;
const languages = [
  {
    code: "en",
    label: "English",
  },
  {
    code: "vi",
    label: "Tiếng Việt",
  },
] as const;

export default function UsersHeader() {
  const { isAuthenticated, isInitialized, user } = useAuthStore();
  const { openLoginModal, openRegisterModal, requireAuth } = useAuthModal();
  const { mutate: logout } = useLogoutMutation();
  const t = useTranslations("UserHeader");
  const { setTheme, theme } = useTheme();
  const { openModal } = useEditProfileModalStore();
  const {
    mutateAsync: updateNotifications,
    isPending: isUpdatingNotifications,
  } = useUpdateProfileMutation();

  const [isUiTransitionPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (nextLocale: string) => {
    const pathnameWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
    startTransition(() => {
      router.replace(`/${nextLocale}${pathnameWithoutLocale}`);
    });
  };

  // Find the current language object
  const currentLanguage =
    languages.find((lang) => lang.code === locale) || languages[0];

  const links = useMemo(
    () => [
      { href: "/?status=end", label: t("Completed") },
      { href: "/?post_type=Manhwa", label: t("Manhwa") },
      { href: "/?post_type=Novel", label: t("Novel") },
      { href: "/?post_type=Manga", label: t("Manga") },
    ],
    [t],
  );

  const { confirm } = useConfirm();
  const handleLogout = async () => {
    const confirmed = await confirm({
      title: t("Log out"),
      description: t("Are you sure you want to log out?"),
      confirmText: t("Log out"),
      cancelText: t("Cancel"),
    });

    if (confirmed) {
      logout();
    }
  };

  const handleNotificationToggle = (enabled: boolean) => {
    toast.promise(
      updateNotifications({
        updateData: { enableStoryNotifications: enabled },
      }),
      {
        loading: `${t("Updating notification settings")}...`,
        success: () => t("Notification settings updated"),
        error: (error) => {
          handleErrorApi({ error });
          return t("Failed to update notification settings");
        },
      },
    );
  };

  return (
    <Fragment>
      <div className="h-18 w-full flex items-center justify-between max-w-6xl">
        <div className="flex items-center gap-4">
          {/* Menu hambuger cho mobile */}
          <Sheet>
            <SheetTrigger>
              <IconHamburger
                variant={"default"}
                className="text-primary md:hidden"
              />
            </SheetTrigger>
            <SheetContent side="left">
              <nav
                className="flex flex-col gap-6 p-6 mt-8"
                aria-label="Main navigation"
              >
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-base hover:text-primary transition-colors uppercase font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" aria-label="Home">
            <IconLogo size="2xl" color="btn-primary" />
          </Link>
          <nav
            className="hidden md:flex items-center gap-4"
            aria-label="Main navigation"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base hover:text-primary transition-colors uppercase font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Hiển thị icon bookmark và thông báo */}
          {isInitialized && isAuthenticated && (
            <Fragment>
              <IconNotifcations size={"lg"} />
              <IconBookmark size={"lg"} />
            </Fragment>
          )}

          {/* Chưa đăng nhập: hiển thị nút cài đặt chung */}
          {/* Đăng nhập: hiển thị avatar */}
          <Popover>
            <PopoverTrigger asChild>
              {user ? (
                <div className="relative">
                  <Avatar size="lg" className="cursor-pointer">
                    <AvatarImage
                      src={generateAvatarUrl(user.id, user.avatar)}
                      alt={user.name}
                    />
                    <AvatarFallback>{user.name}</AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "absolute right-0 bottom-0 flex items-center justify-center",
                      "rounded-full h-3.5 w-3.5 bg-gray-200 dark:bg-[#262626] ring-3 ring-white dark:ring-[#0a0a0a] ",
                    )}
                  >
                    <ChevronDownIcon className="h-[0.8rem] w-[0.8rem]" />
                  </div>
                </div>
              ) : (
                <IconSetting size={"lg"} className="cursor-pointer" />
              )}
            </PopoverTrigger>
            <PopoverContent align="end" className="p-0">
              <PopoverHeader className="px-4 py-3">
                <PopoverTitle>{t("Settings")}</PopoverTitle>
              </PopoverHeader>

              {/* Edit Thông tin cá nhân  */}
              {isInitialized && isAuthenticated && (
                <Fragment>
                  <Separator />
                  <div className="py-1">
                    <button
                      onClick={openModal}
                      className={cn(
                        "inline-flex items-center gap-2 whitespace-nowrap ",
                        "w-full group py-2 px-4 text-sm font-medium transition-all cursor-pointer",
                        "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
                      )}
                    >
                      <IconUser />
                      {t("Profile")}
                    </button>

                    <div
                      className={cn(
                        "inline-flex items-center gap-2 whitespace-nowrap ",
                        "w-full group py-2 px-4 text-sm font-medium transition-all ",
                      )}
                    >
                      <IconNotifcations />
                      {t("Story Notifications")}
                      <Switch
                        disabled={isUpdatingNotifications}
                        checked={user?.enableStoryNotifications ?? true}
                        onCheckedChange={handleNotificationToggle}
                        className="ml-auto"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground ml-12 -mt-1 mb-2 mr-4">
                      {t(
                        "Get notified when followed stories release new chapters",
                      )}
                    </p>
                  </div>
                </Fragment>
              )}

              <Separator />

              {/* Theme - Language */}
              <div className="py-2">
                {/* Theme Options */}
                <Collapsible className="rounded-md">
                  <CollapsibleTrigger asChild>
                    <button
                      className={cn(
                        "inline-flex items-center justify-center gap-2 whitespace-nowrap ",
                        "w-full group py-2 px-4 text-sm font-medium transition-all cursor-pointer",
                        "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
                      )}
                    >
                      <div className="inline-flex items-center gap-x-2">
                        <IconSun className="h-[1.4rem] w-[1.4rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                        <IconMoon className="absolute h-[1.4rem] w-[1.4rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                        {`${t("Appearance")}:`}
                        {theme && (
                          <span className="capitalize">{t(theme)}</span>
                        )}
                      </div>
                      <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="flex flex-col items-start py-2 pt-0 text-sm">
                    {themes.map((themeOption) => (
                      <button
                        key={themeOption}
                        onClick={() => setTheme(themeOption)}
                        className={cn(
                          "inline-flex items-center gap-2 whitespace-nowrap ",
                          "w-full group py-2 px-4 text-sm transition-all cursor-pointer",
                          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
                          "group relative",
                        )}
                      >
                        <p className="ml-8 capitalize">{t(themeOption)} </p>
                        {theme === themeOption && <IconCheck />}
                      </button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                {/* Language Options */}
                <Collapsible className="rounded-md">
                  <CollapsibleTrigger asChild>
                    <button
                      className={cn(
                        "inline-flex items-center justify-center gap-2 whitespace-nowrap ",
                        "w-full group py-2 px-4 text-sm font-medium transition-all cursor-pointer",
                        "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
                      )}
                      disabled={isUiTransitionPending}
                    >
                      <div className="inline-flex items-center gap-x-2">
                        <IconLanguage className="h-[1.4rem] w-[1.4rem]" />
                        {`${t("Language")}:`}
                        <span className="capitalize">
                          {currentLanguage.label}
                        </span>
                      </div>
                      <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="flex flex-col items-start py-2 pt-0 text-sm">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className={cn(
                          "inline-flex items-center gap-2 whitespace-nowrap ",
                          "w-full group py-2 px-4 text-sm transition-all cursor-pointer",
                          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
                          "group relative",
                        )}
                      >
                        <p className="ml-8 capitalize">{language.label} </p>
                        {currentLanguage.code === language.code && (
                          <IconCheck />
                        )}
                      </button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </div>

              {/* Logout */}
              {isInitialized && isAuthenticated && (
                <Fragment>
                  <Separator />
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className={cn(
                        "inline-flex items-center gap-2 whitespace-nowrap ",
                        "w-full group py-2 px-4 text-sm font-medium transition-all cursor-pointer",
                        "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
                      )}
                    >
                      <IconLogout />
                      {t("Log out")}
                    </button>
                  </div>
                </Fragment>
              )}
            </PopoverContent>
          </Popover>

          {/* chưa login - nút đăng nhập, đăng ký */}
          {isInitialized && !isAuthenticated && (
            <Fragment>
              <Button
                onClick={openLoginModal}
                className="rounded-2xl cursor-pointer"
              >
                {t("Login")}
              </Button>
              <Button
                onClick={openRegisterModal}
                className="rounded-2xl hidden md:block cursor-pointer"
                variant={"outline"}
              >
                {t("Register")}
              </Button>
            </Fragment>
          )}
        </div>
      </div>
      <EditProfileModal />
    </Fragment>
  );
}
