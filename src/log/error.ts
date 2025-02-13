import expressWinston from "express-winston";
import winston from "winston";
import { LoggerMeta } from "./format";

const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.colorize(),
    winston.format.printf(({ level, message, timestamp, meta }) => {
      const logMeta = meta as LoggerMeta;
      let errorOutput = "";

      if (logMeta?.error && logMeta.error instanceof Error) {
        errorOutput += `Message: ${logMeta.error?.message}`;
      }

      if (logMeta?.req) {
        errorOutput += `\nRequest: ${logMeta.req.method} ${logMeta.req.originalUrl}`;
      }

      return `${timestamp} ${level}: ${message}\n${errorOutput}`;
    })
  ),
  meta: true,
});

export default errorLogger;
