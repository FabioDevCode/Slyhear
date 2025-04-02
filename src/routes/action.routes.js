import express from "express";
const router = express.Router();
import * as actl from "../controllers/action.controller.js";

import { loginControl } from "../validators/user.validators.js";

router.post("/download", actl.goDownload);
router.get("/delete/:id", actl.deleteSound);
router.get("/stream/:code", actl.setStream);

router.post("/login", loginControl, actl.login);


export default router;
