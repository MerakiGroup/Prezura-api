import express from "express";
import UserController from "../controller/user.controller";

const router = express.Router();

router.post("/signup", (req, res) => {
  UserController.signup(req, res);
});

export default router;
