import healthzHandler from "../../src/handlers/healthz";
import { Request, Response } from "express";

describe("Health Check Handler", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jsonMock,
    };
    mockReq = {};
  });

  it("should return 200 OK", () => {
    healthzHandler(mockReq as Request, mockRes as Response, jest.fn());

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({ message: "OK" });
  });
});
