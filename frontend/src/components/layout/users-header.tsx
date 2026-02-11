"use client";
import {
  IconBookmark,
  IconHamburger,
  IconLogo,
  IconNotifcations,
} from "@/components/icons";
import LocalSwitcher from "@/components/language-switcher";
import { ModeToggle } from "@/components/mode-toggle-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthModal } from "@/features/auth/hooks/use-auth-modal.hook";
import { useLogoutMutation } from "@/features/auth/mutations";
import { useAuthStore } from "@/shared/stores";
import { generateAvatarUrl } from "@/shared/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Fragment, useMemo } from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

export default function UsersHeader() {
  const { isAuthenticated, isInitialized, user } = useAuthStore();
  const { openLoginModal, openRegisterModal, requireAuth } = useAuthModal();
  const { mutate: logout } = useLogoutMutation();
  const t = useTranslations("UserHeader");

  const links = useMemo(
    () => [
      { href: "/?status=end", label: t("Completed") },
      { href: "/?post_type=Manhwa", label: t("Manhwa") },
      { href: "/?post_type=Novel", label: t("Novel") },
      { href: "/?post_type=Manga", label: t("Manga") },
    ],
    [t],
  );

  return (
    <div className="h-18 w-full flex items-center justify-between max-w-6xl">
      <div className="flex items-center gap-4">
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
        <LocalSwitcher />
        <ModeToggle />

        {/* đã khởi tạo và chưa login */}
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

        {/* đã khởi tạo và đã login */}
        {isInitialized && isAuthenticated && (
          <Fragment>
            <IconNotifcations size={"lg"} />
            <IconBookmark size={"lg"} />
            {user && (
              <Avatar size="lg" onClick={() => logout()}>
                <AvatarImage
                  src={generateAvatarUrl(user.id, user.avatar)}
                  alt="@shadcn"
                />
                <AvatarFallback>{user.name}</AvatarFallback>
              </Avatar>
            )}
          </Fragment>
        )}

        <Sheet>
          <SheetTrigger>
            <IconHamburger
              variant={"default"}
              className="text-primary md:hidden"
            />
          </SheetTrigger>
          <SheetContent>
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
      </div>
    </div>
  );
}
