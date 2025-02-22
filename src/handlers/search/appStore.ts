import { Request } from "express";

import {
  APP_STORE_LOOKUP_APP_ID_URL,
  REQUEST_TIMEOUT,
  APP_STORE_BASE_SEARCH_URL,
} from "./constants";
import { SearchQueryParams, AppStoreOptions, SearchResult } from "./types";
import {
  getLangForAppStore,
  getCountryCode,
  convertAppStoreAppDataToSearchResult,
} from "./utils";

export const constructAppStoreSearchOptions = (
  req: Request<any, any, any, SearchQueryParams, any>
): AppStoreOptions => {
  if (!req.query.searchTerm) {
    throw new Error("searchTerm query parameter is required");
  }

  const searchTerm = req.query.searchTerm;
  const country = req.query.country || "us";
  const numCount = parseInt(req.query.numCount || "50");
  const lang = getLangForAppStore(req.query.lang) || "en-us";

  if (Number.isNaN(numCount)) {
    throw new Error("resultCount query parameter must be an integer");
  }

  return {
    searchTerm,
    numCount,
    country: getCountryCode(country),
    lang,
  };
};

const lookupAppStoreById = async (ids: string[]): Promise<SearchResult[]> => {
  try {
    const lookupURL = `${APP_STORE_LOOKUP_APP_ID_URL}${ids.join(",")}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(lookupURL, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as any;
    return data.results.map(convertAppStoreAppDataToSearchResult);
  } catch (error) {
    throw error;
  }
};

export const searchAppStore = async (
  options: AppStoreOptions
): Promise<SearchResult[]> => {
  if (!options) {
    throw new Error("failed to perform search on app store - unknown error");
  }

  try {
    const searchURL = `${APP_STORE_BASE_SEARCH_URL}${encodeURIComponent(
      options.searchTerm
    )}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(searchURL, {
      headers: {
        "X-Apple-Store-Front": `${options.country},24 t:native`,
        "Accept-Language": options.lang,
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as any;
    const results = data.bubbles?.[0]?.results;

    if (!results?.length) {
      throw new Error(
        `no results found for search term: ${options.searchTerm}`
      );
    }

    const ids = results
      .slice(0, options.numCount)
      .map((result: { id: string }) => result.id);

    return await lookupAppStoreById(ids);
  } catch (error) {
    throw error;
  }
};
