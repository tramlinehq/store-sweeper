import expressWinston from "express-winston";
import winston from "winston";
import { LoggerMeta } from "./format.js";

const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.colorize(),
    winston.format.printf(({ level, message, timestamp, meta }) => {
      const logMeta = meta as LoggerMeta;
      return `${timestamp} ${level}: ${message}\n${
        logMeta?.error ? `Error: ${logMeta.error.stack || logMeta.error}\n` : ""
      }`;
    })
  ),
  meta: true,
});

export default errorLogger;
