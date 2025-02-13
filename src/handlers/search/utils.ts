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
