import { INeed } from "common-types";
import { NeedModel } from "./need.model";
import { Types } from "mongoose";
import ApiFeatures from "../../core/utils/apiFeatures";
import ApiError from "../../core/utils/apiError";

class NeedService {
  public async create(data: any): Promise<INeed> {
    const need = await NeedModel.create(data);
    return this.populateNeed(need);
  }

  public async findAll(queryString: Record<string, any>): Promise<INeed[]> {
    const baseQuery = this.buildSearchQuery(queryString);

    const features = new ApiFeatures(NeedModel.find(baseQuery), queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    features.query.populate("category", "name slug");
    return features.query;
  }

  // Advanced search with multiple filters
  private buildSearchQuery(params: Record<string, any>): Record<string, any> {
    const query: Record<string, any> = { status: "approved" };

    // Text search (title, description)
    if (params.q) {
      query.$or = [
        { title: { $regex: params.q, $options: "i" } },
        { description: { $regex: params.q, $options: "i" } },
      ];
    }

    // Category filter
    if (params.category) {
      query.category = params.category;
    }

    // Status filter (for admin)
    if (params.status) {
      if (Array.isArray(params.status)) {
        query.status = { $in: params.status };
      } else {
        query.status = params.status;
      }
    }

    // Urgency level filter
    if (params.urgencyLevel) {
      if (Array.isArray(params.urgencyLevel)) {
        query.urgencyLevel = { $in: params.urgencyLevel };
      } else {
        query.urgencyLevel = params.urgencyLevel;
      }
    }

    // Tags filter (needs must have ALL specified tags)
    if (params.tags) {
      const tagsArray = Array.isArray(params.tags) ? params.tags : params.tags.split(",");
      query.tags = { $all: tagsArray };
    }

    // Skills filter (needs must have at least one of the specified skills)
    if (params.skills) {
      const skillsArray = Array.isArray(params.skills) ? params.skills : params.skills.split(",");
      query.requiredSkills = { $in: skillsArray };
    }

    // Location filters
    if (params.city) {
      query["location.city"] = { $regex: params.city, $options: "i" };
    }
    if (params.province) {
      query["location.province"] = { $regex: params.province, $options: "i" };
    }

    // Minimum upvotes
    if (params.minUpvotes) {
      query.$where = `this.upvotes.length >= ${parseInt(params.minUpvotes)}`;
    }

    // Has location
    if (params.hasLocation === "true") {
      query.location = { $exists: true, $ne: null };
    }

    // Deadline before
    if (params.deadlineBefore) {
      query.deadline = { $lte: new Date(params.deadlineBefore) };
    }

    // Created after/before
    if (params.createdAfter) {
      query.createdAt = { ...query.createdAt, $gte: new Date(params.createdAfter) };
    }
    if (params.createdBefore) {
      query.createdAt = { ...query.createdAt, $lte: new Date(params.createdBefore) };
    }

    return query;
  }

  // Geo-search: Find needs near a location
  public async findNearby(
    longitude: number,
    latitude: number,
    radiusInKm: number = 50,
    queryString: Record<string, any> = {}
  ): Promise<INeed[]> {
    const baseQuery = this.buildSearchQuery(queryString);

    // Add geospatial query
    baseQuery.location = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        $maxDistance: radiusInKm * 1000, // Convert km to meters
      },
    };

    const features = new ApiFeatures(NeedModel.find(baseQuery), queryString)
      .sort()
      .limitFields()
      .paginate();

