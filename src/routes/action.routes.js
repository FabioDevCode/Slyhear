import express from "express";
const router = express.Router();
import * as actl from "../controllers/action.controller.js";

import { loginControl } from "../validators/user.validators.js";
import { isConnected } from "../middlewares/cookie.middlewares.js";

router.get("/download", isConnected, actl.goDownload);
router.get('/progress/:jobId', actl.getJobProgress);

router.get("/delete/:id", isConnected, actl.deleteSound);
router.get("/stream/:code", isConnected, actl.setStream);
router.post("/add_list", isConnected, actl.add_list);
router.get("/remove_list/:id", isConnected, actl.remove_list);

router.post("/login", loginControl, actl.login);



export default router;
