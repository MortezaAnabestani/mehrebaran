import { model, Model, Types } from "mongoose";
import type {
  INeed,
  IUser,
  ITeam,
  INeedRecommendation,
  IUserRecommendation,
  ITeamRecommendation,
  IUserPreferences,
  RecommendationStrategy,
  IRecommendationReason,
} from "common-types";

class RecommendationsService {
  private NeedModel: Model<INeed>;
  private UserModel: Model<IUser>;
  private TeamModel: Model<ITeam>;

  constructor() {
    this.NeedModel = model("Need") as any;
    this.UserModel = model("User") as any;
    this.TeamModel = model("Team") as any;
  }

  /**
   * توصیه نیازها به کاربر
   */
  public async recommendNeeds(
    userId: string,
    strategy: RecommendationStrategy = "hybrid",
    limit: number = 20
  ): Promise<INeedRecommendation[]> {
    const preferences = await this.getUserPreferences(userId);

    let recommendations: INeedRecommendation[] = [];

    switch (strategy) {
      case "collaborative":
        recommendations = await this.collaborativeFilteringNeeds(userId, preferences, limit);
        break;
      case "content_based":
        recommendations = await this.contentBasedFilteringNeeds(userId, preferences, limit);
        break;
      case "popular":
        recommendations = await this.popularNeeds(userId, limit);
        break;
      case "trending":
        recommendations = await this.trendingNeeds(userId, limit);
        break;
      case "hybrid":
      default:
        // ترکیب چند استراتژی
        const [collaborative, contentBased, popular] = await Promise.all([
          this.collaborativeFilteringNeeds(userId, preferences, limit / 2),
          this.contentBasedFilteringNeeds(userId, preferences, limit / 2),
          this.popularNeeds(userId, limit / 4),
        ]);
        recommendations = this.mergeAndRankRecommendations([
          ...collaborative,
          ...contentBased,
          ...popular,
        ]).slice(0, limit);
        break;
    }

    return recommendations;
  }

  /**
   * توصیه کاربران
   */
  public async recommendUsers(
    userId: string,
    limit: number = 20
  ): Promise<IUserRecommendation[]> {
    const FollowModel = model("Follow");

    // دریافت کاربرانی که این کاربر دنبال می‌کند
    const following = await FollowModel.find({
      follower: userId,
      followType: "user",
    })
      .select("following")
      .lean();

    const followingIds = following.map((f: any) => f.following.toString());

    // پیدا کردن کاربرانی که دوستان این کاربر آنها را دنبال می‌کنند
    const mutualFollows = await FollowModel.aggregate([
      {
        $match: {
          follower: { $in: followingIds.map((id) => new Types.ObjectId(id)) },
          followType: "user",
          following: { $ne: new Types.ObjectId(userId) },
        },
      },
      {
        $group: {
          _id: "$following",
          mutualCount: { $sum: 1 },
          mutualFriends: { $push: "$follower" },
        },
      },
      {
        $match: {
          _id: { $nin: followingIds.map((id) => new Types.ObjectId(id)) },
        },
      },
      {
        $sort: { mutualCount: -1 },
      },
      {
        $limit: limit,
      },
    ]);

    // دریافت اطلاعات کاربران و محاسبه امتیازات
    const recommendationResults = await Promise.all(
      mutualFollows.map(async (mf) => {
        const user = await this.UserModel.findById(mf._id)
          .select("name email avatar bio skills interests")
          .lean();

        if (!user) return null;

        const UserStatsModel = model("UserStats");
        const userStats = await UserStatsModel.findOne({ userId: mf._id }).lean();

        const activityLevel = userStats
          ? ((userStats as any).totalPoints || 0) / 1000 // نرمال‌سازی
          : 0;

        const mutualConnections = mf.mutualCount;
        const similarInterests = await this.calculateSimilarInterests(userId, mf._id.toString());
        const complementarySkills = await this.calculateComplementarySkills(
          userId,
          mf._id.toString()
        );

        const matchScore = {
          mutualConnections: Math.min(mutualConnections / 10, 1), // نرمال‌سازی
          similarInterests,
          complementarySkills,
          activityLevel: Math.min(activityLevel, 1),
        };

        const totalScore =
          matchScore.mutualConnections * 40 +
          matchScore.similarInterests * 30 +
          matchScore.complementarySkills * 20 +
          matchScore.activityLevel * 10;

        const reasons: IRecommendationReason[] = [
          {
            type: "similar_users",
            description: `${mutualConnections} دوست مشترک`,
            weight: 0.4,
          },
        ];

        if (similarInterests > 0.5) {
          reasons.push({
            type: "similar_content",
            description: "علایق مشترک",
            weight: 0.3,
          });
        }

        return {
          item: user,
          itemType: "users" as const,
          score: Math.round(totalScore),
          confidence: Math.min(mutualConnections / 20, 0.95),
          reasons,
          strategy: "collaborative",
          matchScore,
        };
      })
    );

    return recommendationResults.filter((r) => r !== null) as IUserRecommendation[];
  }

