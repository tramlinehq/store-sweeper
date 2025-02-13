import * as gplayDefault from "google-play-scraper";
import { Request } from "express";

import { Logger } from "../../log";
import {
  CountryCharCode,
  PlayStoreAppData,
  PlayStoreOptions,
  PriceOption,
  SearchQueryParams,
  SearchResult,
} from "./types";
import { convertPlayStoreAppDataToSearchResult } from "./utils";

const gplay = (gplayDefault as any).default as any;

export const constructPlayStoreSearchOptions = (
  req: Request<any, any, any, SearchQueryParams, any>
): PlayStoreOptions => {
  const {
    searchTerm,
    numCount = "20",
    lang = "en",
    country = "us",
  } = req.query;

  if (!searchTerm) {
    throw new Error("Missing required parameter: searchTerm");
  }

  const validNumCount = Math.min(
    Math.max(1, Number.isNaN(parseInt(numCount)) ? Number(numCount) : 10),
    250
  );

  if (country && !/^[A-Za-z]{2}$/.test(country)) {
    throw new Error(
      "Invalid country parameter. Must be a two-letter country code"
    );
  }

  if (lang && !/^[A-Za-z]{2}$/.test(lang)) {
    throw new Error(
      "Invalid lang parameter. Must be a two-letter language code"
    );
  }

  return {
    term: searchTerm,
    num: validNumCount,
    lang,
    country: country.toLowerCase() as Lowercase<CountryCharCode>,
    fullDetail: false,
    price: "all" as PriceOption,
  };
};

export const searchPlayStore = async (
  playStoreOptions: PlayStoreOptions
): Promise<SearchResult[]> => {
  try {
    const searchResults = (await gplay.search(
      playStoreOptions
    )) as PlayStoreAppData[];
    return searchResults.map(convertPlayStoreAppDataToSearchResult);
  } catch (error) {
    Logger.error("Failed to search App Store", {
      error,
      searchTerm: playStoreOptions.term,
    });
    throw error;
  }
};
