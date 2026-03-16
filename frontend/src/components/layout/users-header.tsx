"use client";

import {
  IconArrowLeft,
  IconBookmark,
  IconHistory,
  IconLogo,
  IconLogout,
  IconNotifcations,
  IconSearch,
  IconSetting,
  IconUserFill,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useLogoutMutation } from "@/features/auth/auth.mutation";
import { useAuthModal } from "@/features/auth/hooks/use-auth-modal.hook";
import EditProfileModal from "@/features/users/components/edit-profile-modal";
import { useEditProfileModalStore } from "@/features/users/stores/edit-profile-modal.store";
import { useUpdateProfileMutation } from "@/features/users/use-update-profile.mutation";
import { useClickOutside, useIsMobile } from "@/hooks";
import { useRouter } from "@/i18n/navigation";
import { handleErrorApi } from "@/lib/error";
import { cn } from "@/lib/utils";
import { useConfirm } from "@/providers/confirm-provider";
import { useAuthStore } from "@/shared/stores";
import { generateAvatarUrl } from "@/shared/utils";
import { ChevronDownIcon, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "../ui/popover";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { LanguageSection } from "./language-section";
import { ThemeSection } from "./theme-section";

export default function UsersHeader() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchRef = useClickOutside<HTMLDivElement>(() => {
    if (isSearchOpen) setIsSearchOpen(false);
  });

  // Reset search query khi không còn param q
  useEffect(() => {
    const currentQ = searchParams.get("q");
    if (!currentQ) {
      setSearchQuery("");
    }
  }, [searchParams]);

  const { isAuthenticated, isInitialized, user } = useAuthStore();
  const { openLoginModal, requireAuth } = useAuthModal();
  const { mutate: logout } = useLogoutMutation();

  const tHeader = useTranslations("layout.UserHeader");
  const tCommon = useTranslations("common");
  const { openModal } = useEditProfileModalStore();
  const {
    mutateAsync: updateNotifications,
    isPending: isUpdatingNotifications,
  } = useUpdateProfileMutation();

  const { confirm } = useConfirm();
  const handleLogout = async () => {
    const confirmed = await confirm({
      title: tHeader("Log out"),
      description: tHeader("Are you sure you want to log out?"),
      confirmText: tHeader("Log out"),
      cancelText: tHeader("Cancel"),
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
        loading: `${tHeader("Updating notification settings")}...`,
        success: () => tHeader("Notification settings updated"),
        error: (error) => {
          handleErrorApi({ error });
          return tHeader("Failed to update notification settings");
        },
      },
    );
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      router.push(`/`);
      return;
    }

    router.push(`/?q=${encodeURIComponent(searchQuery)}`);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Fragment>
      {/* Mobile Search Overlay */}
      {isMobile && isSearchOpen && (
        <div
          ref={searchRef}
          className="fixed top-0 left-0 right-0 h-18 bg-background z-50 flex items-center px-4 gap-3 shadow-md"
        >
          <button onClick={() => setIsSearchOpen(false)} className="shrink-0">
            <IconArrowLeft size={"lg"} />
          </button>

          <InputGroup className="flex-1 rounded-2xl">
            <InputGroupInput
              placeholder={tHeader("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
          <Button
            onClick={handleSearch}
            className="bg-primary-orange text-primary-orange-foreground hover:bg-primary-orange hover:text-primary-orange-foreground"
          >
            {tCommon("actions.search")}
          </Button>
        </div>
      )}

      <div className="h-18 w-full flex items-center justify-between max-w-6xl">
        <div className="flex-1 flex items-center gap-4">
          <Link href="/" aria-label="Home">
            <IconLogo
              size="2xl"
              color="custom"
              className="text-primary-orange"
            />
          </Link>
          {!isMobile && (
            <InputGroup className="max-w-xs w-full rounded-2xl">
              <InputGroupInput
                placeholder={tHeader("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>

              <InputGroupAddon align="inline-end" className="pr-1">
                <div
                  onClick={handleSearch}
                  className="cursor-pointer w-7 h-7 rounded-full bg-primary-orange text-primary-orange-foreground [&_svg:not([class*='size-'])]:size-4 flex items-center justify-center"
                >
                  <IconSearch color="custom" />
                </div>
              </InputGroupAddon>
            </InputGroup>
          )}
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Hiển thị icon bookmark và thông báo */}
          {isMobile && (
            <>
              <button onClick={() => setIsSearchOpen(true)}>
                <IconSearch size={"lg"} />
              </button>

              <button>
                <IconHistory size={"lg"} />
              </button>

              <button>
                <IconBookmark size={"lg"} />
              </button>
            </>
          )}
          {!isMobile && (
            <>
              <button className="h-9 flex items-center gap-2 font-medium cursor-pointer">
                <IconHistory size={"lg"} />
                <p>{tHeader("history")}</p>
              </button>
              <button className="h-9 flex items-center gap-2 font-medium cursor-pointer">
                <IconBookmark size={"lg"} />
                <p>{tHeader("Bookmark")}</p>
              </button>
            </>
          )}

          {/* Chưa đăng nhập: hiển thị nút cài đặt chung */}
          {/* Đăng nhập: hiển thị avatar */}
          <Popover>
            <Tooltip>
              <TooltipTrigger asChild>
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
              </TooltipTrigger>
              <TooltipContent>
                <p>{tHeader("Settings")}</p>
              </TooltipContent>
            </Tooltip>

            <PopoverContent align="end" className="p-0">
              <PopoverHeader className="px-4 py-3">
                <PopoverTitle>{tHeader("Settings")}</PopoverTitle>
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
                      <IconUserFill />
                      {tHeader("Profile")}
                    </button>

                    <div
                      className={cn(
                        "inline-flex items-center gap-2 whitespace-nowrap ",
                        "w-full group py-2 px-4 text-sm font-medium transition-all ",
                      )}
                    >
                      <IconNotifcations />
                      {tHeader("Story Notifications")}
                      <Switch
                        disabled={isUpdatingNotifications}
                        checked={user?.enableStoryNotifications ?? true}
                        onCheckedChange={handleNotificationToggle}
                        className="ml-auto"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground ml-12 -mt-1 mb-2 mr-4">
                      {tHeader(
                        "Get notified when followed stories release new chapters",
                      )}
                    </p>
                  </div>
                </Fragment>
              )}

              <Separator />

              {/* Theme - Language */}
              <div className="py-2">
                <ThemeSection />
                <LanguageSection />
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
                      {tHeader("Log out")}
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
                {tHeader("Login")}
              </Button>
            </Fragment>
          )}
        </div>
      </div>
      <EditProfileModal />
    </Fragment>
  );
}
