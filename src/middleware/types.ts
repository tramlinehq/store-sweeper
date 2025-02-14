import { JwtPayload } from "jsonwebtoken";

// NOTE: Extending Express Request to include our custom properties
declare module "express" {
  interface Request {
    isProduction?: boolean;
    claims?: JwtPayload;
  }
}
