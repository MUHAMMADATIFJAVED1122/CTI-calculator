import express from "express";
import { calculateMarks } from "../controllers/calculator.controller.js";

const router = express.Router();

router.post("/", calculateMarks);

export default router;
