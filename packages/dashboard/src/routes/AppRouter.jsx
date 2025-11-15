import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardRoot from "../pages/DashboardRoot";
import LoginPage from "../pages/auth/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProtectedRoute from "./ProtectedRoute";
import Loading from "../components/Loading";

// صفحات اصلی (بارگذاری معمولی)
const Articles = lazy(() => import("../pages/articles/Articles"));
const News = lazy(() => import("../pages/news/News"));
const Videos = lazy(() => import("../pages/videos/Videos"));
const Authors = lazy(() => import("../pages/authors/Authors"));
const Tags = lazy(() => import("../pages/tags/Tags"));
const Users = lazy(() => import("../pages/users/Users"));
const Comments = lazy(() => import("../pages/comments/Comments"));
const FAQs = lazy(() => import("../pages/faqs/FAQs"));
const Needs = lazy(() => import("../pages/needs/Needs"));
const Teams = lazy(() => import("../pages/teams/Teams"));
const CreateTeam = lazy(() => import("../pages/teams/CreateTeam"));
const EditTeam = lazy(() => import("../pages/teams/EditTeam"));
const TeamDetails = lazy(() => import("../pages/teams/TeamDetails"));
const Badges = lazy(() => import("../pages/gamification/Badges"));
const CreateBadge = lazy(() => import("../pages/gamification/CreateBadge"));
const EditBadge = lazy(() => import("../pages/gamification/EditBadge"));
const Leaderboard = lazy(() => import("../pages/gamification/Leaderboard"));
const UserStats = lazy(() => import("../pages/gamification/UserStats"));
const PointTransactions = lazy(() => import("../pages/gamification/PointTransactions"));
const Stories = lazy(() => import("../pages/stories/Stories"));
const StoryDetails = lazy(() => import("../pages/stories/StoryDetails"));
const StoryHighlights = lazy(() => import("../pages/stories/StoryHighlights"));
const Projects = lazy(() => import("../pages/projects/Projects"));
const CreateProject = lazy(() => import("../pages/projects/CreateProject"));
const EditProject = lazy(() => import("../pages/projects/EditProject"));
const ProjectDetails = lazy(() => import("../pages/projects/ProjectDetails"));
const Donations = lazy(() => import("../pages/donations/Donations"));
const DonationDetails = lazy(() => import("../pages/donations/DonationDetails"));
const Volunteers = lazy(() => import("../pages/volunteers/Volunteers"));
const VolunteerDetails = lazy(() => import("../pages/volunteers/VolunteerDetails"));
const Follows = lazy(() => import("../pages/social/Follows"));
const Mentions = lazy(() => import("../pages/social/Mentions"));
const SocialTags = lazy(() => import("../pages/social/SocialTags"));
const Shares = lazy(() => import("../pages/social/Shares"));
const Notifications = lazy(() => import("../pages/notifications/Notifications"));
const NotificationSettings = lazy(() => import("../pages/notifications/NotificationSettings"));
const PushTokens = lazy(() => import("../pages/notifications/PushTokens"));
const SiteSettings = lazy(() => import("../pages/settings/SiteSettings"));
const HomePageHeroSettings = lazy(() => import("../pages/settings/HomePageHeroSettings"));
const BlogBackgroundSettings = lazy(() => import("../pages/settings/BlogBackgroundSettings"));
const WhatWeDidStatisticsSettings = lazy(() => import("../pages/settings/WhatWeDidStatisticsSettings"));
const CompletedProjectsPageSettings = lazy(() => import("../pages/settings/CompletedProjectsPageSettings"));
const FocusPageHeroSettings = lazy(() => import("../pages/settings/FocusPageHeroSettings"));
const FeaturedCompletedProjects = lazy(() => import("../pages/projects/FeaturedCompletedProjects"));
const FocusAreas = lazy(() => import("../pages/focus-areas/FocusAreas"));

