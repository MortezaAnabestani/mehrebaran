import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects, updateProject } from "../../features/projectsSlice";
import { Link } from "react-router-dom";

const FeaturedCompletedProjects = () => {
  const dispatch = useDispatch();
  const { projects, loading } = useSelector((state) => state.projects);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        await dispatch(fetchProjects({ limit: 1000 })).unwrap();
      } catch (error) {
        console.error("خطا در بارگذاری پروژه‌ها:", error);
      }
    };

    loadProjects();
  }, [dispatch]);

  useEffect(() => {
    if (projects?.data) {
      const completed = projects.data.filter((p) => p.status === "completed");
      setCompletedProjects(completed);
    }
  }, [projects]);

  const handleToggleFeatured = async (project) => {
    setUpdatingId(project._id);

    try {
      const formData = new FormData();
      formData.append("isFeaturedInCompleted", !project.isFeaturedInCompleted);

      await dispatch(
        updateProject({
          id: project._id,
          formData,
        })
      ).unwrap();

      // به‌روزرسانی لیست
      await dispatch(fetchProjects({ limit: 1000 })).unwrap();
    } catch (error) {
      console.error("خطا در به‌روزرسانی پروژه:", error);
      alert("خطا در به‌روزرسانی وضعیت پروژه");
    } finally {
      setUpdatingId(null);
    }
  };

  const featuredCount = completedProjects.filter((p) => p.isFeaturedInCompleted).length;

  return (
    <div>
      <div className="bg-white rounded-md mb-6">
        <div className="flex items-center justify-between p-4">
          <div>
            <h2 className="text-xl font-medium">پروژه‌های برجسته در صفحه تکمیل شده</h2>
            <p className="text-sm text-gray-600 mt-1">
              {featuredCount} پروژه برای نمایش انتخاب شده‌اند
            </p>
          </div>
          <Link
            rel="preconnect"
            to="/dashboard/projects"
            className="px-3 py-[6px] bg-gray-600 rounded-md hover:bg-gray-700 text-white"
          >
            بازگشت به پروژه‌ها
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-md p-6">
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 راهنما</h3>
          <p className="text-sm text-blue-800 leading-relaxed">
            پروژه‌هایی که وضعیت آنها "تکمیل شده" است در این لیست نمایش داده می‌شوند. با استفاده از کلید کنار هر
            پروژه، می‌توانید آن را برای نمایش در صفحه <code className="bg-white px-1 rounded">/projects/completed</code>{" "}
            انتخاب کنید.
          </p>
          <p className="text-sm text-blue-800 mt-2">
            پروژه‌های انتخاب شده در صفحه مخصوص پروژه‌های تکمیل شده سایت نمایش داده خواهند شد.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : completedProjects.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600 mb-4">هنوز هیچ پروژه تکمیل شده‌ای وجود ندارد.</p>
            <Link to="/dashboard/projects" className="text-blue-600 hover:underline">
              مشاهده همه پروژه‌ها
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تصویر
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    عنوان
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    دسته‌بندی
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    بودجه جمع‌آوری شده
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    نمایش در صفحه
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {completedProjects.map((project) => (
                  <tr key={project._id} className={project.isFeaturedInCompleted ? "bg-green-50" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}${
                          project.featuredImage?.desktop
                        }`}
                        alt={project.title}
                        className="h-12 w-12 rounded-md object-cover"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{project.title}</div>
                      {project.subtitle && <div className="text-sm text-gray-500">{project.subtitle}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {project.category?.name || "بدون دسته"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {project.amountRaised?.toLocaleString()} از {project.targetAmount?.toLocaleString()} تومان
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {project.isFeaturedInCompleted ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 font-medium">
                          ✓ در حال نمایش
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                          عدم نمایش
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleToggleFeatured(project)}
                        disabled={updatingId === project._id}
                        className={`px-4 py-2 rounded-md font-medium ${
                          project.isFeaturedInCompleted
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-green-500 hover:bg-green-600 text-white"
                        } ${updatingId === project._id ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {updatingId === project._id
                          ? "در حال بروزرسانی..."
                          : project.isFeaturedInCompleted
                          ? "حذف از نمایش"
                          : "افزودن به نمایش"}
                      </button>
                      <Link
                        to={`/dashboard/projects/edit/${project._id}`}
                        className="mr-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md inline-block"
                      >
                        ویرایش
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedCompletedProjects;
