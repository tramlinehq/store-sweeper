import winston from "winston";

export interface LoggerMeta {
  error?: Error;
  level?: string;
  message?: string;
  stack?: string;
  exception?: boolean;
  date?: string;
  process?: {
    pid: number;
    uid: number;
    gid: number;
    cwd: string;
    execPath: string;
    version: string;
    argv: string[];
    memoryUsage: Record<string, any>;
  };
  os?: {
    loadavg: number[];
    uptime: number;
  };
  trace?: any[];
  req?: {
    url: string;
    headers: Record<string, any>;
    method: string;
    httpVersion: string;
    originalUrl: string;
    query: Record<string, any>;
  };
  res?: {
    statusCode: number;
  };
  responseTime?: number;
}

const loggerFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.colorize(),
  winston.format.printf(({ level, message, timestamp, meta }) => {
    const logMeta = meta as LoggerMeta;
    const statusCode = logMeta?.res?.statusCode || "-";
    const method = logMeta?.req?.method || "-";
    const url = logMeta?.req?.url || logMeta?.req?.originalUrl || "-";
    const responseTime = logMeta?.responseTime || "-";

    let output = `${timestamp} ${level}: ${method} ${url} ${statusCode} ${responseTime}ms`;

    if (logMeta?.req?.query && Object.keys(logMeta.req.query).length > 0) {
      output += `\nQuery Params: ${JSON.stringify(logMeta.req.query, null, 2)}`;
    }

    if (logMeta?.res?.statusCode) {
      output += `\nStatus Code: ${logMeta.res.statusCode}`;
    }

    return output + "\n";
  })
);

export default loggerFormat;
