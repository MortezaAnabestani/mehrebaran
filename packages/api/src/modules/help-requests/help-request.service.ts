import { HelpRequestModel, IHelpRequest } from "./help-request.model";
import ApiError from "../../core/utils/apiError";

class HelpRequestService {
  public async create(data: any): Promise<IHelpRequest> {
    const helpRequest = await HelpRequestModel.create(data);
    return helpRequest;
  }

  public async findAll(filters: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ helpRequests: IHelpRequest[]; total: number }> {
    const { status, search, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { guestName: { $regex: search, $options: "i" } },
        { guestEmail: { $regex: search, $options: "i" } },
      ];
    }

    const [helpRequests, total] = await Promise.all([
      HelpRequestModel.find(query)
        .populate("reviewedBy", "username fullName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      HelpRequestModel.countDocuments(query),
    ]);

    return { helpRequests, total };
  }

  public async findOne(id: string): Promise<IHelpRequest | null> {
    const helpRequest = await HelpRequestModel.findById(id)
      .populate("reviewedBy", "username fullName email")
      .lean();
    return helpRequest;
  }

  public async updateStatus(
    id: string,
    status: string,
    adminNotes: string | undefined,
    reviewedBy: string
  ): Promise<IHelpRequest | null> {
    const helpRequest = await HelpRequestModel.findByIdAndUpdate(
      id,
      {
        status,
        adminNotes,
        reviewedBy,
        reviewedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!helpRequest) {
      throw new ApiError(404, "درخواست کمک یافت نشد");
    }

    return helpRequest;
  }

  public async delete(id: string): Promise<void> {
    const helpRequest = await HelpRequestModel.findByIdAndDelete(id);
    if (!helpRequest) {
      throw new ApiError(404, "درخواست کمک یافت نشد");
    }
  }

  public async getStats(): Promise<any> {
    const stats = await HelpRequestModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const total = await HelpRequestModel.countDocuments();

    return {
      total,
      byStatus: stats.reduce((acc: any, stat: any) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
    };
  }
}

export const helpRequestService = new HelpRequestService();
