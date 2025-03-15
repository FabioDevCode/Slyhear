import express from "express";
const router = express.Router();
import * as dctl from "../controllers/default.controller.js";

// Routes
router.get("/", dctl.index);
router.get("/player", dctl.player);
router.get("/library", dctl.library);
router.get("/upload", dctl.upload);
router.get("/download", dctl.download);


export default router;
