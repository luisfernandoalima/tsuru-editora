import express from "express";
import path from "path";
import type { Application } from "express";
import cors from "cors";
import "dotenv/config";

import route from "./routes/route.js";

const app: Application = express();
app.use(express.json());
app.use(cors());

app.use("/uploads/", express.static(path.resolve("uploads")));

app.use("/api", route);

export default app;
