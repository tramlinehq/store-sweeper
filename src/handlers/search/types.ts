import { COUNTRY_CODES } from "./constants.js";

interface SearchQueryParams {
  searchTerm?: string;
  numCount?: string;
  lang?: string;
  country?: string;
}

type CountryCharCode = keyof typeof COUNTRY_CODES;
type CountryCode = (typeof COUNTRY_CODES)[CountryCharCode];

interface PlayStoreOptions {
  term: string;
  num: number;
  lang: "en" | string;
  country: Lowercase<CountryCharCode>;
  fullDetail: false;
  price: PriceOption;
}

type AppStoreLangCode = `en-${Lowercase<CountryCharCode>}`;

interface AppStoreOptions {
  searchTerm: string;
  numCount: number;
  lang: AppStoreLangCode;
  country: CountryCode;
}

type PriceOption = "all" | "free" | "paid";

interface AppStoreAppData {
  trackId: number;
  trackName: string;
  bundleId: string;
  artistName: string;
  version: string;
  averageUserRating: number;
  artworkUrl100: string;
  description: string;
  country: string;
}

interface PlayStoreAppData {
  title: string;
  appId: string;
  developer: string;
  score: number;
  icon: string;
  summary: string;
}

interface SearchResult {
  id?: number;
  name: string;
  bundleId: string;
  developerName: string;
  version?: string;
  averageRating: number;
  iconUrl: string;
  description: string;
  country?: string;
  appUrl?: string;
  store: "app-store" | "play-store";
}

export {
  SearchQueryParams,
  PlayStoreOptions,
  AppStoreOptions,
  PriceOption,
  AppStoreAppData,
  PlayStoreAppData,
  SearchResult,
  CountryCharCode,
  AppStoreLangCode,
};
