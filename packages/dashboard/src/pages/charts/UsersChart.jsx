import { lazy, Suspense } from "react";
import DashboardSkeleton from "../../components/DashboardSkeleton";

const ApplicationsChart = lazy(() => import("./ApplicationsChart"));
const MembersChart = lazy(() => import("./MembersChart"));

const UsersChart = () => {
  return (
    <div>
      <Suspense fallback={<DashboardSkeleton />}>
        <MembersChart />
        <ApplicationsChart />
      </Suspense>
    </div>
  );
};

export default UsersChart;
