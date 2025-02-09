import { Request, RequestHandler } from "express";
import * as gplayDefault from "google-play-scraper";
const gplay = (gplayDefault as any).default as any;

type PriceOption = "all" | "free" | "paid";

interface SearchQueryParams {
  searchTerm?: string;
  numCount?: number;
  lang?: string;
  country?: string;
}

const searchHandler: RequestHandler = async (
  req: Request<any, any, any, SearchQueryParams, any>,
  res,
  next
) => {
  try {
    const {
      searchTerm,
      numCount = 20,
      lang = "en",
      country = "us",
    } = req.query;

    if (!searchTerm) {
      res.status(400).json({
        error: "Missing required parameter: searchTerm",
      });
      return;
    }

    const validNumCount = Math.min(Math.max(1, Number(numCount) || 20), 250);

    if (country && !/^[A-Za-z]{2}$/.test(country)) {
      res.status(400).json({
        error: "Invalid country parameter. Must be a two-letter country code",
      });
      return;
    }

    if (lang && !/^[A-Za-z]{2}$/.test(lang)) {
      res.status(400).json({
        error: "Invalid lang parameter. Must be a two-letter language code",
      });
      return;
    }

    const results = await gplay.search({
      term: searchTerm,
      num: validNumCount,
      lang,
      country,
      fullDetail: false,
      price: "all" as PriceOption,
    });

    res.json({
      results,
      metadata: {
        query: {
          term: searchTerm,
          num: validNumCount,
          lang,
          country,
          fullDetail: false,
          price: "all" as PriceOption,
        },
        count: results.length,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      next({
        status: 500,
        message: "Failed to search apps",
        error: error.message,
      });
    } else {
      next({
        status: 500,
        message: "An unknown error occurred",
        error: String(error),
      });
    }
  }
};

export default searchHandler;
