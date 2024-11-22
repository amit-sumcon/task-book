import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import {
    assignTask,
    getAllTasks,
    getSortedTasks,
    getTaskByCode,
    getUserTasks,
    reassignTask,
    updateTask,
    updateTaskStatus,
} from "../controllers/task.controller";

const router = Router();

router.post(
    "/assign-task",
    authenticateToken,
    authorizeRoles("SUPER_ADMIN", "ADMIN"),
    assignTask
);

router.get("/", authenticateToken, authorizeRoles("SUPER_ADMIN", "ADMIN"), getAllTasks);
router.get("/my-tasks", authenticateToken, getUserTasks);
router.post("/reassign-task", reassignTask);
router.get("/sort-by", authenticateToken, getSortedTasks);
router.get(
    "/:taskCode",
    authenticateToken,
    authorizeRoles("SUPER_ADMIN", "ADMIN"),
    getTaskByCode
);
router.put(
    "/:taskCode",
    authenticateToken,
    authorizeRoles("SUPER_ADMIN", "ADMIN"),
    updateTask
);
router.put("/status/:taskId", authenticateToken, updateTaskStatus);

export default router;
