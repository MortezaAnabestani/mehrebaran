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
    const features = new ApiFeatures(NeedModel.find({ status: "approved" }), queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    features.query.populate("category", "name slug");
    return features.query;
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
