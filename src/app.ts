import express from "express";
import cors from "cors";
import https from "https";
import fs from "fs";

import { searchHandler, healthzHandler, notFoundHandler } from "./handlers";
import { requestLogger, errorLogger } from "./log";
import { apiAuthMiddleware, setEnv } from "./middleware";
import { CONFIG } from "./config";

const app = express();
const port = CONFIG.getConfigVar("port");

app.use(cors());

app.use(requestLogger); // NOTE: middleware for logging requests

const appRouter = express.Router();

// supported routes on the service
appRouter.get("/healthz", healthzHandler);
appRouter.get("/search", setEnv, apiAuthMiddleware, searchHandler);
appRouter.get("/tsearch", searchHandler);

app.use(appRouter);

app.use(notFoundHandler);

app.use(errorLogger); // NOTE: middleware for logging errors

if (!CONFIG.isProduction()) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
} else {
  const httpsOptions = {
    cert: fs.readFileSync(CONFIG.get().authConfig.files.certFilePath),
    key: fs.readFileSync(CONFIG.get().authConfig.files.publicKeyPath),
  };

  https.createServer(httpsOptions, app).listen(CONFIG.get().port, () => {
    console.log(`Secure server running on port ${CONFIG.get().port}`);
  });
}
