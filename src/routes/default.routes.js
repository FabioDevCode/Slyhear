import express from "express";
const router = express.Router();
import * as dctl from "../controllers/default.controller.js";
import { isConnected } from "../middlewares/cookie.middlewares.js";


// Routes
router.get("/", dctl.index);
router.get("/player", isConnected, dctl.player);
router.get("/library", isConnected, dctl.library);
router.get("/upload", isConnected, dctl.upload);
router.get("/download", isConnected, dctl.download);


export default router;
