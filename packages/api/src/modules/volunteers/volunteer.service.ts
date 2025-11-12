import { VolunteerRegistrationModel } from "./volunteer.model";
import { ProjectModel } from "../projects/project.model";
import { IRegisterVolunteerDTO, IUpdateVolunteerDTO, IVolunteerRegistration } from "common-types";
import ApiError from "../../core/utils/apiError";
import { certificateService } from "../../core/services/certificate.service";

class VolunteerService {
  // Register as volunteer
  async register(data: IRegisterVolunteerDTO, userId: string): Promise<IVolunteerRegistration> {
    const { projectId, skills, availableHours, preferredRole, experience, motivation, availability, emergencyContact } = data;

    // Verify project exists
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      throw new ApiError(404, "پروژه مورد نظر یافت نشد.");
    }

    // Check if volunteer registration is enabled
    if (!project.volunteerSettings.enabled) {
      throw new ApiError(400, "امکان ثبت‌نام داوطلب برای این پروژه فعال نیست.");
    }

    // Check if user already registered
    const existing = await VolunteerRegistrationModel.findOne({
      project: projectId,
      volunteer: userId,
    });
    if (existing) {
      throw new ApiError(400, "شما قبلاً برای این پروژه ثبت‌نام کرده‌اید.");
    }

    // Check max volunteers limit
    if (project.volunteerSettings.maxVolunteers) {
      const currentCount = await VolunteerRegistrationModel.countDocuments({
        project: projectId,
        status: { $in: ["approved", "active"] },
      });
      if (currentCount >= project.volunteerSettings.maxVolunteers) {
        throw new ApiError(400, "ظرفیت داوطلبان این پروژه تکمیل شده است.");
      }
    }

    // Determine initial status
    const initialStatus = project.volunteerSettings.autoApprove ? "approved" : "pending";

    // Create registration
    const registration = await VolunteerRegistrationModel.create({
      project: projectId,
      volunteer: userId,
      skills,
      availableHours,
      preferredRole,
      experience,
      motivation,
      availability,
      emergencyContact,
      status: initialStatus,
      approvedAt: initialStatus === "approved" ? new Date() : undefined,
    });

