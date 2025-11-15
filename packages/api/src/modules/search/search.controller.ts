import { Request, Response } from "express";
import asyncHandler from "../../core/utils/asyncHandler";
import { searchService } from "./search.service";

class SearchController {
  public globalSearch = asyncHandler(async (req: Request, res: Response) => {
    const { query } = req.query;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ message: "پارامتر جستجو الزامی است." });
    }

    const results = await searchService.globalSearch(query.trim());

    res.status(200).json({
      query: query.trim(),
      totalResults: results.total,
      results: results.data,
    });
  });
}

export const searchController = new SearchController();
