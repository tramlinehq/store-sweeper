import { Request, Response, NextFunction } from "express";
import { CONFIG } from "../config";

export const setEnv = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  req.isProduction = CONFIG.isProduction();
  next();
};