  /**
   * توصیه تیم‌ها
   */
  public async recommendTeams(
    userId: string,
    limit: number = 20
  ): Promise<ITeamRecommendation[]> {
    const preferences = await this.getUserPreferences(userId);
    const userProfile = await this.UserModel.findById(userId).select("skills interests").lean();

    // پیدا کردن تیم‌هایی که کاربر عضو نیست
    const teams = await this.TeamModel.find({
      members: { $ne: userId },
      status: "active",
    })
      .populate("need", "title category tags")
      .populate("lead", "name")
      .limit(limit * 2)
      .lean();

    const recommendations: ITeamRecommendation[] = await Promise.all(
      teams.map(async (team: any) => {
        // محاسبه تطابق دسته‌بندی
        const categoryMatch = team.need?.category
          ? preferences.favoriteCategories.includes(team.need.category.toString())
            ? 1
            : 0
          : 0;

        // محاسبه تطابق مهارت
        const requiredSkills = team.requiredSkills || [];
        const userSkills = (userProfile as any)?.skills || [];
        const matchingSkills = requiredSkills.filter((skill: string) =>
          userSkills.includes(skill)
        ).length;
        const skillMatch =
          requiredSkills.length > 0 ? matchingSkills / requiredSkills.length : 0;

        // محاسبه تطابق نیاز
        const needMatch = team.need
          ? preferences.interactedNeeds.includes(team.need._id.toString())
            ? 1
            : 0
          : 0;

        // محاسبه سطح فعالیت تیم
        const activityLevel = team.members?.length || 0 > 0 ? 0.7 : 0.3;

        const matchScore = {
          categoryMatch,
          skillMatch,
          needMatch,
          activityLevel,
        };

        const totalScore =
          categoryMatch * 30 + skillMatch * 40 + needMatch * 20 + activityLevel * 10;

        const reasons: IRecommendationReason[] = [];

        if (categoryMatch > 0) {
          reasons.push({
            type: "category_match",
            description: "تطابق دسته‌بندی",
            weight: 0.3,
          });
        }

        if (skillMatch > 0.5) {
          reasons.push({
            type: "skill_match",
            description: `تطابق ${matchingSkills} مهارت`,
            weight: 0.4,
          });
        }

        if (needMatch > 0) {
          reasons.push({
            type: "previous_interaction",
            description: "تعامل قبلی با نیاز",
            weight: 0.2,
          });
        }

        return {
          item: team,
          itemType: "teams" as const,
          score: Math.round(totalScore),
          confidence: skillMatch > 0 ? 0.8 : 0.5,
          reasons,
          strategy: "content_based",
          matchScore,
        };
      })
    );

    // مرتب‌سازی و محدود کردن
    recommendations.sort((a, b) => b.score - a.score);
    return recommendations.slice(0, limit);
  }

