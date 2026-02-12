"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { IconCheck } from "../icons";

// Define available languages with their properties
const languages = [
  {
    code: "en",
    flagUrl: "/flags/united-states-of-america.png", // US flag for English
  },
  {
    code: "vi",
    flagUrl: "/flags/vietnam.png", // Vietnam flag
  },
];

export default function LocalSwitcher() {
  const [isPending, startTransition] = useTransition();
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-2xl" disabled={isPending}>
          <span>
            <Image
              className="w-5 h-5"
              src={currentLanguage.flagUrl}
              width={24}
              height={24}
              alt={`${currentLanguage.code} flag`}
            />
          </span>
          <ChevronDown className="h-4 w-4" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center">
              <span className="mr-3">
                <Image
                  className="w-5 h-5"
                  src={language.flagUrl}
                  width={24}
                  height={24}
                  alt={`${language.code} flag`}
                />
              </span>
              <span className="font-medium">{language.code.toUpperCase()}</span>
            </div>
            {locale === language.code && <IconCheck size={"sm"} />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
