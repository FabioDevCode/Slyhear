import express from "express";
const router = express.Router();
import * as actl from "../controllers/action.controller.js";

import { loginControl } from "../validators/user.validators.js";

router.get("/download", actl.goDownload);
router.get("/delete/:id", actl.deleteSound);
router.get("/stream/:code", actl.setStream);

router.post("/login", loginControl, actl.login);

router.post("/add_list", actl.add_list);
router.get("/remove_list/:id", actl.remove_list);




export default router;