  /**
   * دریافت ترجیحات کاربر از تاریخچه تعاملات
   */
  public async getUserPreferences(userId: string): Promise<IUserPreferences> {
    const FollowModel = model("Follow");
    const PointTransactionModel = model("PointTransaction");

    // دریافت نیازهایی که کاربر با آنها تعامل داشته
    const interactions = await PointTransactionModel.find({
      user: userId,
      action: { $in: ["need_support", "need_upvote", "comment_posted"] },
      relatedModel: "Need",
    })
      .select("relatedId")
      .lean();

    const interactedNeedIds = [...new Set(interactions.map((i: any) => i.relatedId))];

    // دریافت نیازها برای استخراج دسته‌بندی و تگ
    const needs = await this.NeedModel.find({
      _id: { $in: interactedNeedIds },
    })
      .select("category tags location")
      .lean();

    const favoriteCategories = [
      ...new Set(needs.map((n: any) => n.category?.toString()).filter(Boolean)),
    ];

    const favoriteTags = [
      ...new Set(needs.flatMap((n: any) => n.tags || []).map((t: string) => t.toLowerCase())),
    ];

    const preferredLocations = [
      ...new Set(needs.map((n: any) => n.location?.city).filter(Boolean)),
    ];

    // دریافت کاربران دنبال شده
    const follows = await FollowModel.find({
      follower: userId,
      followType: "user",
    })
      .select("following")
      .lean();

    const followedUsers = follows.map((f: any) => f.following.toString());

    // دریافت دسته‌بندی‌های حمایت شده
    const supportedNeeds = await PointTransactionModel.find({
      user: userId,
      action: "need_support",
      relatedModel: "Need",
    })
      .select("relatedId")
      .lean();

    const supportedNeedIds = supportedNeeds.map((s: any) => s.relatedId);
    const supportedNeedDetails = await this.NeedModel.find({
      _id: { $in: supportedNeedIds },
    })
      .select("category")
      .lean();

    const supportedCategories = [
      ...new Set(supportedNeedDetails.map((n: any) => n.category?.toString()).filter(Boolean)),
    ];

    // استخراج مهارت‌ها از پروفایل کاربر
    const userProfile = await this.UserModel.findById(userId).select("skills interests").lean();
    const skillsInterested = (userProfile as any)?.skills || [];

    return {
      userId,
      favoriteCategories,
      favoriteTags,
      preferredLocations,
      interactedNeeds: interactedNeedIds,
      followedUsers,
      supportedCategories,
      skillsInterested,
      lastUpdated: new Date(),
    };
  }

