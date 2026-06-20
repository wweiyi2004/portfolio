import type { Locale, Localized } from "../data/site";

export function t(value: Localized, locale: Locale): string {
  return value[locale];
}

export const DEFAULT_LOCALE: Locale = "zh";
