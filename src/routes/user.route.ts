import { Router } from "express";
import {
    deleteUser,
    getAllUser,
    getUserById,
    login,
    register,
    updateUser,
} from "../controllers/user.controller";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.post("/register", upload.single("avatar"), register);
router.post("/login", login);
router.get("/", getAllUser);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
