import { RequestHandler } from "express";

const healthzHandler: RequestHandler = (_, res) => {
  res.status(200).json({ message: "OK" });
};

export default healthzHandler;
