import { SupporterSubmissionModel } from "./supporterSubmission.model";

class SupporterSubmissionService {
  public async create(data: any): Promise<any> {
    return SupporterSubmissionModel.create(data);
  }

  public async findByNeed(needId: string): Promise<any[]> {
    return SupporterSubmissionModel.find({ need: needId, status: "approved" }).populate("submitter", "name");
  }

  public async findAllForAdmin(needId: string): Promise<any[]> {
    return SupporterSubmissionModel.find({ need: needId })
      .populate("submitter", "name")
      .sort({ createdAt: -1 });
  }

  public async updateStatus(id: string, status: "approved" | "rejected"): Promise<any | null> {
    return SupporterSubmissionModel.findByIdAndUpdate(id, { status }, { new: true });
  }
}

export const supporterSubmissionService = new SupporterSubmissionService();
