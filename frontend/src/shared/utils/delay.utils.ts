/**
 * Creates a delay for a specified amount of milliseconds
 * Only executes in development environment
 * @param ms - The amount of time to delay in milliseconds
 * @returns Promise that resolves after the delay
 */
export const devDelay = (ms: number): Promise<void> => {
  if (process.env.NODE_ENV === "development") {
    console.log("Delay: ", ms);
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  // Return an immediately resolved promise for production
  return Promise.resolve();
};