    features.query.populate("category", "name slug");
    return features.query;
  }

  // Trending needs (most popular recently)
  public async findTrending(limit: number = 10): Promise<INeed[]> {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    return NeedModel.find({
      status: "approved",
      createdAt: { $gte: sevenDaysAgo },
    })
      .sort({ viewsCount: -1, "upvotes.length": -1 })
      .limit(limit)
      .populate("category", "name slug");
  }

  // Popular needs (most upvoted)
  public async findPopular(limit: number = 10): Promise<INeed[]> {
    const needs = await NeedModel.find({ status: "approved" })
      .populate("category", "name slug")
      .lean();

    // Sort by upvotes count
    const sorted = needs.sort((a, b) => (b.upvotes?.length || 0) - (a.upvotes?.length || 0));

    return sorted.slice(0, limit) as INeed[];
  }

  // Urgent needs (critical urgency with close deadline)
  public async findUrgent(limit: number = 10): Promise<INeed[]> {
    const now = new Date();
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    return NeedModel.find({
      status: { $in: ["approved", "in_progress"] },
      $or: [{ urgencyLevel: "critical" }, { deadline: { $lte: thirtyDaysFromNow, $gte: now } }],
    })
      .sort({ urgencyLevel: -1, deadline: 1 })
      .limit(limit)
      .populate("category", "name slug");
  }

  public async findAllForAdmin(queryString: Record<string, any>): Promise<INeed[]> {
    const features = new ApiFeatures(NeedModel.find(), queryString).filter().sort().limitFields().paginate();
    features.query.populate("category", "name slug").populate("submittedBy.user", "name");
    return features.query;
  }

  public async findOne(identifier: string): Promise<INeed | null> {
    const isObjectId = Types.ObjectId.isValid(identifier);
    const query = isObjectId ? { _id: identifier } : { slug: identifier };
    const need = await NeedModel.findOne(query);
    if (!need) return null;
    return this.populateNeed(need);
  }

  public async update(id: string, data: any): Promise<INeed | null> {
    const updatedNeed = await NeedModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updatedNeed) return null;
    return this.populateNeed(updatedNeed);
  }

  public async delete(id: string): Promise<void> {
    // TODO: حذف فایل‌های پیوست از سرور
    await NeedModel.findByIdAndDelete(id);
  }

  public async toggleUpvote(needId: string, userId: string): Promise<INeed> {
    const need = await NeedModel.findById(needId);
    if (!need) {
      throw new ApiError(404, "نیاز یافت نشد.");
    }

    const upvotedIndex = need.upvotes.findIndex((id) => id.toString() === userId);
    if (upvotedIndex > -1) {
      need.upvotes.splice(upvotedIndex, 1);
    } else {
      need.upvotes.push(new Types.ObjectId(userId) as any);
    }

    await need.save();
    return this.populateNeed(need);
  }

  private populateNeed(doc: any): Promise<INeed> {
    return doc.populate([
      { path: "category", select: "name slug" },
      { path: "submittedBy.user", select: "name" },
      { path: "upvotes", select: "name" },
      { path: "comments" },
    ]);
  }

  public async addSupporter(needId: string, userId: string): Promise<void> {
    const result = await NeedModel.findByIdAndUpdate(needId, {
      $addToSet: { supporters: new Types.ObjectId(userId) },
    });

    if (!result) {
      throw new ApiError(404, "نیاز یافت نشد.");
    }
  }

  // View Counter
  public async incrementViews(needId: string): Promise<void> {
    const result = await NeedModel.findByIdAndUpdate(needId, {
      $inc: { viewsCount: 1 },
    });

    if (!result) {
      throw new ApiError(404, "نیاز یافت نشد.");
    }
  }

  // Need Updates CRUD
  public async addUpdate(needId: string, updateData: { title: string; description: string }): Promise<INeed | null> {
    const need = await NeedModel.findByIdAndUpdate(
      needId,
      {
        $push: {
          updates: {
            title: updateData.title,
            description: updateData.description,
            date: new Date(),
          },
        },
      },
      { new: true, runValidators: true }
    );

    if (!need) return null;
    return this.populateNeed(need);
  }

  public async getUpdates(needId: string): Promise<any[] | null> {
    const need = await NeedModel.findById(needId).select("updates");
    if (!need) return null;
    return need.updates || [];
  }

  public async updateUpdate(
    needId: string,
    updateId: string,
    updateData: { title?: string; description?: string }
  ): Promise<INeed | null> {
    const need = await NeedModel.findById(needId);
    if (!need || !need.updates) return null;

    const updateIndex = parseInt(updateId);
    if (isNaN(updateIndex) || updateIndex < 0 || updateIndex >= need.updates.length) {
      return null;
    }

    if (updateData.title) need.updates[updateIndex].title = updateData.title;
    if (updateData.description) need.updates[updateIndex].description = updateData.description;

    await need.save();
    return this.populateNeed(need);
  }

  public async deleteUpdate(needId: string, updateId: string): Promise<INeed | null> {
    const need = await NeedModel.findById(needId);
    if (!need || !need.updates) return null;

    const updateIndex = parseInt(updateId);
    if (isNaN(updateIndex) || updateIndex < 0 || updateIndex >= need.updates.length) {
      return null;
    }

    need.updates.splice(updateIndex, 1);
    await need.save();
    return this.populateNeed(need);
  }
}

export const needService = new NeedService();
