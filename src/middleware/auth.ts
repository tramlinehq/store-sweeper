import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CONFIG } from "../config";
import { Logger } from "../log";
import { AuthConfig } from "../config/types";

async function verifyToken(
  authSecret: string,
  tokenString: string
): Promise<jwt.JwtPayload | null> {
  try {
    const token = await new Promise<jwt.JwtPayload>((resolve, reject) => {
      jwt.verify(
        tokenString,
        authSecret,
        {
          algorithms: ["HS256"],
        },
        (err, decoded) => {
          if (err) {
            reject(new Error(`Error verifying token: ${err.message}`));
          } else if (!decoded || typeof decoded === "string") {
            reject(new Error("Invalid token payload"));
          } else {
            resolve(decoded as jwt.JwtPayload);
          }
        }
      );
    });

    return token;
  } catch (error) {
    Logger.error("Token verification failed", { error });
    return null;
  }
}

async function checkTokenClaims(
  claims: JwtPayload
): Promise<JwtPayload | null> {
  try {
    // Verify expiration (exp)
    if (claims.exp && Date.now() >= claims.exp * 1000) {
      throw new Error("Token expired");
    }

    const { issuer, audience } = CONFIG.getConfigVar(
      "authConfig"
    ) as AuthConfig;

    // Verify issuer (iss)
    if (claims.issue !== issuer) {
      throw new Error("Invalid issuer");
    }

    // Verify audience (aud)
    if (claims.aud !== audience) {
      throw new Error("Invalid audience");
    }

    return claims;
  } catch (error) {
    Logger.error("Token claims verification failed", { error });
    return null;
  }
}

export const apiAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      res.status(401).json({ error: "Authorization header is missing" });
      return;
    }

    const prefix = "Bearer ";
    if (!authHeader.startsWith(prefix)) {
      res.status(401).json({ error: "Invalid authorization format" });
      return;
    }

    const { secret } = CONFIG.getConfigVar("authConfig") as AuthConfig;
    const tokenString = authHeader.slice(prefix.length);

    verifyToken(secret, tokenString)
      .then((token) => {
        if (!token) {
          res.status(401).json({ error: "Invalid token" });
          return;
        }

        return checkTokenClaims(token);
      })
      .then((claims) => {
        if (!claims) {
          res.status(401).json({ error: "Invalid token claims" });
          return;
        }

        req.claims = claims;
        next();
      })
      .catch((error) => {
        Logger.error("Auth middleware error", { error: error.message });
        res.status(401).json({ error: error.message });
      });
  } catch (error) {
    Logger.error("Auth middleware error", { error });
    res.status(401).json({ error: "Authentication failed" });
  }
};
