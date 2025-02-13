import { RequestHandler, Request } from "express";

import { SearchQueryParams } from "./types.js";
import { constructAppStoreSearchOptions, searchAppStore } from "./appStore.js";
import {
  constructPlayStoreSearchOptions,
  searchPlayStore,
} from "./playStore.js";
import { sortAndFilterResults } from "./utils.js";

const searchHandler: RequestHandler = async (
  req: Request<any, any, any, SearchQueryParams, any>,
  res,
  next
) => {
  try {
    const appStoreOptions = constructAppStoreSearchOptions(req);
    const playStoreOptions = constructPlayStoreSearchOptions(req);

    const [playStoreSearchResults, appStoreSearchResults] = await Promise.all([
      searchPlayStore(playStoreOptions),
      searchAppStore(appStoreOptions),
    ]);

    const results = sortAndFilterResults(
      playStoreSearchResults,
      appStoreSearchResults,
      appStoreOptions.numCount
    );

    res.json({
      results,
      metadata: {
        query: {
          app_store: appStoreOptions,
          play_store: playStoreOptions,
        },
        count: results.length,
      },
    });
  } catch (error) {
    if (error) {
      next({
        status: 500,
        message: "Failed to search apps",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
};

export default searchHandler;
