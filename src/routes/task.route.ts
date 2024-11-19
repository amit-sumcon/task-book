import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import {
    createTask,
    deleteTask,
    getAllTasks,
    getTaskByTaskCode,
    updateTask,
} from "../controllers/task.controller";

const router = Router();

router.post(
    "/create",
    authenticateToken,
    authorizeRoles("SUPER_ADMIN", "ADMIN"),
    createTask
);
router.get("/", authenticateToken, authorizeRoles("SUPER_ADMIN", "ADMIN"), getAllTasks);
router.put(
    "/:taskCode",
    authenticateToken,
    authorizeRoles("SUPER_ADMIN", "ADMIN"),
    updateTask
);
router.get(
    "/:taskCode",
    authenticateToken,
    authorizeRoles("SUPER_ADMIN", "ADMIN"),
    getTaskByTaskCode
);
router.delete(
    "/:taskCode",
    authenticateToken,
    authorizeRoles("SUPER_ADMIN", "ADMIN"),
    deleteTask
);

export default router;
