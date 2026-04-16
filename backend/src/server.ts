import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { appDataSource } from "./database/appDataSource.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import indexRouter from "./routes/index.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6060;

app.set("trust proxy", 1);

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
}));

app.use(helmet({
    contentSecurityPolicy: true,
}));

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use(compression({ threshold: 1024 }));

app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use('/api', indexRouter);
app.use(errorMiddleware);

appDataSource.initialize()
    .then(() => {
        console.log("Conectou com o banco!");

        app.listen(PORT, () => {
            console.log(`Server is running in port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });

