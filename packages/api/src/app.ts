import express from "express";
import cors from "cors";
import path from "path";
import globalErrorHandler from "./core/middlewares/errorHandler";

import userRoutes from "./modules/users/user.routes";
import authRoutes from "./modules/auth/auth.routes";
import categoryRoutes from "./modules/categories/category.routes";
import projectRoutes from "./modules/projects/project.routes";
import uploadRoutes from "./modules/upload/upload.routes";
import publicUploadRoutes from "./modules/public-upload/public-upload.routes";
import faqRoutes from "./modules/faqs/faq.routes";
import settingRoutes from "./modules/settings/setting.routes";
import tagRoutes from "./modules/tag/tag.routes";
import authorRoutes from "./modules/author/author.routes";
import commentRoutes from "./modules/comment/comment.routes";
import newsRoutes from "./modules/news/news.routes";
import articleRoutes from "./modules/blog/articles/article.routes";
import videoRoutes from "./modules/blog/videos/video.routes";
import galleryRoutes from "./modules/blog/gallery/gallery.routes";
import featuredItemsRoutes from "./modules/blog/featuredItems/featured.routes";
import needCategoryRoutes from "./modules/need-categories/needCategory.routes";
import needRoutes from "./modules/needs/need.routes";
import teamInvitationRoutes from "./modules/teams/teamInvitation.routes";
import gamificationRoutes from "./modules/gamification/gamification.routes";
import socialRoutes from "./modules/social/social.routes";
import discoveryRoutes from "./modules/discovery/discovery.routes";
import notificationRoutes from "./modules/notifications/notification.routes";
import storyRoutes from "./modules/stories/story.routes";
import mediaRoutes from "./modules/stories/media.routes";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/public-upload", publicUploadRoutes);
app.use("/api/v1/faqs", faqRoutes);
app.use("/api/v1/settings", settingRoutes);
app.use("/api/v1/tags", tagRoutes);
app.use("/api/v1/authors", authorRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/news", newsRoutes);
app.use("/api/v1/blog/articles", articleRoutes);
app.use("/api/v1/blog/videos", videoRoutes);
app.use("/api/v1/blog/gallery", galleryRoutes);
app.use("/api/v1/blog/featured-items", featuredItemsRoutes);
app.use("/api/v1/need-categories", needCategoryRoutes);
app.use("/api/v1/needs", needRoutes);
app.use("/api/v1/team-invitations", teamInvitationRoutes);
app.use("/api/v1/gamification", gamificationRoutes);
app.use("/api/v1/social", socialRoutes);
app.use("/api/v1/discovery", discoveryRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/stories", storyRoutes);
app.use("/api/v1/media", mediaRoutes);

app.use(globalErrorHandler);

app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;
