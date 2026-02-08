"use client";
import { IconLogo } from "@/components/icons";
import IconBookmark from "@/components/icons/icon-bookmark";
import IconNotifcations from "@/components/icons/icon-notifcations";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/shared/stores";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React, { Fragment } from "react";

export default function UsersHeader() {
  const { isAuthenticated, isInitialized, user } = useAuthStore();
  const t = useTranslations("UserHeader");
  return (
    <div className="h-18 w-full flex items-center justify-between max-w-6xl">
      <div className="flex items-center gap-4">
        <Link href={"/"}>
          <IconLogo size={"2xl"} color="btn-primary" />
        </Link>

        <Link href={"/?status=end"} className="text-base">
          {t("Completed")}
        </Link>

        <Link href={"/?post_type=Manhwa"} className="text-base">
          {t("Manhwa")}
        </Link>

        <Link href={"/?post_type=Novel"} className="text-base">
          {t("Novel")}
        </Link>

        <Link href={"/?post_type=Manga"} className="text-base">
          {t("Manga")}
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {/* đã khởi tạo và chưa login */}
        {isInitialized && !isAuthenticated && (
          <Fragment>
            <Button className="rounded-2xl">{t("Login")}</Button>
            <Button className="rounded-2xl" variant={"outline"}>
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
              <Avatar size="lg">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                  className="grayscale"
                />
                <AvatarFallback>{user.name}</AvatarFallback>
              </Avatar>
            )}
          </Fragment>
        )}
      </div>
    </div>
  );
}
