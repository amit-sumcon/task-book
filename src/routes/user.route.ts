import { Router } from "express";
import {
    deleteUser,
    getAllUser,
    getUserById,
    login,
    refreshToken,
    register,
    registerSuperAdmin,
    updateUser,
} from "../controllers/user.controller";
import { upload } from "../middlewares/multer.middleware";
import { authenticateToken } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/permission.middleware";

const router = Router();

router.post("/register", upload.single("avatar"), register);
router.post("/register-super-admin", upload.single("avatar"), registerSuperAdmin);
router.post("/login", login);
router.get("/", authenticateToken, checkRole(["admin"]), getAllUser);
router.post("/refresh-token", refreshToken);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
