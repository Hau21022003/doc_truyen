export const getWidthFromPopoverSize = (size?: "sm" | "md" | "lg" | "xl") => {
  switch (size) {
    case "sm":
      return "max-w-40";
    case "md":
      return "max-w-48";
    case "lg":
      return "max-w-64";
    case "xl":
      return "max-w-80";
    default:
      return undefined;
  }
};

const isSameDate = (a?: Date, b?: Date) =>
  a?.toDateString() === b?.toDateString();

export const isSameRange = (a: any, b: any) => {
  if (!a || !b) return false;
  return isSameDate(a.from, b.from) && isSameDate(a.to, b.to);
};
