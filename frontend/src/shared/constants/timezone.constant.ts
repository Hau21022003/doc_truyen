export const Timezone = {
  AMERICA_NEW_YORK: "America/New_York",
  AMERICA_LOS_ANGELES: "America/Los_Angeles",
  EUROPE_LONDON: "Europe/London",
  EUROPE_PARIS: "Europe/Paris",
  ASIA_HO_CHI_MINH: "Asia/Saigon",
  ASIA_SINGAPORE: "Asia/Singapore",
  ASIA_TOKYO: "Asia/Tokyo",
} as const;

export const TIMEZONE_LABELS: Record<TimezoneValue, string> = {
  [Timezone.AMERICA_NEW_YORK]: "New York (EST/EDT)",
  [Timezone.AMERICA_LOS_ANGELES]: "Los Angeles (PST/PDT)",
  [Timezone.EUROPE_LONDON]: "London (GMT/BST)",
  [Timezone.EUROPE_PARIS]: "Paris (CET/CEST)",
  [Timezone.ASIA_HO_CHI_MINH]: "Ho Chi Minh City (ICT)",
  [Timezone.ASIA_SINGAPORE]: "Singapore (SGT)",
  [Timezone.ASIA_TOKYO]: "Tokyo (JST/JDT)",
};

export type TimezoneValue = (typeof Timezone)[keyof typeof Timezone];

export const TIMEZONE_VALUES = Object.values(Timezone);
