import { constructAppStoreSearchOptions } from "../../src/handlers/search/appStore";
import { Request } from "express";

describe("App Store", () => {
  describe("constructAppStoreSearchOptions", () => {
    let mockReq: Partial<Request>;

    beforeEach(() => {
      mockReq = {
        query: {
          searchTerm: "test",
          numCount: "50",
          country: "US",
          lang: "us",
        },
      };
    });

    it("should construct valid options with all parameters", () => {
      const options = constructAppStoreSearchOptions(mockReq as Request);

      expect(options).toEqual({
        searchTerm: "test",
        numCount: 50,
        country: 143441, // US country code
        lang: "en-us",
      });
    });

    it("should throw error when searchTerm is missing", () => {
      mockReq.query = {};

      expect(() => constructAppStoreSearchOptions(mockReq as Request)).toThrow(
        "searchTerm query parameter is required"
      );
    });
  });
});
