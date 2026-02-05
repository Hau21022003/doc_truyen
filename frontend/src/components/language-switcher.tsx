"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Define available languages with their properties
const languages = [
  {
    code: "en",
    name: "English",
    flagUrl: "/flags/united-states-of-america.png", // US flag for English
  },
  {
    code: "vi",
    name: "Tiếng Việt",
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
        <Button variant="outline" disabled={isPending}>
          <span className="mr-2">
            <Image
              className="w-6 h-6"
              src={currentLanguage.flagUrl}
              width={24}
              height={24}
              alt={`${currentLanguage.name} flag`}
            />
          </span>
          <span className="mr-2">{currentLanguage.code.toUpperCase()}</span>
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
              <span className="mr-2">
                <Image
                  className="w-6 h-6"
                  src={language.flagUrl}
                  width={24}
                  height={24}
                  alt={`${language.name} flag`}
                />
              </span>
              <span className="mr-2 font-medium">
                {language.code.toUpperCase()}
              </span>
              <span>{language.name}</span>
            </div>
            {locale === language.code && <span className="ml-2">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
