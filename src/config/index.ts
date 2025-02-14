import dotenv from "dotenv";
import { AppConfig } from "./types";
import { Logger } from "../log";

class Config {
  private config: AppConfig;

  constructor() {
    const result = dotenv.config();

    if (result.error) {
      Logger.error("Error loading .env file", { error: result.error });
      throw result.error;
    }

    this.config = {
      appEnv: this.getEnv("ENV", "development"),
      authConfig: {
        secret: this.getEnv("AUTH_SECRET", ""),
        issuer: this.getEnv("AUTH_ISSUER", ""),
        audience: this.getEnv("AUTH_AUDIENCE", ""),
        files: {
          publicKeyPath: this.getEnv("AUTH_PUBLIC_KEY", ""),
          certFilePath: this.getEnv("AUTH_CERT_FILE", ""),
        },
      },
      port: parseInt(this.getEnv("PORT", "8081")),
    };
  }

  private getEnv(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue;
  }

  public get(): AppConfig {
    return this.config;
  }

  public isProduction(): boolean {
    return this.config.appEnv === "production";
  }

  public getConfigVar(key: keyof AppConfig) {
    return this.config[key];
  }
}

export const CONFIG = new Config();
