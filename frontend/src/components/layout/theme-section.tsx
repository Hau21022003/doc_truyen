"use client";

import { IconCheck, IconMoon, IconSun } from "@/components/icons";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

const themes = ["light", "dark", "system"] as const;

interface ThemeSectionProps {
  themeKey?: string;
}

export function ThemeSection({ themeKey = "Appearance" }: ThemeSectionProps) {
  const t = useTranslations("AppLayout");
  const { setTheme, theme } = useTheme();

  return (
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
            {`${t(themeKey)}:`}
            {theme && <span className="capitalize">{t(theme)}</span>}
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
  );
}
