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

  // Milestones CRUD
  public async getMilestones(needId: string): Promise<any[] | null> {
    const need = await NeedModel.findById(needId).select("milestones");
    if (!need) return null;
    return need.milestones || [];
  }

  public async addMilestone(
    needId: string,
    milestoneData: {
      title: string;
      description: string;
      targetDate: Date;
      order: number;
      progressPercentage?: number;
    }
  ): Promise<INeed | null> {
    const need = await NeedModel.findByIdAndUpdate(
      needId,
      {
        $push: {
          milestones: {
            title: milestoneData.title,
            description: milestoneData.description,
            targetDate: milestoneData.targetDate,
            order: milestoneData.order,
            status: "pending",
            progressPercentage: milestoneData.progressPercentage || 0,
            evidence: [],
          },
        },
      },
      { new: true, runValidators: true }
    );

    if (!need) return null;
    return this.populateNeed(need);
  }

  public async updateMilestone(
    needId: string,
    milestoneId: string,
    updateData: {
      title?: string;
      description?: string;
      targetDate?: Date;
      completionDate?: Date;
      status?: "pending" | "in_progress" | "completed" | "delayed";
      progressPercentage?: number;
      order?: number;
      evidence?: string[];
    }
  ): Promise<INeed | null> {
    const need = await NeedModel.findById(needId);
    if (!need || !need.milestones) return null;

    const milestone = need.milestones.find((m: any) => m._id.toString() === milestoneId);
    if (!milestone) {
      throw new ApiError(404, "مایلستون یافت نشد.");
    }

    // Update fields if provided
    if (updateData.title !== undefined) (milestone as any).title = updateData.title;
    if (updateData.description !== undefined) (milestone as any).description = updateData.description;
    if (updateData.targetDate !== undefined) (milestone as any).targetDate = updateData.targetDate;
    if (updateData.completionDate !== undefined) (milestone as any).completionDate = updateData.completionDate;
    if (updateData.status !== undefined) (milestone as any).status = updateData.status;
    if (updateData.progressPercentage !== undefined) (milestone as any).progressPercentage = updateData.progressPercentage;
    if (updateData.order !== undefined) (milestone as any).order = updateData.order;
    if (updateData.evidence !== undefined) (milestone as any).evidence = updateData.evidence;

    // Auto-complete if progress is 100%
    if (updateData.progressPercentage === 100 && (milestone as any).status !== "completed") {
      (milestone as any).status = "completed";
      (milestone as any).completionDate = new Date();
    }

    await need.save();
    return this.populateNeed(need);
  }

  public async deleteMilestone(needId: string, milestoneId: string): Promise<INeed | null> {
    const need = await NeedModel.findById(needId);
    if (!need || !need.milestones) return null;

    const milestoneIndex = need.milestones.findIndex((m: any) => m._id.toString() === milestoneId);
    if (milestoneIndex === -1) {
      throw new ApiError(404, "مایلستون یافت نشد.");
    }

    need.milestones.splice(milestoneIndex, 1);
    await need.save();
    return this.populateNeed(need);
  }

  public async completeMilestone(needId: string, milestoneId: string, evidence?: string[]): Promise<INeed | null> {
    return this.updateMilestone(needId, milestoneId, {
      status: "completed",
      progressPercentage: 100,
      completionDate: new Date(),
      evidence: evidence,
    });
  }

  // Budget Items CRUD
  public async getBudgetItems(needId: string): Promise<any[] | null> {
    const need = await NeedModel.findById(needId).select("budgetItems");
    if (!need) return null;
    return need.budgetItems || [];
  }

  public async addBudgetItem(
    needId: string,
    budgetData: {
      title: string;
      description?: string;
      category: string;
      estimatedCost: number;
      actualCost?: number;
      currency?: string;
      priority?: number;
      notes?: string;
    }
  ): Promise<INeed | null> {
    const need = await NeedModel.findByIdAndUpdate(
      needId,
      {
        $push: {
          budgetItems: {
            title: budgetData.title,
            description: budgetData.description,
            category: budgetData.category,
            estimatedCost: budgetData.estimatedCost,
            actualCost: budgetData.actualCost,
            amountRaised: 0,
            currency: budgetData.currency || "IRR",
            status: "pending",
            priority: budgetData.priority || 3,
            notes: budgetData.notes,
          },
        },
      },
      { new: true, runValidators: true }
    );

    if (!need) return null;
    return this.populateNeed(need);
  }

  public async updateBudgetItem(
    needId: string,
    budgetItemId: string,
    updateData: {
      title?: string;
      description?: string;
      category?: string;
      estimatedCost?: number;
      actualCost?: number;
      amountRaised?: number;
      currency?: string;
      priority?: number;
      notes?: string;
    }
  ): Promise<INeed | null> {
    const need = await NeedModel.findById(needId);
    if (!need || !need.budgetItems) return null;

    const budgetItem = need.budgetItems.find((item: any) => item._id.toString() === budgetItemId);
    if (!budgetItem) {
      throw new ApiError(404, "قلم بودجه یافت نشد.");
    }

    // Update fields if provided
    if (updateData.title !== undefined) (budgetItem as any).title = updateData.title;
    if (updateData.description !== undefined) (budgetItem as any).description = updateData.description;
    if (updateData.category !== undefined) (budgetItem as any).category = updateData.category;
    if (updateData.estimatedCost !== undefined) (budgetItem as any).estimatedCost = updateData.estimatedCost;
    if (updateData.actualCost !== undefined) (budgetItem as any).actualCost = updateData.actualCost;
    if (updateData.amountRaised !== undefined) (budgetItem as any).amountRaised = updateData.amountRaised;
    if (updateData.currency !== undefined) (budgetItem as any).currency = updateData.currency;
    if (updateData.priority !== undefined) (budgetItem as any).priority = updateData.priority;
    if (updateData.notes !== undefined) (budgetItem as any).notes = updateData.notes;

    // Status will be auto-updated by pre-save middleware
    await need.save();
    return this.populateNeed(need);
  }

  public async deleteBudgetItem(needId: string, budgetItemId: string): Promise<INeed | null> {
    const need = await NeedModel.findById(needId);
    if (!need || !need.budgetItems) return null;

    const budgetItemIndex = need.budgetItems.findIndex((item: any) => item._id.toString() === budgetItemId);
    if (budgetItemIndex === -1) {
      throw new ApiError(404, "قلم بودجه یافت نشد.");
    }

    need.budgetItems.splice(budgetItemIndex, 1);
    await need.save();
    return this.populateNeed(need);
  }

  public async addFundsToBudgetItem(
    needId: string,
    budgetItemId: string,
    amount: number
  ): Promise<INeed | null> {
    const need = await NeedModel.findById(needId);
    if (!need || !need.budgetItems) return null;

    const budgetItem = need.budgetItems.find((item: any) => item._id.toString() === budgetItemId);
    if (!budgetItem) {
      throw new ApiError(404, "قلم بودجه یافت نشد.");
    }

    (budgetItem as any).amountRaised = ((budgetItem as any).amountRaised || 0) + amount;

    // Status will be auto-updated by pre-save middleware
    await need.save();
    return this.populateNeed(need);
  }

  // Verification Requests CRUD
  public async getVerificationRequests(needId: string, status?: string): Promise<any[] | null> {
    const need = await NeedModel.findById(needId).select("verificationRequests").populate("verificationRequests.submittedBy", "name").populate("verificationRequests.reviewedBy", "name");
    if (!need) return null;

    let requests = need.verificationRequests || [];

    // Filter by status if provided
    if (status) {
      requests = (requests as any[]).filter((req: any) => req.status === status);
    }

    return requests;
  }

  public async createVerificationRequest(
    needId: string,
    userId: string,
    requestData: {
      type: "milestone_completion" | "budget_expense" | "need_completion" | "progress_update";
      description: string;
      evidence: Array<{ type: "image" | "document" | "video"; url: string; description?: string }>;
      relatedItemId?: string;
      relatedItemType?: string;
    }
  ): Promise<INeed | null> {
    const need = await NeedModel.findByIdAndUpdate(
      needId,
      {
        $push: {
          verificationRequests: {
            type: requestData.type,
            description: requestData.description,
            evidence: requestData.evidence,
            relatedItemId: requestData.relatedItemId,
            relatedItemType: requestData.relatedItemType,
            submittedBy: new Types.ObjectId(userId),
            submittedAt: new Date(),
            status: "pending",
          },
        },
      },
      { new: true, runValidators: true }
    );

    if (!need) return null;
    return this.populateNeed(need);
  }

  public async reviewVerificationRequest(
    needId: string,
    verificationId: string,
    reviewerId: string,
    reviewData: {
      status: "approved" | "rejected" | "needs_revision";
      adminComments?: string;
      rejectionReason?: string;
      revisionNotes?: string;
    }
  ): Promise<INeed | null> {
    const need = await NeedModel.findById(needId);
    if (!need || !need.verificationRequests) return null;

    const verification = need.verificationRequests.find((req: any) => req._id.toString() === verificationId);
    if (!verification) {
      throw new ApiError(404, "درخواست تایید یافت نشد.");
    }

    // Update verification status
    (verification as any).status = reviewData.status;
    (verification as any).reviewedBy = new Types.ObjectId(reviewerId);
    (verification as any).reviewedAt = new Date();

    if (reviewData.adminComments) {
      (verification as any).adminComments = reviewData.adminComments;
    }

    if (reviewData.status === "rejected" && reviewData.rejectionReason) {
      (verification as any).rejectionReason = reviewData.rejectionReason;
    }

    if (reviewData.status === "needs_revision") {
      (verification as any).revisionRequested = true;
      if (reviewData.revisionNotes) {
        (verification as any).revisionNotes = reviewData.revisionNotes;
      }
    }

    // Auto-update related items if approved
    if (reviewData.status === "approved" && (verification as any).relatedItemType) {
      await this.handleApprovedVerification(need, verification as any);
    }

    await need.save();
    return this.populateNeed(need);
  }

  private async handleApprovedVerification(need: any, verification: any): Promise<void> {
    // Handle different verification types
    if (verification.relatedItemType === "milestone" && verification.relatedItemId) {
      // Auto-complete the milestone
      const milestone = need.milestones?.find((m: any) => m._id.toString() === verification.relatedItemId);
      if (milestone) {
        milestone.status = "completed";
        milestone.progressPercentage = 100;
        milestone.completionDate = new Date();
      }
    }

    if (verification.relatedItemType === "budget_item" && verification.relatedItemId) {
      // Mark budget expense as verified
      const budgetItem = need.budgetItems?.find((b: any) => b._id.toString() === verification.relatedItemId);
      if (budgetItem && budgetItem.actualCost === undefined) {
        // You might want to set actualCost based on verification data
      }
    }

    if (verification.type === "need_completion") {
      // Mark need as completed
      need.status = "completed";
    }
  }

  public async deleteVerificationRequest(needId: string, verificationId: string): Promise<INeed | null> {
    const need = await NeedModel.findById(needId);
    if (!need || !need.verificationRequests) return null;

    const verificationIndex = need.verificationRequests.findIndex((req: any) => req._id.toString() === verificationId);
    if (verificationIndex === -1) {
      throw new ApiError(404, "درخواست تایید یافت نشد.");
    }

    need.verificationRequests.splice(verificationIndex, 1);
    await need.save();
    return this.populateNeed(need);
  }
}

export const needService = new NeedService();
