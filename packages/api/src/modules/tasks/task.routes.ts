import { Router } from "express";
import { taskController } from "./task.controller";
import { protect } from "../auth/auth.middleware";

const router = Router();

// همه route‌ها نیاز به احراز هویت دارند
router.use(protect);

// دریافت آمار
router.get("/stats", taskController.getStats);

// دریافت tasks امروز
router.get("/today", taskController.getTodayTasks);

// دریافت tasks سررسید گذشته
router.get("/overdue", taskController.getOverdueTasks);

// دریافت tasks بر اساس محدوده تاریخ
router.get("/date-range", taskController.getByDateRange);

// CRUD اصلی
router.route("/").get(taskController.getAll).post(taskController.create);

router.route("/:id").get(taskController.getById).patch(taskController.update).delete(taskController.delete);

export default router;
