import DonationsList from "../../components/lists/DonationsList";

const Donations = () => {
  return (
    <div className="bg-white rounded-md">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-xl font-medium">فهرست کمک‌های مالی</h2>
      </div>
      <DonationsList />
    </div>
  );
};

export default Donations;
