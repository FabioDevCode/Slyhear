import express from "express";
const router = express.Router();
import * as actl from "../controllers/action.controller.js";

router.post("/download", actl.goDownload);






export default router;