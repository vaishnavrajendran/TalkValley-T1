import express from "express";
import { login } from "../controller/auth";

const router = express.Router();

/* POST */
router.post('/login', login)

export default router;