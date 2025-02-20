import notFoundHandler from "../../src/handlers/notFound";
import { Request, Response } from "express";
import { SUPPORTED_ROUTES } from "../../src/handlers/notFound/constants";

describe("Not Found Handler", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jsonMock,
    };
    mockReq = {
      path: "/unknown",
    };
  });

  it("should return 404 with correct error message", () => {
    notFoundHandler(mockReq as Request, mockRes as Response, jest.fn());

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
      error: "Route not found",
      message: "The requested route /unknown is not supported",
      supportedRoutes: SUPPORTED_ROUTES,
    });
  });
});
