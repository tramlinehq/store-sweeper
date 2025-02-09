import winston from "winston";

export interface LoggerMeta {
  req?: {
    method?: string;
    url?: string;
    query?: Record<string, any>;
  };
  res?: {
    statusCode?: number;
  };
  responseTime?: number;
  error?: Error;
}

const loggerFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.colorize(),
  winston.format.printf(({ level, message, timestamp, meta }) => {
    const logMeta = meta as LoggerMeta;
    const statusCode = logMeta?.res?.statusCode;
    const method = logMeta?.req?.method;
    const url = logMeta?.req?.url;
    const responseTime = logMeta?.responseTime;

    return `${timestamp} ${level}: ${method} ${url} ${statusCode} ${responseTime}ms\n${
      Object.keys(logMeta?.req?.query || {}).length > 0
        ? `Query Params: ${JSON.stringify(logMeta?.req?.query, null, 2)}\n`
        : ""
    }`;
  })
);

export default loggerFormat;
