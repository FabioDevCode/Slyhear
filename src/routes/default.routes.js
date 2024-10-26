import express from "express";
const router = express.Router();
import * as dctl from "../controllers/default.controller.js";

// Routes
router.get("/", dctl.home);

export default router;
