import express from "express";
const router = express.Router();
import * as dctl from "../controllers/default.controller.js";

// Routes
router.get("/", dctl.index);
router.get("/home", dctl.home);
router.get("/download", dctl.download);

export default router;
