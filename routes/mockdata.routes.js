import express from "express";
import MockController from "../controller/mock.controller";

const router = express.Router();

router.get("/alerts", (req, res) => {
  MockController.alerts(req, res);
});

export default router;
