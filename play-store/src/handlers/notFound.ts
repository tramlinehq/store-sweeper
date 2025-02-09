import { RequestHandler } from "express";
import { SUPPORTED_ROUTES } from "./constants.ts";

const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `The requested route ${req.path} is not supported`,
    supportedRoutes: SUPPORTED_ROUTES,
  });
};

export default notFoundHandler;
