import { TagUsageModel } from "./tagUsage.model";
import { ITagUsage } from "common-types";
import { Types } from "mongoose";

class TagService {
  // Parse tags from text (e.g., #education #health)
  public parseTagsFromText(text: string): string[] {
    const tagRegex = /#(\w+)/g;
    const matches = text.match(tagRegex);

    if (!matches || matches.length === 0) {
      return [];
    }

    // Remove # and normalize
    return matches.map((tag) => tag.substring(1).toLowerCase());
  }

  // Record tag usage
  public async recordTagUsage(tag: string, needId: string): Promise<ITagUsage> {
    const normalizedTag = tag.toLowerCase().trim();

    // Find or create tag
    let tagUsage = await TagUsageModel.findOne({ normalizedTag });

    if (tagUsage) {
      // Update existing
      tagUsage.usageCount += 1;
      tagUsage.lastUsedAt = new Date();

      // Add need if not already in array
      if (!tagUsage.relatedNeeds.some((id) => id.toString() === needId)) {
        tagUsage.relatedNeeds.push(new Types.ObjectId(needId) as any);
      }

      await tagUsage.save();
    } else {
      // Create new
      tagUsage = await TagUsageModel.create({
        tag,
        normalizedTag,
        usageCount: 1,
        relatedNeeds: [new Types.ObjectId(needId)],
        lastUsedAt: new Date(),
      });
    }

    return tagUsage;
  }

  // Get popular tags
  public async getPopularTags(limit: number = 20): Promise<ITagUsage[]> {
    return TagUsageModel.find()
      .sort({ usageCount: -1, lastUsedAt: -1 })
      .limit(limit);
  }

  // Get trending tags (recently used)
  public async getTrendingTags(days: number = 7, limit: number = 20): Promise<ITagUsage[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    return TagUsageModel.find({
      lastUsedAt: { $gte: since },
    })
      .sort({ usageCount: -1, lastUsedAt: -1 })
      .limit(limit);
  }

  // Search tags
  public async searchTags(query: string, limit: number = 10): Promise<ITagUsage[]> {
    const normalizedQuery = query.toLowerCase().trim();

    return TagUsageModel.find({
      normalizedTag: new RegExp(normalizedQuery, "i"),
    })
      .sort({ usageCount: -1 })
      .limit(limit);
  }

  // Get needs by tag
  public async getNeedsByTag(tag: string, limit: number = 50): Promise<any> {
    const normalizedTag = tag.toLowerCase().trim();

    const tagUsage = await TagUsageModel.findOne({ normalizedTag }).populate("relatedNeeds");

    if (!tagUsage) {
      return [];
    }

    return tagUsage.relatedNeeds.slice(0, limit);
  }

  // Get tag suggestions based on text
  public async suggestTags(text: string, limit: number = 5): Promise<string[]> {
    const words = text.toLowerCase().split(/\s+/);

    const suggestions: Set<string> = new Set();

    for (const word of words) {
      if (word.length >= 3) {
        const tags = await TagUsageModel.find({
          normalizedTag: new RegExp(`^${word}`, "i"),
        })
          .sort({ usageCount: -1 })
          .limit(3)
          .select("tag");

        tags.forEach((t) => suggestions.add(t.tag));
      }
    }

    return Array.from(suggestions).slice(0, limit);
  }
}

export const tagService = new TagService();
