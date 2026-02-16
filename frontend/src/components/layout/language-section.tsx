"use client";

import { IconCheck, IconLanguage } from "@/components/icons";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

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

interface LanguageSectionProps {
  languageKey?: string; // For customizing translation key, default: "Language"
}

export function LanguageSection({
  languageKey = "Language",
}: LanguageSectionProps) {
  const t = useTranslations("AppLayout"); // Can be changed to "AdminLayout" via parameter
  const [isUiTransitionPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const currentLanguage =
    languages.find((lang) => lang.code === locale) || languages[0];

  const handleLanguageChange = (nextLocale: string) => {
    const pathnameWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
    startTransition(() => {
      router.replace(`/${nextLocale}${pathnameWithoutLocale}`);
    });
  };

  return (
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
            {`${t(languageKey)}:`}
            <span className="capitalize">{currentLanguage.label}</span>
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
            {currentLanguage.code === language.code && <IconCheck />}
          </button>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
