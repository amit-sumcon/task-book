import { Router } from "express";
import {
    deleteUser,
    getAllUser,
    getUserById,
    login,
    logout,
    refreshToken,
    register,
    registerSuperAdmin,
    updateRole,
    updateUser,
} from "../controllers/user.controller";
import { upload } from "../middlewares/multer.middleware";
import { authenticateToken } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

router.post("/register", upload.single("avatar"), register);
router.post("/register-super-admin", upload.single("avatar"), registerSuperAdmin);
router.post("/login", login);
router.post("/logout", authenticateToken, logout);
router.get("/", authenticateToken, authorizeRoles("SUPER_ADMIN", "ADMIN"), getAllUser);
router.post("/refresh-token", authenticateToken, refreshToken);
router.put(
    "/update-role",
    authenticateToken,
    authorizeRoles("SUPER_ADMIN", "ADMIN"),
    updateRole
);
router.get("/:id", authenticateToken, getUserById);
router.put("/:id", authenticateToken, updateUser);
router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("SUPER_ADMIN", "ADMIN"),
    deleteUser
);

export default router;
