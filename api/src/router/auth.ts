import { Router } from "express";
import { checkSchema } from "express-validator";
import {
  refresh,
  signin,
  signout,
  signup,
} from "../controller/auth.controller.js";
import {
  loginschema,
  registrationSchema,
  validate,
} from "../utils/validator.js";

const router = Router();

router.post("/signin", validate(checkSchema(loginschema)), signin);

router.post("/signup", validate(checkSchema(registrationSchema)), signup);
router.get("/refresh", refresh);
router.get("/signout", signout);

export default router;
