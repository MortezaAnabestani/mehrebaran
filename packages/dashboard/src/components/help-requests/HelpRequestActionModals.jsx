import PropTypes from "prop-types";
import { CheckCircleIcon as CheckCircleSolid, XCircleIcon as XCircleSolid } from "@heroicons/react/24/solid";

export const ApproveRequestModal = ({
  isOpen,
  onClose,
  onConfirm,
  requestTitle,
  adminNotes,
  setAdminNotes,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-[9999] animate-fade-in">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-scale-in mx-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
          <div className="p-3 bg-green-50 rounded-xl ring-4 ring-green-50/50">
            <CheckCircleSolid className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">تایید درخواست</h2>
            <p className="text-xs text-gray-500 font-normal">تغییر وضعیت به تایید شده</p>
          </div>
        </div>

        {/* Body */}
        <div className="mb-5">
          <div className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100">
            <p className="text-sm text-gray-600">
              شما در حال تایید درخواست <span className="font-bold text-gray-900">&ldquo;{requestTitle}&rdquo;</span> هستید.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">یادداشت ادمین (اختیاری)</label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows="4"
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none text-sm"
              placeholder="یادداشت‌های خود را وارد کنید..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-sm font-medium"
          >
            انصراف
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-lg shadow-green-200 transition-all text-sm font-medium"
          >
            تایید نهایی
          </button>
        </div>
      </div>
    </div>
  );
};

export const RejectRequestModal = ({
  isOpen,
  onClose,
  onConfirm,
  requestTitle,
  adminNotes,
  setAdminNotes,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-[9999] animate-fade-in">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-scale-in mx-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
          <div className="p-3 bg-red-50 rounded-xl ring-4 ring-red-50/50">
            <XCircleSolid className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">رد درخواست</h2>
            <p className="text-xs text-gray-500 font-normal">تغییر وضعیت به رد شده</p>
          </div>
        </div>

        {/* Body */}
        <div className="mb-5">
          <div className="bg-red-50 p-4 rounded-xl mb-4 border border-red-100">
            <p className="text-sm text-red-800">
              آیا از رد درخواست <span className="font-bold">&ldquo;{requestTitle}&rdquo;</span> اطمینان دارید؟
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">دلیل رد (اختیاری)</label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows="4"
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none text-sm"
              placeholder="دلیل رد درخواست را وارد کنید..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-sm font-medium"
          >
            انصراف
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-lg shadow-red-200 transition-all text-sm font-medium"
          >
            رد درخواست
          </button>
        </div>
      </div>
    </div>
  );
};

ApproveRequestModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  requestTitle: PropTypes.string.isRequired,
  adminNotes: PropTypes.string.isRequired,
  setAdminNotes: PropTypes.func.isRequired,
};

RejectRequestModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  requestTitle: PropTypes.string.isRequired,
  adminNotes: PropTypes.string.isRequired,
  setAdminNotes: PropTypes.func.isRequired,
};
