import {
  getCountryCode,
  getLangForAppStore,
  sortAndFilterResults,
  convertPlayStoreAppDataToSearchResult,
  convertAppStoreAppDataToSearchResult,
} from "../../src/handlers/search/utils";
import { COUNTRY_CODES } from "../../src/handlers/search/constants";

describe("Utils", () => {
  describe("getCountryCode", () => {
    it("should return correct country code for valid country", () => {
      expect(getCountryCode("US")).toBe(COUNTRY_CODES.US);
      expect(getCountryCode("GB")).toBe(COUNTRY_CODES.GB);
    });

    it("should return US country code for invalid country", () => {
      expect(getCountryCode("XX")).toBe(COUNTRY_CODES.US);
    });

    it("should handle lowercase country codes", () => {
      expect(getCountryCode("us")).toBe(COUNTRY_CODES.US);
    });
  });

  describe("getLangForAppStore", () => {
    it("should return correct language code", () => {
      expect(getLangForAppStore("US")).toBe("en-us");
      expect(getLangForAppStore("GB")).toBe("en-gb");
    });

    it("should return default language code when no country provided", () => {
      expect(getLangForAppStore()).toBe("en-us");
    });
  });

  describe("sortAndFilterResults", () => {
    const mockResults = [
      { averageRating: 4.5, name: "App1" },
      { averageRating: 4.8, name: "App2" },
      { averageRating: 4.2, name: "App3" },
    ] as any[];

    it("should sort results by rating and limit to specified number", () => {
      const sorted = sortAndFilterResults(mockResults, [], 2);
      expect(sorted).toHaveLength(2);
      expect(sorted[0].averageRating).toBe(4.8);
      expect(sorted[1].averageRating).toBe(4.5);
    });
  });

  describe("convertPlayStoreAppDataToSearchResult", () => {
    const mockPlayStoreData = {
      title: "Test App",
      appId: "com.test.app",
      developer: "Test Dev",
      score: 4.5,
      icon: "icon.png",
      summary: "Test description",
    };

    it("should convert play store data correctly", () => {
      const result = convertPlayStoreAppDataToSearchResult(mockPlayStoreData);

      expect(result).toEqual({
        name: "Test App",
        bundleId: "com.test.app",
        developerName: "Test Dev",
        averageRating: 4.5,
        iconUrl: "icon.png",
        description: "Test description",
        store: "play-store",
      });
    });
  });

  describe("convertAppStoreAppDataToSearchResult", () => {
    const mockAppStoreData = {
      trackId: 123,
      trackName: "Test App",
      bundleId: "com.test.app",
      artistName: "Test Dev",
      version: "1.0.0",
      averageUserRating: 4.5,
      artworkUrl100: "icon.png",
      description: "Test description",
      country: "US",
    };

    it("should convert app store data correctly", () => {
      const result = convertAppStoreAppDataToSearchResult(mockAppStoreData);

      expect(result).toEqual({
        id: 123,
        name: "Test App",
        bundleId: "com.test.app",
        developerName: "Test Dev",
        version: "1.0.0",
        averageRating: 4.5,
        iconUrl: "icon.png",
        description: "Test description",
        country: "US",
        store: "app-store",
      });
    });
  });
});
