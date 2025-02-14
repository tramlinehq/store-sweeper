export interface AuthConfig {
  secret: string;
  issuer: string;
  audience: string;
  files: {
    publicKeyPath: string;
    certFilePath: string;
  };
}

export interface AppConfig {
  appEnv: string;
  authConfig: AuthConfig;
  port: number;
}