    return registration;
  }

  // Get registration by ID
  async findById(id: string): Promise<IVolunteerRegistration | null> {
    const registration = await VolunteerRegistrationModel.findById(id)
      .populate("project", "title slug featuredImage volunteerSettings")
      .populate("volunteer", "name email avatar phone")
      .populate("reviewedBy", "name email");
    return registration;
  }

  // Get registrations by project
  async findByProject(projectId: string, filters?: any): Promise<IVolunteerRegistration[]> {
    const query: any = { project: projectId };

    if (filters?.status) {
      query.status = filters.status;
    }

    const registrations = await VolunteerRegistrationModel.find(query)
      .populate("volunteer", "name email avatar")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(filters?.limit || 100);

    return registrations;
  }

  // Get registrations by user
  async findByUser(userId: string): Promise<IVolunteerRegistration[]> {
    const registrations = await VolunteerRegistrationModel.find({ volunteer: userId })
      .populate("project", "title slug featuredImage deadline")
      .sort({ createdAt: -1 });
    return registrations;
  }

  // Admin: Update volunteer registration
  async update(id: string, data: IUpdateVolunteerDTO, adminId?: string): Promise<IVolunteerRegistration | null> {
    const registration = await VolunteerRegistrationModel.findById(id);
    if (!registration) {
      throw new ApiError(404, "ثبت‌نام داوطلب یافت نشد.");
    }

    if (data.status) {
      registration.status = data.status;
      if (adminId) {
        registration.reviewedBy = adminId as any;
        registration.reviewedAt = new Date();
      }
    }

    if (data.reviewNotes) {
      registration.reviewNotes = data.reviewNotes;
    }

    if (data.rejectionReason) {
      registration.rejectionReason = data.rejectionReason;
    }

    if (data.hoursContributed !== undefined) {
      registration.hoursContributed = data.hoursContributed;
      registration.lastActivity = new Date();
    }

    if (data.tasksCompleted !== undefined) {
      registration.tasksCompleted = data.tasksCompleted;
    }

    await registration.save();

    // Generate certificate if status changed to completed
    if (data.status === "completed" && !registration.certificateUrl) {
      try {
        const project = await ProjectModel.findById(registration.project);
        if (project) {
          const certificateUrl = await certificateService.generateVolunteerCertificate(
            registration as any,
            project as any
          );
          registration.certificateUrl = certificateUrl;
          await registration.save();
        }
      } catch (error) {
        console.error("Failed to generate volunteer certificate:", error);
        // Don't fail if certificate generation fails
      }
    }

    return registration;
  }

  // Admin: Approve volunteer
  async approve(id: string, adminId: string, notes?: string): Promise<IVolunteerRegistration | null> {
    return this.update(
      id,
      {
        status: "approved",
        reviewNotes: notes,
      },
      adminId
    );
  }

  // Admin: Reject volunteer
  async reject(id: string, adminId: string, reason: string): Promise<IVolunteerRegistration | null> {
    return this.update(
      id,
      {
        status: "rejected",
        rejectionReason: reason,
      },
      adminId
    );
  }

  // User: Withdraw from volunteering
  async withdraw(id: string, userId: string): Promise<IVolunteerRegistration | null> {
    const registration = await VolunteerRegistrationModel.findById(id);
    if (!registration) {
      throw new ApiError(404, "ثبت‌نام داوطلب یافت نشد.");
    }

    if (registration.volunteer.toString() !== userId) {
      throw new ApiError(403, "شما مجاز به انجام این عملیات نیستید.");
    }

    if (registration.status === "completed" || registration.status === "withdrawn") {
      throw new ApiError(400, "امکان انصراف از این ثبت‌نام وجود ندارد.");
    }

    registration.status = "withdrawn";
    await registration.save();
    return registration;
  }

  // Get volunteer statistics for project
  async getProjectStats(projectId: string) {
    const stats = await VolunteerRegistrationModel.aggregate([
      { $match: { project: projectId as any } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalHours = await VolunteerRegistrationModel.aggregate([
      {
        $match: {
          project: projectId as any,
          status: { $in: ["active", "completed"] },
        },
      },
      {
        $group: {
          _id: null,
          totalHours: { $sum: "$hoursContributed" },
        },
      },
    ]);

    const statusCounts: any = {};
    stats.forEach((s) => {
      statusCounts[s._id] = s.count;
    });

    return {
      pending: statusCounts.pending || 0,
      approved: statusCounts.approved || 0,
      active: statusCounts.active || 0,
      completed: statusCounts.completed || 0,
      rejected: statusCounts.rejected || 0,
      withdrawn: statusCounts.withdrawn || 0,
      totalHoursContributed: totalHours[0]?.totalHours || 0,
    };
  }

  // Get active volunteers for project
  async getActiveVolunteers(projectId: string, limit: number = 20) {
    const volunteers = await VolunteerRegistrationModel.find({
      project: projectId,
      status: { $in: ["approved", "active"] },
    })
      .populate("volunteer", "name avatar")
      .sort({ hoursContributed: -1 })
      .limit(limit)
      .select("volunteer hoursContributed tasksCompleted preferredRole");

    return volunteers;
  }

  // Delete registration
  async delete(id: string): Promise<boolean> {
    const registration = await VolunteerRegistrationModel.findById(id);
    if (!registration) {
      throw new ApiError(404, "ثبت‌نام داوطلب یافت نشد.");
    }

    // Can only delete pending or rejected registrations
    if (!["pending", "rejected"].includes(registration.status)) {
      throw new ApiError(400, "فقط ثبت‌نام‌های در انتظار یا رد شده قابل حذف هستند.");
    }

    await VolunteerRegistrationModel.findByIdAndDelete(id);
    return true;
  }
}

export const volunteerService = new VolunteerService();
