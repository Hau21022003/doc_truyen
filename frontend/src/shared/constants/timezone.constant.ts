export const Timezone = {
  UTC: "UTC",
  AMERICA_NEW_YORK: "America/New_York",
  AMERICA_LOS_ANGELES: "America/Los_Angeles",
  EUROPE_LONDON: "Europe/London",
  EUROPE_PARIS: "Europe/Paris",
  ASIA_HO_CHI_MINH: "Asia/Ho_Chi_Minh",
  ASIA_SINGAPORE: "Asia/Singapore",
  ASIA_TOKYO: "Asia/Tokyo",
} as const;

export type TimezoneValue = (typeof Timezone)[keyof typeof Timezone];

export const TIMEZONE_VALUES = Object.values(Timezone);
