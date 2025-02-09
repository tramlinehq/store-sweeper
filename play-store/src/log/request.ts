import expressWinston from "express-winston";
import winston from "winston";
import loggerFormat from "./format.js";

const requestLogger = expressWinston.logger({
  transports: [new winston.transports.Console()],
  format: loggerFormat,
  meta: true,
  expressFormat: true,
  colorize: true,
});

export default requestLogger;
