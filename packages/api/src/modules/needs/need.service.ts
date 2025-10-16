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
}

export const needService = new NeedService();
