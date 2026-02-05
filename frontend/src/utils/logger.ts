export const devLog = (tag: string, data: unknown) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[${tag}]: `, data);
  }
};
