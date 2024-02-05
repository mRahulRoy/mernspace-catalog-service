import express, { Request, Response } from "express";
import config from "config";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";

const app = express();

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Hii from catalog service",
        port: config.get("server.port"),
    });
});

app.use(globalErrorHandler);

export default app;