  /**
   * فیلتر همکارانه - بر اساس کاربران مشابه
   */
  private async collaborativeFilteringNeeds(
    userId: string,
    preferences: IUserPreferences,
    limit: number
  ): Promise<INeedRecommendation[]> {
    // پیدا کردن کاربران مشابه (کسانی که نیازهای مشابه را حمایت کرده‌اند)
    const PointTransactionModel = model("PointTransaction");

    const similarUsers = await PointTransactionModel.aggregate([
      {
        $match: {
          relatedModel: "Need",
          relatedId: { $in: preferences.interactedNeeds },
          user: { $ne: new Types.ObjectId(userId) },
        },
      },
      {
        $group: {
          _id: "$user",
          commonNeeds: { $addToSet: "$relatedId" },
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          count: { $gte: 2 }, // حداقل 2 نیاز مشترک
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 20,
      },
    ]);

    if (similarUsers.length === 0) {
      return [];
    }

    const similarUserIds = similarUsers.map((u) => u._id);

    // پیدا کردن نیازهایی که کاربران مشابه با آنها تعامل داشته‌اند
    const recommendedNeedIds = await PointTransactionModel.aggregate([
      {
        $match: {
          user: { $in: similarUserIds },
          relatedModel: "Need",
          relatedId: { $nin: preferences.interactedNeeds },
        },
      },
      {
        $group: {
          _id: "$relatedId",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: limit,
      },
    ]);

    // دریافت اطلاعات نیازها
    const needIds = recommendedNeedIds.map((n) => n._id);
    const needs = await this.NeedModel.find({
      _id: { $in: needIds },
      status: { $in: ["active", "in_progress"] },
    })
      .populate("createdBy", "name avatar")
      .populate("category", "name slug")
      .lean();

    // ساخت recommendations
    const recommendations: INeedRecommendation[] = needs.map((need: any) => {
      const recommendCount =
        recommendedNeedIds.find((n) => n._id.toString() === need._id.toString())?.count || 0;

      const score = Math.min((recommendCount / similarUsers.length) * 100, 100);

      const reasons: IRecommendationReason[] = [
        {
          type: "similar_users",
          description: `${recommendCount} کاربر مشابه این نیاز را پسندیده‌اند`,
          weight: 1,
        },
      ];

      return {
        item: need,
        itemType: "needs",
        score: Math.round(score),
        confidence: Math.min(recommendCount / 10, 0.9),
        reasons,
        strategy: "collaborative",
        matchScore: {
          categoryMatch: 0,
          tagMatch: 0,
          locationMatch: 0,
          skillMatch: 0,
          popularityScore: score / 100,
        },
      };
    });

    return recommendations;
  }

  /**
   * فیلتر مبتنی بر محتوا - بر اساس ویژگی‌های نیاز
   */
  private async contentBasedFilteringNeeds(
    userId: string,
    preferences: IUserPreferences,
    limit: number
  ): Promise<INeedRecommendation[]> {
    // پیدا کردن نیازهایی با دسته‌بندی، تگ، یا موقعیت مشابه
    const query: any = {
      status: { $in: ["active", "in_progress"] },
      _id: { $nin: preferences.interactedNeeds },
      createdBy: { $ne: userId },
    };

    if (preferences.favoriteCategories.length > 0) {
      query.category = { $in: preferences.favoriteCategories };
    }

    const needs = await this.NeedModel.find(query)
      .populate("createdBy", "name avatar")
      .populate("category", "name slug")
      .limit(limit * 2)
      .lean();

    // محاسبه امتیاز تطابق برای هر نیاز
    const recommendations: INeedRecommendation[] = needs.map((need: any) => {
      const categoryMatch = preferences.favoriteCategories.includes(
        need.category?._id?.toString()
      )
        ? 1
        : 0;

      const needTags = (need.tags || []).map((t: string) => t.toLowerCase());
      const matchingTags = needTags.filter((t: string) => preferences.favoriteTags.includes(t));
      const tagMatch = needTags.length > 0 ? matchingTags.length / needTags.length : 0;

      const locationMatch =
        need.location?.city && preferences.preferredLocations.includes(need.location.city) ? 1 : 0;

      const skillMatch = 0; // نیاز به اطلاعات مهارت‌های مورد نیاز

      const popularityScore = (need.supporters?.length || 0) / 100; // نرمال‌سازی

      const matchScore = {
        categoryMatch,
        tagMatch,
        locationMatch,
        skillMatch,
        popularityScore: Math.min(popularityScore, 1),
      };

      const totalScore =
        categoryMatch * 40 + tagMatch * 30 + locationMatch * 15 + popularityScore * 15;

      const reasons: IRecommendationReason[] = [];

      if (categoryMatch > 0) {
        reasons.push({
          type: "category_match",
          description: "دسته‌بندی مورد علاقه شما",
          weight: 0.4,
        });
      }

      if (matchingTags.length > 0) {
        reasons.push({
          type: "tag_match",
          description: `تطابق ${matchingTags.length} تگ`,
          weight: 0.3,
        });
      }

      if (locationMatch > 0) {
        reasons.push({
          type: "location_match",
          description: "موقعیت مکانی مورد علاقه",
          weight: 0.15,
        });
      }

      if (popularityScore > 0.5) {
        reasons.push({
          type: "popular",
          description: "محبوب در جامعه",
          weight: 0.15,
        });
      }

      return {
        item: need,
        itemType: "needs",
        score: Math.round(totalScore),
        confidence: reasons.length > 0 ? 0.75 : 0.4,
        reasons,
        strategy: "content_based",
        matchScore,
      };
    });

    // مرتب‌سازی و محدود کردن
    recommendations.sort((a, b) => b.score - a.score);
    return recommendations.slice(0, limit);
  }

  /**
   * نیازهای محبوب
   */
  private async popularNeeds(userId: string, limit: number): Promise<INeedRecommendation[]> {
    const preferences = await this.getUserPreferences(userId);

    const needs = await this.NeedModel.find({
      status: { $in: ["active", "in_progress"] },
      _id: { $nin: preferences.interactedNeeds },
    })
      .populate("createdBy", "name avatar")
      .populate("category", "name slug")
      .sort({ "supporters.length": -1 })
      .limit(limit)
      .lean();

    return needs.map((need: any, index) => ({
      item: need,
      itemType: "needs",
      score: Math.round(((limit - index) / limit) * 100),
      confidence: 0.6,
      reasons: [
        {
          type: "popular",
          description: `${need.supporters?.length || 0} نفر حمایت کرده‌اند`,
          weight: 1,
        },
      ],
      strategy: "popular",
      matchScore: {
        categoryMatch: 0,
        tagMatch: 0,
        locationMatch: 0,
        skillMatch: 0,
        popularityScore: (need.supporters?.length || 0) / 100,
      },
    }));
  }

  /**
   * نیازهای ترندینگ
   */
  private async trendingNeeds(userId: string, limit: number): Promise<INeedRecommendation[]> {
    const { trendingService } = await import("./trending.service");
    const trendingNeeds = await trendingService.getTrendingNeeds("24h", limit);

    return trendingNeeds.map((need, index) => ({
      item: need as any,
      itemType: "needs" as const,
      score: Math.round(need.trendingScore.totalScore),
      confidence: 0.7,
      reasons: [
        {
          type: "trending",
          description: `در حال ترند (امتیاز: ${Math.round(need.trendingScore.totalScore)})`,
          weight: 1,
        },
      ],
      strategy: "trending" as const,
      matchScore: {
        categoryMatch: 0,
        tagMatch: 0,
        locationMatch: 0,
        skillMatch: 0,
        popularityScore: need.trendingScore.totalScore / 100,
      },
    }));
  }

  /**
   * ادغام و رتبه‌بندی توصیه‌ها
   */
  private mergeAndRankRecommendations(
    recommendations: INeedRecommendation[]
  ): INeedRecommendation[] {
    // حذف تکراری‌ها
    const uniqueMap = new Map<string, INeedRecommendation>();

    recommendations.forEach((rec) => {
      const needId = (rec.item as any)._id.toString();
      const existing = uniqueMap.get(needId);

      if (!existing || rec.score > existing.score) {
        uniqueMap.set(needId, rec);
      }
    });

    // مرتب‌سازی بر اساس امتیاز
    return Array.from(uniqueMap.values()).sort((a, b) => b.score - a.score);
  }

  /**
   * محاسبه شباهت علایق بین دو کاربر
   */
  private async calculateSimilarInterests(userId1: string, userId2: string): Promise<number> {
    const [pref1, pref2] = await Promise.all([
      this.getUserPreferences(userId1),
      this.getUserPreferences(userId2),
    ]);

    // محاسبه تطابق دسته‌بندی‌ها
    const commonCategories = pref1.favoriteCategories.filter((c: string) =>
      pref2.favoriteCategories.includes(c)
    ).length;

    const totalCategories = new Set([
      ...pref1.favoriteCategories,
      ...pref2.favoriteCategories,
    ]).size;

    const categoryScore = totalCategories > 0 ? commonCategories / totalCategories : 0;

    // محاسبه تطابق تگ‌ها
    const commonTags = pref1.favoriteTags.filter((t: string) => pref2.favoriteTags.includes(t)).length;
    const totalTags = new Set([...pref1.favoriteTags, ...pref2.favoriteTags]).size;
    const tagScore = totalTags > 0 ? commonTags / totalTags : 0;

    return (categoryScore + tagScore) / 2;
  }

  /**
   * محاسبه مهارت‌های مکمل بین دو کاربر
   */
  private async calculateComplementarySkills(userId1: string, userId2: string): Promise<number> {
    const [user1, user2] = await Promise.all([
      this.UserModel.findById(userId1).select("skills").lean(),
      this.UserModel.findById(userId2).select("skills").lean(),
    ]);

    if (!(user1 as any)?.skills || !(user2 as any)?.skills) return 0;

    const skills1 = (user1 as any).skills as string[];
    const skills2 = (user2 as any).skills as string[];

    // مهارت‌های مکمل: مهارت‌هایی که یکی دارد و دیگری ندارد
    const complementary1 = skills1.filter((s) => !skills2.includes(s)).length;
    const complementary2 = skills2.filter((s) => !skills1.includes(s)).length;

    const totalSkills = new Set([...skills1, ...skills2]).size;

    return totalSkills > 0 ? (complementary1 + complementary2) / (totalSkills * 2) : 0;
  }

  /**
   * دریافت توصیه‌های شخصی‌سازی شده (ترکیب همه)
   */
  public async getPersonalizedRecommendations(userId: string) {
    const [needs, users, teams] = await Promise.all([
      this.recommendNeeds(userId, "hybrid", 10),
      this.recommendUsers(userId, 10),
      this.recommendTeams(userId, 10),
    ]);

    return {
      needs,
      users,
      teams,
      generatedAt: new Date(),
    };
  }
}

export const recommendationsService = new RecommendationsService();
