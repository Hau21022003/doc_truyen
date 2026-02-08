import { defineRouting } from "next-intl/routing";

export const SUPPORTED_LOCALES = ["en", "vi"] as const;

export const routing = defineRouting({
  locales: SUPPORTED_LOCALES as readonly string[],
  defaultLocale: "en",
});
