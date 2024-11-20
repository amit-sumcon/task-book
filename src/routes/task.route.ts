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
} from "../controllers/task.controller";
// import { authenticateToken } from "../middlewares/auth.middleware";
// import { authorizeRoles } from "../middlewares/role.middleware";
// import {
//     // createTask,
//     // deleteTask,
//     // getAllTasks,
//     // getTaskByTaskCode,
//     // updateTask,
// } from "../controllers/task.controller";

const router = Router();

// router.post(
//     "/create",
//     authenticateToken,
//     authorizeRoles("SUPER_ADMIN", "ADMIN"),
//     createTask
// );
// router.get("/", authenticateToken, authorizeRoles("SUPER_ADMIN", "ADMIN"), getAllTasks);
// router.put(
//     "/:taskCode",
//     authenticateToken,
//     authorizeRoles("SUPER_ADMIN", "ADMIN"),
//     updateTask
// );
// router.get(
//     "/:taskCode",
//     authenticateToken,
//     authorizeRoles("SUPER_ADMIN", "ADMIN"),
//     getTaskByTaskCode
// );
// router.delete(
//     "/:taskCode",
//     authenticateToken,
//     authorizeRoles("SUPER_ADMIN", "ADMIN"),
//     deleteTask
// );

router.post(
    "/assign-task",
    authenticateToken,
    authorizeRoles("SUPER_ADMIN", "ADMIN"),
    assignTask
);

router.get("/", authenticateToken, authorizeRoles("SUPER_ADMIN", "ADMIN"), getAllTasks);
router.post("/my-tasks", authenticateToken, getUserTasks);
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

export default router;
