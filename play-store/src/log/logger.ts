import winston from "winston";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
} as const;

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
} as const;

winston.addColors(colors);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
    winston.format.colorize({ all: true }),
    winston.format.errors({ stack: true }),
    winston.format.printf(
      (info) =>
        `${info.timestamp} ${info.level}: ${info.message}${
          info.stack ? "\n" + info.stack : ""
        }${
          Object.keys(info).some(
            (key) => !["timestamp", "level", "message", "stack"].includes(key)
          )
            ? "\n" + JSON.stringify(info, null, 2)
            : ""
        }`
    )
  ),
  transports: [new winston.transports.Console()],
});

const logWithMetadata = (level: string, message: string, metadata?: object) => {
  logger.log({
    level,
    message,
    ...(metadata || {}),
  });
};

export const Logger = {
  error: (message: string, metadata?: object) =>
    logWithMetadata("error", message, metadata),
  warn: (message: string, metadata?: object) =>
    logWithMetadata("warn", message, metadata),
  info: (message: string, metadata?: object) =>
    logWithMetadata("info", message, metadata),
  http: (message: string, metadata?: object) =>
    logWithMetadata("http", message, metadata),
  debug: (message: string, metadata?: object) =>
    logWithMetadata("debug", message, metadata),
  stream: {
    write: (message: string) => {
      logger.http(message.trim());
    },
  },
};

export type LoggerType = typeof Logger;
