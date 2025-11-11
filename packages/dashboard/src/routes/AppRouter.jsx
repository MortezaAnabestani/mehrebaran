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

// صفحات کم‌استفاده یا سنگین (Lazy Load)
const EditArticle = lazy(() => import("../pages/articles/EditArticle"));
const CreateArticle = lazy(() => import("../pages/articles/CreateArticle"));
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
              <Route path="sections" element={<Sections />} />
              <Route path="sections/edit/:id" element={<EditSection />} />
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
