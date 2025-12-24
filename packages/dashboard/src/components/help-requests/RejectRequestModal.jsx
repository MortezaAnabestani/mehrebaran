import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
  Textarea,
} from "@material-tailwind/react";
import { CheckCircleIcon as CheckCircleSolid, XCircleIcon as XCircleSolid } from "@heroicons/react/24/solid";

export const ApproveRequestModal = ({
  isOpen,
  onClose,
  onConfirm,
  requestTitle,
  adminNotes,
  setAdminNotes,
}) => {
  return (
    <Dialog
      open={isOpen}
      handler={onClose}
      size="sm"
      className="rounded-3xl"
      animate={{
        mount: { scale: 1, y: 0, opacity: 1 },
        unmount: { scale: 0.95, y: -20, opacity: 0 },
      }}
    >
      <DialogHeader className="border-b border-gray-100 pb-4 px-6 pt-6">
        <div className="flex items-center gap-3 text-green-600">
          <div className="p-3 bg-green-50 rounded-2xl ring-4 ring-green-50/50">
            <CheckCircleSolid className="w-6 h-6" />
          </div>
          <div>
            <Typography variant="h5" color="blue-gray">
              تایید درخواست
            </Typography>
            <Typography variant="small" className="text-gray-400 font-normal">
              تغییر وضعیت به تایید شده
            </Typography>
          </div>
        </div>
      </DialogHeader>
      <DialogBody className="py-6 px-6">
        <div className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100">
          <Typography className="font-normal text-gray-600 text-sm">
            شما در حال تایید درخواست <span className="font-bold text-gray-900">"{requestTitle}"</span> هستید.
          </Typography>
        </div>
        <Textarea
          label="یادداشت ادمین (اختیاری)"
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          color="green"
          className="!border-gray-200 focus:!border-green-500 rounded-xl"
        />
      </DialogBody>
      <DialogFooter className="pt-0 px-6 pb-6">
        <Button variant="text" color="gray" onClick={onClose} className="mr-2 rounded-xl hover:bg-gray-100">
          انصراف
        </Button>
        <Button
          variant="gradient"
          color="green"
          onClick={onConfirm}
          className="rounded-xl shadow-green-200 shadow-lg"
        >
          تایید نهایی
        </Button>
      </DialogFooter>
    </Dialog>
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
  return (
    <Dialog
      open={isOpen}
      handler={onClose}
      size="sm"
      className="rounded-3xl"
      animate={{
        mount: { scale: 1, y: 0, opacity: 1 },
        unmount: { scale: 0.95, y: -20, opacity: 0 },
      }}
    >
      <DialogHeader className="border-b border-gray-100 pb-4 px-6 pt-6">
        <div className="flex items-center gap-3 text-red-600">
          <div className="p-3 bg-red-50 rounded-2xl ring-4 ring-red-50/50">
            <XCircleSolid className="w-6 h-6" />
          </div>
          <div>
            <Typography variant="h5" color="blue-gray">
              رد درخواست
            </Typography>
            <Typography variant="small" className="text-gray-400 font-normal">
              تغییر وضعیت به رد شده
            </Typography>
          </div>
        </div>
      </DialogHeader>
      <DialogBody className="py-6 px-6">
        <div className="bg-red-50 p-4 rounded-xl mb-4 border border-red-100">
          <Typography className="font-normal text-red-800 text-sm">
            آیا از رد درخواست <span className="font-bold">"{requestTitle}"</span> اطمینان دارید؟
          </Typography>
        </div>
        <Textarea
          label="دلیل رد (اختیاری)"
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          color="red"
          className="!border-gray-200 focus:!border-red-500 rounded-xl"
        />
      </DialogBody>
      <DialogFooter className="pt-0 px-6 pb-6">
        <Button variant="text" color="gray" onClick={onClose} className="mr-2 rounded-xl hover:bg-gray-100">
          انصراف
        </Button>
        <Button
          variant="gradient"
          color="red"
          onClick={onConfirm}
          className="rounded-xl shadow-red-200 shadow-lg"
        >
          رد درخواست
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
