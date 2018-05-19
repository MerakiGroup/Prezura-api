import express from "express";
import DataController from "../controller/data.controller";

const router = express.Router();

router.get("/dataset", (req, res) => {
  DataController.getPeriodicData(req, res);
});

router.get("/disorder", (req, res) => {
  DataController.getDisorders(req, res);
});

export default router;
