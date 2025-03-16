import express from "express";
const router = express.Router();
import * as actl from "../controllers/action.controller.js";

router.post("/download", actl.goDownload);
router.get("/delete/:id", actl.deleteSound);
router.get("/stream/:code", actl.setStream);


export default router;
