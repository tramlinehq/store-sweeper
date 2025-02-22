import { constructPlayStoreSearchOptions } from "../../src/handlers/search/playStore";
import { Request } from "express";

jest.mock("google-play-scraper", () => ({
  search: jest.fn(),
}));

describe("Play Store", () => {
  describe("constructPlayStoreSearchOptions", () => {
    let mockReq: Partial<Request>;

    beforeEach(() => {
      mockReq = {
        query: {
          searchTerm: "test",
          numCount: "50",
          lang: "en",
          country: "us",
        },
      };
    });

    it("should construct valid options with all parameters", () => {
      const options = constructPlayStoreSearchOptions(mockReq as Request);

      expect(options).toEqual({
        term: "test",
        num: 50,
        lang: "en",
        country: "us",
        fullDetail: false,
        price: "all",
      });
    });

    it("should throw error when searchTerm is missing", () => {
      mockReq.query = {};

      expect(() => constructPlayStoreSearchOptions(mockReq as Request)).toThrow(
        "Missing required parameter: searchTerm"
      );
    });
  });
});
