import { DonationModel } from "./donation.model";
import { ProjectModel } from "../projects/project.model";
import { ICreateDonationDTO, IUploadReceiptDTO, IDonation } from "common-types";
import ApiError from "../../core/utils/apiError";
import { certificateService } from "../../core/services/certificate.service";

class DonationService {
  // Create a new donation
  async create(data: ICreateDonationDTO, userId?: string): Promise<IDonation> {
    const { projectId, amount, paymentMethod, donorInfo, message, dedicatedTo } = data;

    // Verify project exists
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      throw new ApiError(404, "پروژه مورد نظر یافت نشد.");
    }

    // Check if donations are enabled
    if (!project.donationSettings.enabled) {
      throw new ApiError(400, "امکان کمک مالی برای این پروژه فعال نیست.");
    }

    // Check minimum amount
    const minAmount = project.donationSettings.minimumAmount || 0;
    if (amount < minAmount) {
      throw new ApiError(400, `حداقل مبلغ کمک ${minAmount.toLocaleString("fa-IR")} تومان است.`);
    }

    // Check anonymous donations allowed
    if (donorInfo?.isAnonymous && !project.donationSettings.allowAnonymous) {
      throw new ApiError(400, "امکان کمک ناشناس برای این پروژه فعال نیست.");
    }

    // Create donation
    const donation = await DonationModel.create({
      project: projectId,
      donor: userId || undefined,
      amount,
      paymentMethod,
      donorInfo,
      message,
      dedicatedTo,
      status: paymentMethod === "online" ? "pending" : "pending", // Will be verified by admin for bank_transfer
    });

    return donation;
  }

  // Get donation by ID
  async findById(id: string): Promise<IDonation | null> {
    const donation = await DonationModel.findById(id)
      .populate("project", "title slug featuredImage")
      .populate("donor", "name email avatar")
      .populate("verifiedBy", "name email");
    return donation;
  }

  // Get donation by tracking code
  async findByTrackingCode(trackingCode: string): Promise<IDonation | null> {
    const donation = await DonationModel.findOne({ trackingCode })
      .populate("project", "title slug featuredImage")
      .populate("donor", "name email avatar");
    return donation;
  }

  // Get all donations for a project
  async findByProject(projectId: string, filters?: any): Promise<IDonation[]> {
    const query: any = { project: projectId };

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.paymentMethod) {
      query.paymentMethod = filters.paymentMethod;
    }

    const donations = await DonationModel.find(query)
      .populate("donor", "name email avatar")
      .populate("verifiedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(filters?.limit || 100);

    return donations;
  }

  // Get donations by user
  async findByUser(userId: string): Promise<IDonation[]> {
    const donations = await DonationModel.find({ donor: userId })
      .populate("project", "title slug featuredImage")
      .sort({ createdAt: -1 });
    return donations;
  }

  // Update donation status (for online payment verification)
  async updateStatus(
    id: string,
    status: "completed" | "failed" | "refunded",
    refId?: string
  ): Promise<IDonation | null> {
    const donation = await DonationModel.findById(id);
    if (!donation) {
      throw new ApiError(404, "کمک مالی یافت نشد.");
    }

    donation.status = status;
    if (refId) donation.refId = refId;
    if (status === "completed") {
      donation.completedAt = new Date();

      // Update project amountRaised and donorCount
      await ProjectModel.findByIdAndUpdate(donation.project, {
        $inc: {
          amountRaised: donation.amount,
          donorCount: 1,
        },
      });
    }

    await donation.save();
    return donation;
  }

  // Upload receipt for bank transfer
  async uploadReceipt(data: IUploadReceiptDTO): Promise<IDonation | null> {
    const { donationId, receiptImage, description } = data;

    const donation = await DonationModel.findById(donationId);
    if (!donation) {
      throw new ApiError(404, "کمک مالی یافت نشد.");
    }

    if (donation.paymentMethod !== "bank_transfer") {
      throw new ApiError(400, "آپلود رسید فقط برای واریز بانکی مجاز است.");
    }

    donation.receipt = {
      image: receiptImage,
      uploadedAt: new Date(),
      verified: false,
    };
    donation.status = "pending"; // Waiting for admin verification

    if (description) {
      donation.adminNotes = description;
    }

    await donation.save();
    return donation;
  }

  // Admin: Verify bank transfer donation
  async verifyBankTransfer(
    donationId: string,
    adminId: string,
    approve: boolean,
    rejectionReason?: string
  ): Promise<IDonation | null> {
    const donation = await DonationModel.findById(donationId);
    if (!donation) {
      throw new ApiError(404, "کمک مالی یافت نشد.");
    }

    if (!donation.receipt) {
      throw new ApiError(400, "رسیدی برای این کمک مالی آپلود نشده است.");
    }

    if (approve) {
      donation.status = "verified";
      donation.receipt.verified = true;
      donation.receipt.verifiedBy = adminId as any;
      donation.receipt.verifiedAt = new Date();
      donation.completedAt = new Date();

      // Update project amountRaised and donorCount
      const project = await ProjectModel.findByIdAndUpdate(
        donation.project,
        {
          $inc: {
            amountRaised: donation.amount,
            donorCount: 1,
          },
        },
        { new: true }
      );

      // Generate certificate
      if (project && !donation.certificateGenerated) {
        try {
          const certificateUrl = await certificateService.generateDonationCertificate(
            donation as any,
            project as any
          );
          donation.certificateUrl = certificateUrl;
          donation.certificateGenerated = true;
        } catch (error) {
          console.error("Failed to generate certificate:", error);
          // Don't fail the verification if certificate generation fails
        }
      }
    } else {
      donation.status = "rejected";
      donation.receipt.verified = false;
      donation.receipt.rejectionReason = rejectionReason;
    }

    await donation.save();
    return donation;
  }

  // Get donation statistics for project
  async getProjectStats(projectId: string) {
    const stats = await DonationModel.aggregate([
      {
        $match: {
          project: projectId as any,
          status: { $in: ["completed", "verified"] },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          donorCount: { $sum: 1 },
          averageDonation: { $avg: "$amount" },
        },
      },
    ]);

    return stats[0] || {
      totalAmount: 0,
      donorCount: 0,
      averageDonation: 0,
    };
  }

  // Get recent donors for project (public list)
  async getRecentDonors(projectId: string, limit: number = 10) {
    const project = await ProjectModel.findById(projectId);
    if (!project?.donationSettings.showDonors) {
      return [];
    }

    const donations = await DonationModel.find({
      project: projectId,
      status: { $in: ["completed", "verified"] },
      "donorInfo.isAnonymous": false,
    })
      .populate("donor", "name avatar")
      .sort({ completedAt: -1 })
      .limit(limit)
      .select("amount donorInfo completedAt");

    return donations;
  }

  // Delete donation (only if pending and not paid)
  async delete(id: string): Promise<boolean> {
    const donation = await DonationModel.findById(id);
    if (!donation) {
      throw new ApiError(404, "کمک مالی یافت نشد.");
    }

    if (donation.status !== "pending" && donation.status !== "failed") {
      throw new ApiError(400, "فقط کمک‌های در انتظار یا ناموفق قابل حذف هستند.");
    }

    await DonationModel.findByIdAndDelete(id);
    return true;
  }
}

export const donationService = new DonationService();
