import { TeamModel } from "./team.model";
import { TeamInvitationModel } from "./teamInvitation.model";
import { ITeam, ITeamInvitation, TeamMemberRole, TeamStatus, TeamFocusArea } from "common-types";
import { Types } from "mongoose";
import ApiError from "../../core/utils/apiError";

class TeamService {
  // Create a new team
  public async createTeam(
    needId: string,
    createdBy: string,
    data: {
      name: string;
      description?: string;
      focusArea?: TeamFocusArea;
      maxMembers?: number;
      tags?: string[];
      isPrivate?: boolean;
    }
  ): Promise<ITeam> {
    // Creator is automatically the leader
    const team = await TeamModel.create({
      need: new Types.ObjectId(needId),
      name: data.name,
      description: data.description,
      focusArea: data.focusArea || "general",
      maxMembers: data.maxMembers,
      tags: data.tags,
      isPrivate: data.isPrivate || false,
      createdBy: new Types.ObjectId(createdBy),
      members: [
        {
          user: new Types.ObjectId(createdBy),
          role: "leader",
          joinedAt: new Date(),
          isActive: true,
        },
      ],
    });

    return team.populate("members.user", "name email");
  }

  // Get all teams for a need
  public async getTeams(needId: string, filters?: { status?: TeamStatus; focusArea?: TeamFocusArea }): Promise<ITeam[]> {
    const query: any = { need: needId };

    if (filters?.status) {
      query.status = filters.status;
    }
    if (filters?.focusArea) {
      query.focusArea = filters.focusArea;
    }

    const teams = await TeamModel.find(query)
      .populate("members.user", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return teams;
  }

  // Get team by ID
  public async getTeamById(teamId: string): Promise<ITeam | null> {
    const team = await TeamModel.findById(teamId)
      .populate("members.user", "name email")
      .populate("members.invitedBy", "name")
      .populate("createdBy", "name email");

    return team;
  }

  // Update team details
  public async updateTeam(
    teamId: string,
    userId: string,
    updateData: {
      name?: string;
      description?: string;
      focusArea?: TeamFocusArea;
      status?: TeamStatus;
      maxMembers?: number;
      tags?: string[];
      isPrivate?: boolean;
    }
  ): Promise<ITeam | null> {
    const team = await TeamModel.findById(teamId);
    if (!team) {
      throw new ApiError(404, "تیم یافت نشد.");
    }

    // Only leader or co-leader can update team
    const member = team.members.find((m: any) => m.user.toString() === userId);
    if (!member || !["leader", "co_leader"].includes(member.role)) {
      throw new ApiError(403, "فقط رهبر یا همکار رهبر می‌تواند تیم را به‌روزرسانی کند.");
    }

    Object.assign(team, updateData);
    await team.save();

    return team.populate("members.user", "name email");
  }

  // Delete team
  public async deleteTeam(teamId: string, userId: string): Promise<void> {
    const team = await TeamModel.findById(teamId);
    if (!team) {
      throw new ApiError(404, "تیم یافت نشد.");
    }

    // Only leader can delete team
    const member = team.members.find((m: any) => m.user.toString() === userId);
    if (!member || member.role !== "leader") {
      throw new ApiError(403, "فقط رهبر تیم می‌تواند آن را حذف کند.");
    }

    await TeamModel.findByIdAndDelete(teamId);
  }

  // Add member directly (without invitation)
  public async addMember(
    teamId: string,
    addedBy: string,
    newMemberId: string,
    role: TeamMemberRole = "member"
  ): Promise<ITeam | null> {
    const team = await TeamModel.findById(teamId);
    if (!team) {
      throw new ApiError(404, "تیم یافت نشد.");
    }

    // Check if user adding member is leader or co-leader
    const adderMember = team.members.find((m: any) => m.user.toString() === addedBy);
    if (!adderMember || !["leader", "co_leader"].includes(adderMember.role)) {
      throw new ApiError(403, "فقط رهبر یا همکار رهبر می‌تواند عضو اضافه کند.");
    }

    // Check if user is already a member
    const alreadyMember = team.members.some((m: any) => m.user.toString() === newMemberId);
    if (alreadyMember) {
      throw new ApiError(400, "این کاربر قبلاً عضو تیم است.");
    }

    // Check max members
    if (team.maxMembers && team.members.length >= team.maxMembers) {
      throw new ApiError(400, "تیم به حداکثر تعداد اعضا رسیده است.");
    }

    team.members.push({
      user: new Types.ObjectId(newMemberId) as any,
      role,
      joinedAt: new Date(),
      invitedBy: new Types.ObjectId(addedBy) as any,
      isActive: true,
    } as any);

    await team.save();
    return team.populate("members.user", "name email");
  }

  // Remove member from team
  public async removeMember(teamId: string, removedBy: string, memberIdToRemove: string): Promise<ITeam | null> {
    const team = await TeamModel.findById(teamId);
    if (!team) {
      throw new ApiError(404, "تیم یافت نشد.");
    }

    // Check if user removing is leader or co-leader (or removing themselves)
    const removerMember = team.members.find((m: any) => m.user.toString() === removedBy);
    const isLeaderOrCoLeader = removerMember && ["leader", "co_leader"].includes(removerMember.role);
    const isRemovingSelf = removedBy === memberIdToRemove;

    if (!isRemovingSelf && !isLeaderOrCoLeader) {
      throw new ApiError(403, "فقط رهبر یا همکار رهبر می‌تواند عضو دیگری را حذف کند.");
    }

    // Find member to remove
    const memberIndex = team.members.findIndex((m: any) => m.user.toString() === memberIdToRemove);
    if (memberIndex === -1) {
      throw new ApiError(404, "عضو در تیم یافت نشد.");
    }

    // Don't allow removing the only leader
    const memberToRemove = team.members[memberIndex];
    if ((memberToRemove as any).role === "leader") {
      const activeLeaders = team.members.filter((m: any) => m.role === "leader" && m.isActive);
      if (activeLeaders.length === 1) {
        throw new ApiError(400, "نمی‌توان تنها رهبر تیم را حذف کرد. ابتدا یک رهبر جدید تعیین کنید.");
      }
    }

    // Mark as inactive instead of removing
    (team.members[memberIndex] as any).isActive = false;
    (team.members[memberIndex] as any).leftAt = new Date();

    await team.save();
    return team.populate("members.user", "name email");
  }

  // Update member role
  public async updateMemberRole(
    teamId: string,
    updatedBy: string,
    memberIdToUpdate: string,
    newRole: TeamMemberRole
  ): Promise<ITeam | null> {
    const team = await TeamModel.findById(teamId);
    if (!team) {
      throw new ApiError(404, "تیم یافت نشد.");
    }

    // Only leader can update roles
    const updaterMember = team.members.find((m: any) => m.user.toString() === updatedBy);
    if (!updaterMember || updaterMember.role !== "leader") {
      throw new ApiError(403, "فقط رهبر تیم می‌تواند نقش اعضا را تغییر دهد.");
    }

    // Find member to update
    const memberIndex = team.members.findIndex((m: any) => m.user.toString() === memberIdToUpdate);
    if (memberIndex === -1) {
      throw new ApiError(404, "عضو در تیم یافت نشد.");
    }

    (team.members[memberIndex] as any).role = newRole;
    await team.save();

    return team.populate("members.user", "name email");
  }

  // Invite user to team
  public async inviteUser(
    teamId: string,
    invitedBy: string,
    invitedUserId: string,
    message?: string
  ): Promise<ITeamInvitation> {
    const team = await TeamModel.findById(teamId);
    if (!team) {
      throw new ApiError(404, "تیم یافت نشد.");
    }

    // Check if inviter is leader or co-leader
    const inviterMember = team.members.find((m: any) => m.user.toString() === invitedBy);
    if (!inviterMember || !["leader", "co_leader"].includes(inviterMember.role)) {
      throw new ApiError(403, "فقط رهبر یا همکار رهبر می‌تواند کاربران را دعوت کند.");
    }

    // Check if user is already a member
    const alreadyMember = team.members.some((m: any) => m.user.toString() === invitedUserId);
    if (alreadyMember) {
      throw new ApiError(400, "این کاربر قبلاً عضو تیم است.");
    }

    // Check if there's already a pending invitation
    const existingInvitation = await TeamInvitationModel.findOne({
      team: teamId,
      invitedUser: invitedUserId,
      status: "pending",
    });
    if (existingInvitation) {
      throw new ApiError(400, "دعوت‌نامه فعالی برای این کاربر وجود دارد.");
    }

    // Create invitation
    const invitation = await TeamInvitationModel.create({
      team: new Types.ObjectId(teamId),
      invitedUser: new Types.ObjectId(invitedUserId),
      invitedBy: new Types.ObjectId(invitedBy),
      message,
    });

    return invitation.populate([
      { path: "team", select: "name focusArea" },
      { path: "invitedUser", select: "name email" },
      { path: "invitedBy", select: "name" },
    ]);
  }

  // Respond to team invitation
  public async respondToInvitation(
    invitationId: string,
    userId: string,
    accept: boolean
  ): Promise<{ invitation: ITeamInvitation; team?: ITeam }> {
    const invitation = await TeamInvitationModel.findById(invitationId);
    if (!invitation) {
      throw new ApiError(404, "دعوت‌نامه یافت نشد.");
    }

    // Check if user is the invited user
    if (invitation.invitedUser.toString() !== userId) {
      throw new ApiError(403, "شما مجاز به پاسخ این دعوت‌نامه نیستید.");
    }

    // Check if invitation is still pending
    if (invitation.status !== "pending") {
      throw new ApiError(400, "این دعوت‌نامه قبلاً پاسخ داده شده یا منقضی شده است.");
    }

    // Check if expired
    if (invitation.expiresAt < new Date()) {
      invitation.status = "expired";
      await invitation.save();
      throw new ApiError(400, "این دعوت‌نامه منقضی شده است.");
    }

    invitation.status = accept ? "accepted" : "rejected";
    invitation.respondedAt = new Date();
    await invitation.save();

    let team: ITeam | undefined;

    if (accept) {
      // Add user to team
      team = (await this.addMember(
        invitation.team.toString(),
        invitation.invitedBy.toString(),
        userId,
        "member"
      )) || undefined;
    }

    return {
      invitation: await invitation.populate([
        { path: "team", select: "name focusArea" },
        { path: "invitedUser", select: "name email" },
        { path: "invitedBy", select: "name" },
      ]),
      team,
    };
  }

  // Get user's teams in a need
  public async getUserTeams(needId: string, userId: string): Promise<ITeam[]> {
    const teams = await TeamModel.find({
      need: needId,
      "members.user": userId,
      "members.isActive": true,
    })
      .populate("members.user", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return teams;
  }

  // Get pending invitations for user
  public async getUserInvitations(userId: string): Promise<ITeamInvitation[]> {
    const invitations = await TeamInvitationModel.find({
      invitedUser: userId,
      status: "pending",
      expiresAt: { $gt: new Date() },
    })
      .populate("team", "name focusArea")
      .populate("invitedBy", "name")
      .sort({ createdAt: -1 });

    return invitations;
  }

  // Get team statistics
  public async getTeamStats(teamId: string): Promise<any> {
    const team = await TeamModel.findById(teamId);
    if (!team) {
      throw new ApiError(404, "تیم یافت نشد.");
    }

    const totalMembers = team.members.length;
    const activeMembers = team.members.filter((m: any) => m.isActive).length;
    const tasksCompleted = team.members.reduce((sum: number, m: any) => sum + (m.tasksCompleted || 0), 0);
    const totalContribution = team.members.reduce((sum: number, m: any) => sum + (m.contributionScore || 0), 0);

    return {
      totalMembers,
      activeMembers,
      tasksCompleted,
      totalContribution,
      averageContribution: activeMembers > 0 ? Math.round(totalContribution / activeMembers) : 0,
    };
  }
}

export const teamService = new TeamService();
