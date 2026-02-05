import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import sensorRouter from "./routes/sensorRoutes.js";
import { appDataSource } from "./database/appDataSource.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";

import errorHandler from "./middleware/errorHandler.js";
import pesquisadorRouter from "./routes/pesquisadorRoutes.js";
import areaRouter from "./routes/areaRoutes.js";
import leituraRouter from "./routes/leituraRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6060;

app.set('trust proxy', 1);

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
}));

app.use(helmet({
    contentSecurityPolicy: true
}));

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use(compression({ threshold: 1024 }))

app.use('/api', sensorRouter);
app.use('/api', pesquisadorRouter)
app.use('/api', areaRouter)
app.use('/api', leituraRouter)

app.use(errorHandler)

// Tentando se conectar com o banco de dados
appDataSource.initialize()
    .then(() => {
        console.log("Conectou com o banco!");

        app.listen(PORT, () => {
            console.log(`Server is running in port: ${PORT}`)
        })

    })
    .catch((error) => {
        console.log(error)
    })

