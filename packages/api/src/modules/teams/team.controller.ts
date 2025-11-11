import { Request, Response } from "express";
import { teamService } from "./team.service";
import {
  createTeamSchema,
  updateTeamSchema,
  addMemberSchema,
  updateMemberRoleSchema,
  inviteUserSchema,
  respondToInvitationSchema,
} from "./team.validation";
import asyncHandler from "../../core/utils/asyncHandler";
import ApiError from "../../core/utils/apiError";

class TeamController {
  // Create team
  public createTeam = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createTeamSchema.parse({ body: req.body, params: req.params });
    const { needId } = validatedData.params;
    const createdBy = req.user!._id.toString();

    const team = await teamService.createTeam(needId, createdBy, validatedData.body);

    res.status(201).json({
      message: "تیم با موفقیت ایجاد شد.",
      data: team,
    });
  });

  // Get all teams (optionally filtered by needId)
  public getTeams = asyncHandler(async (req: Request, res: Response) => {
    const { needId } = req.params;
    const { status, focusArea } = req.query;

    console.log("🔍 getTeams called with needId:", needId);
    console.log("🔍 Query params:", { status, focusArea });

    const teams = await teamService.getTeams(needId, {
      status: status as any,
      focusArea: focusArea as any,
    });

    console.log(`✅ Found ${teams.length} teams`);

    res.status(200).json({
      results: teams.length,
      data: teams,
    });
  });

  // Get team by ID
  public getTeamById = asyncHandler(async (req: Request, res: Response) => {
    const { teamId } = req.params;

    const team = await teamService.getTeamById(teamId);
    if (!team) {
      throw new ApiError(404, "تیم یافت نشد.");
    }

    res.status(200).json({
      data: team,
    });
  });

  // Update team
  public updateTeam = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = updateTeamSchema.parse({ body: req.body, params: req.params });
    const { teamId } = validatedData.params;
    const userId = req.user!._id.toString();

    const team = await teamService.updateTeam(teamId, userId, validatedData.body);

    res.status(200).json({
      message: "تیم با موفقیت به‌روزرسانی شد.",
      data: team,
    });
  });

  // Delete team
  public deleteTeam = asyncHandler(async (req: Request, res: Response) => {
    const { teamId } = req.params;
    const userId = req.user!._id.toString();

    await teamService.deleteTeam(teamId, userId);

    res.status(200).json({
      message: "تیم با موفقیت حذف شد.",
    });
  });

  // Add member to team
  public addMember = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = addMemberSchema.parse({ body: req.body, params: req.params });
    const { teamId } = validatedData.params;
    const { userId: newMemberId, role } = validatedData.body;
    const addedBy = req.user!._id.toString();

    const team = await teamService.addMember(teamId, addedBy, newMemberId, role);

    res.status(200).json({
      message: "عضو با موفقیت به تیم اضافه شد.",
      data: team,
    });
  });

  // Remove member from team
  public removeMember = asyncHandler(async (req: Request, res: Response) => {
    const { teamId, userId: memberIdToRemove } = req.params;
    const removedBy = req.user!._id.toString();

    const team = await teamService.removeMember(teamId, removedBy, memberIdToRemove);

    res.status(200).json({
      message: "عضو با موفقیت از تیم حذف شد.",
      data: team,
    });
  });

  // Update member role
  public updateMemberRole = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = updateMemberRoleSchema.parse({ body: req.body, params: req.params });
    const { teamId, userId: memberIdToUpdate } = validatedData.params;
    const { role: newRole } = validatedData.body;
    const updatedBy = req.user!._id.toString();

    const team = await teamService.updateMemberRole(teamId, updatedBy, memberIdToUpdate, newRole);

    res.status(200).json({
      message: "نقش عضو با موفقیت به‌روزرسانی شد.",
      data: team,
    });
  });

  // Invite user to team
  public inviteUser = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = inviteUserSchema.parse({ body: req.body, params: req.params });
    const { teamId } = validatedData.params;
    const { userId: invitedUserId, message } = validatedData.body;
    const invitedBy = req.user!._id.toString();

    const invitation = await teamService.inviteUser(teamId, invitedBy, invitedUserId, message);

    res.status(201).json({
      message: "دعوت‌نامه با موفقیت ارسال شد.",
      data: invitation,
    });
  });

  // Respond to team invitation
  public respondToInvitation = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = respondToInvitationSchema.parse({ body: req.body, params: req.params });
    const { invitationId } = validatedData.params;
    const { accept } = validatedData.body;
    const userId = req.user!._id.toString();

    const result = await teamService.respondToInvitation(invitationId, userId, accept);

    res.status(200).json({
      message: accept ? "شما با موفقیت به تیم پیوستید." : "دعوت‌نامه رد شد.",
      data: result,
    });
  });

  // Get user's teams in a need
  public getUserTeams = asyncHandler(async (req: Request, res: Response) => {
    const { needId } = req.params;
    const userId = req.user!._id.toString();

    const teams = await teamService.getUserTeams(needId, userId);

    res.status(200).json({
      results: teams.length,
      data: teams,
    });
  });

  // Get user's pending invitations
  public getUserInvitations = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();

    const invitations = await teamService.getUserInvitations(userId);

    res.status(200).json({
      results: invitations.length,
      data: invitations,
    });
  });

  // Get team statistics
  public getTeamStats = asyncHandler(async (req: Request, res: Response) => {
    const { teamId } = req.params;

    const stats = await teamService.getTeamStats(teamId);

    res.status(200).json({
      data: stats,
    });
  });
}

export const teamController = new TeamController();
