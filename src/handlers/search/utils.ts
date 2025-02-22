import { stringSimilarity } from "string-similarity-js";

import { COUNTRY_CODES } from "./constants";
import {
  AppStoreAppData,
  AppStoreLangCode,
  CountryCharCode,
  PlayStoreAppData,
  SearchResult,
} from "./types.js";

export const getCountryCode = (countryStr: string) => {
  const countryStrUpper = countryStr.toUpperCase();
  return (
    COUNTRY_CODES[countryStrUpper as CountryCharCode] || COUNTRY_CODES["US"]
  ); // Default to US
};

export const getLangForAppStore = (country?: string) => {
  if (!country) return "en-us";
  return `en-${(country as CountryCharCode).toLowerCase()}` as AppStoreLangCode;
};

export const sortAndFilterResults = (
  playStoreSearchResults: SearchResult[],
  appStoreSearchResults: SearchResult[],
  num: number
) => {
  const totalResults = [
    ...playStoreSearchResults,
    ...appStoreSearchResults,
  ].sort((a, b) => b.averageRating - a.averageRating);

  return totalResults.slice(0, num);
};

export const convertPlayStoreAppDataToSearchResult = (
  data: PlayStoreAppData
): SearchResult => ({
  name: data.title,
  bundleId: data.appId,
  developerName: data.developer,
  averageRating: data.score,
  iconUrl: data.icon,
  description: data.summary,
  store: "play-store",
});

export const convertAppStoreAppDataToSearchResult = (
  data: AppStoreAppData
): SearchResult => ({
  id: data.trackId,
  name: data.trackName,
  bundleId: data.bundleId,
  developerName: data.artistName,
  version: data.version,
  averageRating: data.averageUserRating,
  iconUrl: data.artworkUrl100,
  description: data.description,
  country: data.country,
  store: "app-store",
});

export const checkResultForKeywords =
  (searchTerm: string) =>
  (searchResult: SearchResult): boolean => {
    const termAppNameSimilarity = stringSimilarity(
      searchTerm,
      searchResult.name,
      searchTerm.length >= 2 && searchResult.name.length >= 2 ? 2 : 1
      // NOTE: the library uses bi-grams by default,
      // this just helps cover the edge case where
      // either the search term and/or the search result
      // data is of length < 2
    );

    const termAppDeveloperSimilarity = stringSimilarity(
      searchTerm,
      searchResult.developerName,
      searchTerm.length >= 2 && searchResult.developerName.length >= 2 ? 2 : 1
    );

    const termAppBundleIdSimilarity = stringSimilarity(
      searchTerm,
      searchResult.bundleId,
      searchTerm.length >= 2 && searchResult.bundleId.length >= 2 ? 2 : 1
    );

    // NOTE: we want to make sure that either the app name or the app
    // developer name is highly relevant to what the user is searching
    // for and hence, considering the max out of the two values covers this
    const maxSimilarity = Math.max(
      termAppDeveloperSimilarity,
      termAppNameSimilarity,
      termAppBundleIdSimilarity
    );

    return maxSimilarity >= 0.4;
  };
