import express from "express";
import cors from "cors";

import searchHandler from "./handlers/search.ts";
import healthzHandler from "./handlers/healthz.ts";
import requestLogger from "./log/request.ts";
import errorLogger from "./log/error.ts";
import notFoundHandler from "./handlers/notFound.ts";

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
