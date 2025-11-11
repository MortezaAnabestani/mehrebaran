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
const Events = lazy(() => import("../pages/events/Events"));

// صفحات کم‌استفاده یا سنگین (Lazy Load)
const EditArticle = lazy(() => import("../pages/articles/EditArticle"));
const CreateArticle = lazy(() => import("../pages/articles/CreateArticle"));
const CreateAuthor = lazy(() => import("../pages/authors/CreateAuthor"));
const EditAuthor = lazy(() => import("../pages/authors/EditAuthor"));
const Banners = lazy(() => import("../pages/banners/Banners"));
const Issues = lazy(() => import("../pages/issues/Issues"));
const CreateIssue = lazy(() => import("../pages/issues/CreateIssue"));
const EditIssue = lazy(() => import("../pages/issues/EditIssue"));
const Galleries = lazy(() => import("../pages/galleries/Galleries"));
const CreateGallery = lazy(() => import("../pages/galleries/CreateGallery"));
const EditGallery = lazy(() => import("../pages/galleries/EditGallery"));
const Honors = lazy(() => import("../pages/honors/Honors"));
const CreateHonor = lazy(() => import("../pages/honors/CreateHonor"));
const EditHonor = lazy(() => import("../pages/honors/EditHonor"));
const CreateFAQ = lazy(() => import("../pages/faqs/CreateFAQ"));
const EditFAQ = lazy(() => import("../pages/faqs/EditFAQ"));
const CreateEvent = lazy(() => import("../pages/events/CreateEvent"));
const EditEvent = lazy(() => import("../pages/events/EditEvent"));
const Educations = lazy(() => import("../pages/educations/Educations"));
const CreateEducation = lazy(() => import("../pages/educations/CreateEducation"));
const EditEducation = lazy(() => import("../pages/educations/EditEducation"));
const Sections = lazy(() => import("../pages/sections/Sections"));
const EditSection = lazy(() => import("../pages/sections/EditSection"));
const CalendarPage = lazy(() => import("../pages/calendar/CalendarPage"));
const ApplicationsDashboard = lazy(() => import("../pages/applications/Applications"));
const Admins = lazy(() => import("../pages/admins/Admins"));
const CreateAdmin = lazy(() => import("../pages/admins/CreateAdmin"));
const EditAdmin = lazy(() => import("../pages/admins/EditAdmin"));
const ProfileSettings = lazy(() => import("../pages/profileSettings/ProfileSettings"));
const UploadImage = lazy(() => import("../pages/uploadCenter/UploadCenter"));
const ArticlesChart = lazy(() => import("../pages/charts/ArticlesChart"));
const CampChart = lazy(() => import("../pages/charts/CampChart"));
const SiteViewChart = lazy(() => import("../pages/charts/SiteVieweChart"));
const UsersChart = lazy(() => import("../pages/charts/UsersChart"));
const TheBestChart = lazy(() => import("../pages/charts/TheBestChart"));
const Camp = lazy(() => import("../pages/camp/Camp"));
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
              <Route path="issues" element={<Issues />} />
              <Route path="issues/create" element={<CreateIssue />} />
              <Route path="issues/edit/:id" element={<EditIssue />} />
              <Route path="galleries" element={<Galleries />} />
              <Route path="galleries/create" element={<CreateGallery />} />
              <Route path="galleries/edit/:slug" element={<EditGallery />} />
              <Route path="honors" element={<Honors />} />
              <Route path="honors/create" element={<CreateHonor />} />
              <Route path="honors/edit/:slug" element={<EditHonor />} />
              <Route path="faqs" element={<FAQs />} />
              <Route path="faqs/create" element={<CreateFAQ />} />
              <Route path="faqs/edit/:id" element={<EditFAQ />} />
              <Route path="events" element={<Events />} />
              <Route path="events/create" element={<CreateEvent />} />
              <Route path="events/edit/:slug" element={<EditEvent />} />
              <Route path="educations" element={<Educations />} />
              <Route path="educations/create" element={<CreateEducation />} />
              <Route path="educations/edit/:slug" element={<EditEducation />} />
              <Route path="banner" element={<Banners />} />
              <Route path="sections" element={<Sections />} />
              <Route path="sections/edit/:id" element={<EditSection />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="upload-center" element={<UploadImage />} />
              <Route path="camp" element={<Camp />} />
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
              <Route path="chart/camp" element={<CampChart />} />
              <Route path="chart/view" element={<SiteViewChart />} />
              <Route path="chart/users" element={<UsersChart />} />
              <Route path="chart/thebest" element={<TheBestChart />} />
              <Route path="applications" element={<ApplicationsDashboard />} />
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
