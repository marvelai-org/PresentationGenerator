// src/lib/utils/logger.ts
export const logger = {
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log(`[INFO] ${message}`, data ? data : "");
    }
  },
  error: (message: string, error?: any) => {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error(`[ERROR] ${message}`, error ? error : "");
    }
    // In production, we could send errors to a monitoring service
    // Example: sendToErrorMonitoring(message, error);
  },
  warn: (message: string, data?: any) => {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.warn(`[WARN] ${message}`, data ? data : "");
    }
  },
};
