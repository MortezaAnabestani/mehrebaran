import { Request, Response } from "express";
import { donationService } from "./donation.service";
import {
  createDonationSchema,
  uploadReceiptSchema,
  verifyDonationSchema,
  getDonationsSchema,
} from "./donation.validation";
import asyncHandler from "../../core/utils/asyncHandler";
import ApiError from "../../core/utils/apiError";
import { paymentService } from "../../core/services/payment.service";
import { certificateService } from "../../core/services/certificate.service";
import { ProjectModel } from "../projects/project.model";

class DonationController {
  // Create a new donation
  public create = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createDonationSchema.parse({ body: req.body });
    const userId = (req as any).user?._id; // From auth middleware (optional)

    const donation = await donationService.create(validatedData.body, userId);

    res.status(201).json({
      message: "درخواست کمک مالی با موفقیت ثبت شد.",
      data: donation,
    });
  });

  // Get donation by ID or tracking code
  public getOne = asyncHandler(async (req: Request, res: Response) => {
    const { identifier } = req.params;

    let donation;
    // Check if identifier is tracking code or ObjectId
    if (identifier.startsWith("DON-")) {
      donation = await donationService.findByTrackingCode(identifier);
    } else {
      donation = await donationService.findById(identifier);
    }

    if (!donation) {
      throw new ApiError(404, "کمک مالی مورد نظر یافت نشد.");
    }

    res.status(200).json({ data: donation });
  });

  // Get all donations for a project
  public getByProject = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = getDonationsSchema.parse({
      params: req.params,
      query: req.query,
    });

    const donations = await donationService.findByProject(
      validatedData.params.projectId,
      validatedData.query
    );

    res.status(200).json({
      results: donations.length,
      data: donations,
    });
  });

  // Get user's donations
  public getMyDonations = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user._id;
    const donations = await donationService.findByUser(userId);

    res.status(200).json({
      results: donations.length,
      data: donations,
    });
  });

  // Upload receipt for bank transfer
  public uploadReceipt = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = uploadReceiptSchema.parse({
      body: req.body,
      params: req.params,
    });

    const donation = await donationService.uploadReceipt({
      donationId: validatedData.params.donationId,
      receiptImage: validatedData.body.receiptImage,
      description: validatedData.body.description,
    });

    res.status(200).json({
      message: "رسید با موفقیت آپلود شد و در انتظار تایید است.",
      data: donation,
    });
  });

  // Admin: Verify bank transfer donation
  public verifyBankTransfer = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = verifyDonationSchema.parse({
      body: req.body,
      params: req.params,
    });
    const adminId = (req as any).user._id;

    const donation = await donationService.verifyBankTransfer(
      validatedData.params.donationId,
      adminId,
      validatedData.body.approve,
      validatedData.body.rejectionReason
    );

    res.status(200).json({
      message: validatedData.body.approve ? "کمک مالی تایید شد." : "کمک مالی رد شد.",
      data: donation,
    });
  });

  // Get donation statistics for project
  public getProjectStats = asyncHandler(async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const stats = await donationService.getProjectStats(projectId);

    res.status(200).json({ data: stats });
  });

  // Get recent donors for project
  public getRecentDonors = asyncHandler(async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const donors = await donationService.getRecentDonors(projectId, limit);

    res.status(200).json({
      results: donors.length,
      data: donors,
    });
  });

  // Initiate online payment via Zarinpal
  public initiatePayment = asyncHandler(async (req: Request, res: Response) => {
    const { donationId } = req.params;

    // Get donation details
    const donation = await donationService.findById(donationId);
    if (!donation) {
      throw new ApiError(404, "کمک مالی مورد نظر یافت نشد.");
    }

    // Check if donation is already paid
    if (donation.status === "completed" || donation.status === "verified") {
      throw new ApiError(400, "این کمک مالی قبلاً پرداخت شده است.");
    }

    // Check if payment method is online
    if (donation.paymentMethod !== "online") {
      throw new ApiError(400, "این کمک مالی از طریق آنلاین قابل پرداخت نیست.");
    }

    // Get project details
    const project = donation.project as any;
    const projectTitle = project.title || "پروژه مهر باران";

    // Initiate payment
    const paymentResult = await paymentService.initiateDonationPayment(
      donationId,
      donation.amount,
      projectTitle,
      donation.donorInfo?.mobile,
      donation.donorInfo?.email
    );

    if (!paymentResult.success) {
      throw new ApiError(400, paymentResult.error || "خطا در ایجاد درخواست پرداخت.");
    }

    // Update donation with authority code
    donation.authority = paymentResult.authority;
    donation.paymentGateway = "zarinpal";
    await donation.save();

    res.status(200).json({
      message: "درخواست پرداخت با موفقیت ایجاد شد.",
      data: {
        paymentUrl: paymentResult.paymentUrl,
        authority: paymentResult.authority,
      },
    });
  });

  // Verify online payment callback
  public verifyPayment = asyncHandler(async (req: Request, res: Response) => {
    const { Authority, Status } = req.query;
    const { donationId } = req.params;

    // Check if payment was successful
    if (Status !== "OK") {
      throw new ApiError(400, "پرداخت توسط کاربر لغو شد یا با خطا مواجه شد.");
    }

    // Get donation
    const donation = await donationService.findById(donationId);
    if (!donation) {
      throw new ApiError(404, "کمک مالی مورد نظر یافت نشد.");
    }

    // Verify authority matches
    if (donation.authority !== Authority) {
      throw new ApiError(400, "کد تراکنش معتبر نیست.");
    }

    // Check if already verified
    if (donation.status === "completed" || donation.status === "verified") {
      return res.status(200).json({
        message: "این تراکنش قبلاً تایید شده است.",
        data: donation,
      });
    }

    // Verify payment with Zarinpal
    const verificationResult = await paymentService.verifyDonationPayment(
      Authority as string,
      donation.amount
    );

    if (!verificationResult.success) {
      // Update donation status to failed
      await donationService.updateStatus(donationId, "rejected");
      throw new ApiError(400, verificationResult.error || "تایید پرداخت با خطا مواجه شد.");
    }

    // Update donation with payment details
    donation.status = "completed";
    donation.transactionId = verificationResult.refId;
    donation.refId = verificationResult.refId;
    await donation.save();

    // Manually trigger project updates (since pre-save hook might not fire)
    await donationService.updateStatus(donationId, "completed");

    // Generate certificate
    let certificateUrl = donation.certificateUrl;
    if (!donation.certificateGenerated) {
      try {
        const project = await ProjectModel.findById(donation.project);
        if (project) {
          certificateUrl = await certificateService.generateDonationCertificate(
            donation as any,
            project as any
          );
          donation.certificateUrl = certificateUrl;
          donation.certificateGenerated = true;
          await donation.save();
        }
      } catch (error) {
        console.error("Failed to generate certificate:", error);
        // Don't fail if certificate generation fails
      }
    }

    res.status(200).json({
      message: "پرداخت شما با موفقیت تایید شد. از حمایت شما سپاسگزاریم!",
      data: {
        donation,
        refId: verificationResult.refId,
        certificateUrl,
      },
    });
  });

  // Delete donation
  public delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await donationService.delete(id);

    res.status(200).json({ message: "کمک مالی با موفقیت حذف شد." });
  });
}

export const donationController = new DonationController();
