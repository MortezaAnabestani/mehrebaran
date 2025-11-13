const ConfirmDelete = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null; // اگر مودال باز نبود، نمایش داده نشود

  return (
    <div className="fixed inset-0 bg-red-200/50 flex justify-center items-center z-50">
      {/* پس‌زمینه تاریک */}
      <div className="bg-white rounded-lg p-6 w-96 shadow-xl relative animate-fade-in">
        <h2 className="text-md font-semibold text-gray-800 mb-3 text-center">تأیید حذف</h2>
        <p className="text-gray-600 text-sm mb-5">{message || "آیا از حذف این مورد مطمئن هستید؟"}</p>

        {/* دکمه‌ها */}
        <div className="flex justify-between mt-4">
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-300 cursor-pointer"
          >
            بله، حذف شود
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition duration-300 cursor-pointer"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;
