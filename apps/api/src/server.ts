import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "studentops-api",
  });
});

app.listen(PORT, () => {
  console.log(`StudentOps API running on http://localhost:${PORT}`);
});