// صفحات کم‌استفاده یا سنگین (Lazy Load)
const EditArticle = lazy(() => import("../pages/articles/EditArticle"));
const CreateArticle = lazy(() => import("../pages/articles/CreateArticle"));
const CreateNews = lazy(() => import("../pages/news/CreateNews"));
const EditNews = lazy(() => import("../pages/news/EditNews"));
const CreateVideo = lazy(() => import("../pages/videos/CreateVideo"));
const EditVideo = lazy(() => import("../pages/videos/EditVideo"));
const CreateAuthor = lazy(() => import("../pages/authors/CreateAuthor"));
const EditAuthor = lazy(() => import("../pages/authors/EditAuthor"));
const Galleries = lazy(() => import("../pages/galleries/Galleries"));
const CreateGallery = lazy(() => import("../pages/galleries/CreateGallery"));
const EditGallery = lazy(() => import("../pages/galleries/EditGallery"));
const CreateFAQ = lazy(() => import("../pages/faqs/CreateFAQ"));
const EditFAQ = lazy(() => import("../pages/faqs/EditFAQ"));
const CreateNeed = lazy(() => import("../pages/needs/CreateNeed"));
const EditNeed = lazy(() => import("../pages/needs/EditNeed"));
const NeedDetails = lazy(() => import("../pages/needs/NeedDetails"));
const Sections = lazy(() => import("../pages/sections/Sections"));
const EditSection = lazy(() => import("../pages/sections/EditSection"));
const Categories = lazy(() => import("../pages/categories/Categories"));
const CreateCategory = lazy(() => import("../pages/categories/CreateCategory"));
const EditCategory = lazy(() => import("../pages/categories/EditCategory"));
const CalendarPage = lazy(() => import("../pages/calendar/CalendarPage"));
const Admins = lazy(() => import("../pages/admins/Admins"));
const CreateAdmin = lazy(() => import("../pages/admins/CreateAdmin"));
const EditAdmin = lazy(() => import("../pages/admins/EditAdmin"));
const ProfileSettings = lazy(() => import("../pages/profileSettings/ProfileSettings"));
const UploadImage = lazy(() => import("../pages/uploadCenter/UploadCenter"));
const ArticlesChart = lazy(() => import("../pages/charts/ArticlesChart"));
const SiteViewChart = lazy(() => import("../pages/charts/SiteVieweChart"));
const UsersChart = lazy(() => import("../pages/charts/UsersChart"));
const TheBestChart = lazy(() => import("../pages/charts/TheBestChart"));
const ReportBug = lazy(() => import("../pages/report-bug/ReportBug"));

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* مسیر ورود */}
          <Route path="/" element={<LoginPage />} />

          {/* مسیرهای داشبورد که نیاز به ورود دارند */}
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["admin", "manager"]} />}>
            <Route element={<DashboardLayout />}>
              <Route index element={<DashboardRoot />} />

              {/* مسیرهایی که هم admin و هم manager می‌تونن ببینن */}
              <Route path="articles" element={<Articles />} />
              <Route path="articles/create" element={<CreateArticle />} />
              <Route path="articles/edit/:slug" element={<EditArticle />} />
              <Route path="news" element={<News />} />
              <Route path="news/create" element={<CreateNews />} />
              <Route path="news/edit/:id" element={<EditNews />} />
              <Route path="videos" element={<Videos />} />
              <Route path="videos/create" element={<CreateVideo />} />
              <Route path="videos/edit/:slug" element={<EditVideo />} />
              <Route path="authors" element={<Authors />} />
              <Route path="authors/create" element={<CreateAuthor />} />
              <Route path="authors/edit/:slug" element={<EditAuthor />} />
              <Route path="tags" element={<Tags />} />
              <Route path="galleries" element={<Galleries />} />
              <Route path="galleries/create" element={<CreateGallery />} />
              <Route path="galleries/edit/:slug" element={<EditGallery />} />
              <Route path="faqs" element={<FAQs />} />
              <Route path="faqs/create" element={<CreateFAQ />} />
              <Route path="faqs/edit/:id" element={<EditFAQ />} />
              <Route path="needs" element={<Needs />} />
              <Route path="needs/create" element={<CreateNeed />} />
              <Route path="needs/edit/:id" element={<EditNeed />} />
              <Route path="needs/:id" element={<NeedDetails />} />
              <Route path="teams" element={<Teams />} />
              <Route path="teams/create/:needId" element={<CreateTeam />} />
              <Route path="teams/edit/:teamId" element={<EditTeam />} />
              <Route path="teams/:teamId" element={<TeamDetails />} />
              <Route path="gamification/badges" element={<Badges />} />
              <Route path="gamification/badges/create" element={<CreateBadge />} />
              <Route path="gamification/badges/edit/:badgeId" element={<EditBadge />} />
              <Route path="gamification/leaderboard" element={<Leaderboard />} />
              <Route path="gamification/user-stats" element={<UserStats />} />
              <Route path="gamification/user-stats/:userId" element={<UserStats />} />
              <Route path="gamification/point-transactions" element={<PointTransactions />} />
              <Route path="stories" element={<Stories />} />
              <Route path="stories/:storyId" element={<StoryDetails />} />
              <Route path="stories/highlights" element={<StoryHighlights />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/create" element={<CreateProject />} />
              <Route path="projects/edit/:id" element={<EditProject />} />
              <Route path="projects/:id" element={<ProjectDetails />} />
              <Route path="projects/featured-completed" element={<FeaturedCompletedProjects />} />
              <Route path="donations" element={<Donations />} />
              <Route path="donations/:id" element={<DonationDetails />} />
              <Route path="volunteers" element={<Volunteers />} />
              <Route path="volunteers/:id" element={<VolunteerDetails />} />
              <Route path="social/follows" element={<Follows />} />
              <Route path="social/mentions" element={<Mentions />} />
              <Route path="social/tags" element={<SocialTags />} />
              <Route path="social/shares" element={<Shares />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="notifications/settings" element={<NotificationSettings />} />
              <Route path="notifications/push-tokens" element={<PushTokens />} />
              <Route path="settings" element={<SiteSettings />} />
              <Route path="settings/home-hero" element={<HomePageHeroSettings />} />
              <Route path="settings/blog-background" element={<BlogBackgroundSettings />} />
              <Route path="settings/what-we-did-statistics" element={<WhatWeDidStatisticsSettings />} />
              <Route path="settings/completed-projects-page" element={<CompletedProjectsPageSettings />} />
              <Route path="settings/focus-page-hero" element={<FocusPageHeroSettings />} />
              <Route path="focus-areas" element={<FocusAreas />} />
              <Route path="sections" element={<Sections />} />
              <Route path="sections/edit/:id" element={<EditSection />} />
              <Route path="categories" element={<Categories />} />
              <Route path="categories/create" element={<CreateCategory />} />
              <Route path="categories/edit/:id" element={<EditCategory />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="upload-center" element={<UploadImage />} />
              <Route path="profile/:id" element={<ProfileSettings />} />
              <Route path="report-bug" element={<ReportBug />} />
            </Route>
          </Route>

          {/* مسیرهایی فقط برای manager */}
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["manager"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="comments" element={<Comments />} />
              <Route path="users" element={<Users />} />
              <Route path="chart/articles" element={<ArticlesChart />} />
              <Route path="chart/view" element={<SiteViewChart />} />
              <Route path="chart/users" element={<UsersChart />} />
              <Route path="chart/thebest" element={<TheBestChart />} />
              <Route path="admins" element={<Admins />} />
              <Route path="admins/create" element={<CreateAdmin />} />
              <Route path="admins/edit/:id" element={<EditAdmin />} />
            </Route>
          </Route>

          {/* مسیر 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
