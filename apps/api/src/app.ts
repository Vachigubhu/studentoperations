import express from "express";
import cors from "cors";
import helmet from "helmet";
import { apiRateLimiter } from "./middleware/rate-limiters.js";
import apiRoutes from "./routes/index.js";
import { notFoundHandler } from "./middleware/not-found.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { env } from "./config/env.js";
import swaggerUi from "swagger-ui-express";
import { openApiDocument } from "./config/openapi.js";
import cookieParser from "cookie-parser";

const app = express();

app.disable("x-powered-by");

app.use(helmet());
app.use(
  cors({
    origin: env.webOrigin,
    credentials: true,
  }),
);
app.use(express.json());

app.use(cookieParser());

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use("/api/v1", apiRateLimiter);

app.use("/api/v1", apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
