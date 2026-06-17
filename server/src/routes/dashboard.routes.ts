import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware)

router.get("/stats", dashboardController.getDashboardStats);
router.get("/charts/project-status", dashboardController.getProjectStatusBreakdown);
router.get("/charts/customer-type", dashboardController.getCustomerTypeBreakdown);
router.get("/charts/user-roles", dashboardController.getUserRoleBreakdown);
router.get("/activity", dashboardController.getRecentActivity);
router.get("/activity-heatmap", dashboardController.getActivityHeatmap);
router.get("/my-projects", dashboardController.getMyProjects);
router.get("/upcoming-deadlines", dashboardController.getUpcomingDeadlines);
router.get("/recent-comments", dashboardController.getRecentComments);
router.get("/recent-files", dashboardController.getRecentFiles);

export default router;