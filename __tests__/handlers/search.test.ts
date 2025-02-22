import searchHandler from "../../src/handlers/search";
import { Request, Response } from "express";
import * as appStore from "../../src/handlers/search/appStore";
import * as playStore from "../../src/handlers/search/playStore";

jest.mock("google-play-scraper", () => ({
  search: jest.fn(),
}));

jest.mock("../../src/handlers/search/appStore");
jest.mock("../../src/handlers/search/playStore");

describe("Search Handler", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonMock: jest.Mock;
  let nextMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    nextMock = jest.fn();
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jsonMock,
    };

    mockReq = {
      query: {
        searchTerm: "test",
        numCount: "50",
        lang: "en",
        country: "US",
      },
    };

    (appStore.searchAppStore as jest.Mock).mockResolvedValue([
      {
        name: "Test App 1",
        bundleId: "com.test.app1",
        developerName: "Test Dev",
        averageRating: 4.5,
        iconUrl: "icon1.png",
        description: "Test description",
        store: "app-store",
      },
    ]);

    (playStore.searchPlayStore as jest.Mock).mockResolvedValue([
      {
        name: "Test App 2",
        bundleId: "com.test.app2",
        developerName: "Test Dev",
        averageRating: 4.8,
        iconUrl: "icon2.png",
        description: "Test description",
        store: "play-store",
      },
    ]);

    (appStore.constructAppStoreSearchOptions as jest.Mock).mockReturnValue({
      searchTerm: "test",
      numCount: 50,
      country: 143441, // US code
      lang: "en-us",
    });

    (playStore.constructPlayStoreSearchOptions as jest.Mock).mockReturnValue({
      term: "test",
      num: 50,
      lang: "en",
      country: "us",
      fullDetail: false,
      price: "all",
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should handle successful search", async () => {
    await searchHandler(mockReq as Request, mockRes as Response, nextMock);

    expect(jsonMock).toHaveBeenCalledWith({
      results: expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(String),
          bundleId: expect.any(String),
          averageRating: expect.any(Number),
        }),
      ]),
      metadata: expect.objectContaining({
        query: expect.objectContaining({
          app_store: expect.any(Object),
          play_store: expect.any(Object),
        }),
        count: expect.any(Number),
      }),
    });
  });

  it("should handle search error", async () => {
    const error = new Error("Search failed");
    (appStore.searchAppStore as jest.Mock).mockRejectedValue(error);

    await searchHandler(mockReq as Request, mockRes as Response, nextMock);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      message: "Failed to search apps",
      error: "Search failed",
    });
    expect(nextMock).toHaveBeenCalledWith(error);
  });
});
