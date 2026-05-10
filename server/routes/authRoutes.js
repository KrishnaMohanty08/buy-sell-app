import express from "express"
import {register,login, getCurrentUser} from "../controllers/authController.js";
import authMiddleWare from "../middleware/authMiddleware.js";

const router=express.Router();
router.post("/register",register);
router.post("/login",login);
router.get("/user", authMiddleWare, getCurrentUser);
export default router;