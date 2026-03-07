// export const truncate = (str: string, max = 20) =>
//   str.length > max ? str.slice(0, max) + "…" : str;

export const stringUtils = {
  truncate: (str: string, max = 20) =>
    str.length > max ? str.slice(0, max) + "…" : str,
};
