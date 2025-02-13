import express from "express";
import cors from "cors";

import { searchHandler, healthzHandler, notFoundHandler } from "./handlers";
import { requestLogger, errorLogger } from "./log";

const app = express();
const port = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

app.use(requestLogger); // NOTE: middleware for logging requests

const appRouter = express.Router();

// supported routes on the service
appRouter.get("/healthz", healthzHandler);
appRouter.get("/search", searchHandler);

app.use(appRouter);

app.use(notFoundHandler);

app.use(errorLogger); // NOTE: middleware for logging errors

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
