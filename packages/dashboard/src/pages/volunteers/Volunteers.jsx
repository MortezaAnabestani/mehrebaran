import VolunteersList from "../../components/lists/VolunteersList";

const Volunteers = () => {
  return (
    <div className="bg-white rounded-md">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-xl font-medium">فهرست داوطلبان</h2>
      </div>
      <VolunteersList />
    </div>
  );
};

export default Volunteers;
