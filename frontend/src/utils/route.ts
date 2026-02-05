// utils/route.ts
export const buildUrl = (
  base: string,
  path: string,
  params?: Record<string, string>,
): string => {
  const url = `${base}${path}`;
  if (!params) return url;

  const searchParams = new URLSearchParams(params);
  return `${url}?${searchParams.toString()}`;
};

export const isExternalRoute = (url: string): boolean => {
  return url.startsWith("http://") || url.startsWith("https://");
};

export const getQueryParams = (): Record<string, string> => {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};

  params.forEach((value, key) => {
    result[key] = value;
  });

  return result;
};
