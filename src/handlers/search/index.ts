import { RequestHandler, Request } from "express";

import { SearchQueryParams } from "./types";
import { constructAppStoreSearchOptions, searchAppStore } from "./appStore";
import { constructPlayStoreSearchOptions, searchPlayStore } from "./playStore";
import { sortAndFilterResults } from "./utils";

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
      appStoreOptions.searchTerm,
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
    if (error instanceof Error) {
      res.status(500).json({
        message: "Failed to search apps",
        error: error instanceof Error ? error.message : JSON.stringify(error),
      });
      next(error);
    }
  }
};

export default searchHandler;
