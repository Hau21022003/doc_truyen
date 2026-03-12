export const numberUtils = {
  /**
   * Format number to compact form (K, M, B)
   * Example:
   * 1200 -> 1.2K
   * 1500000 -> 1.5M
   * 2000000000 -> 2B
   */
  formatCompactNumber(value: number, fractionDigits = 1): string {
    if (!value && value !== 0) return "";

    const abs = Math.abs(value);

    if (abs >= 1_000_000_000) {
      return (
        (value / 1_000_000_000).toFixed(fractionDigits).replace(/\.0$/, "") +
        "B"
      );
    }

    if (abs >= 1_000_000) {
      return (
        (value / 1_000_000).toFixed(fractionDigits).replace(/\.0$/, "") + "M"
      );
    }

    if (abs >= 1_000) {
      return (value / 1_000).toFixed(fractionDigits).replace(/\.0$/, "") + "K";
    }

    return value.toString();
  },

  /**
   * Format number with commas
   * Example:
   * 1000 -> 1,000
   * 1234567 -> 1,234,567
   */
  formatNumberWithCommas(value: number): string {
    if (!value && value !== 0) return "";
    return value.toLocaleString("en-US");
  },
};
