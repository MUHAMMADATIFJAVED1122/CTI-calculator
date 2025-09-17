import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import calculatorRoutes from "./routes/calculator.routes.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/calculate", calculatorRoutes);

app.get("/", (req, res) => {
  res.send("CTI Merit Calculator API running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
