import express, { Request, Response } from "express";
import config from "config";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";
import categoryRouter from "./category/category-router";
import productRouter from "./product/product-router"

const app = express();
app.use(express.json());
app.use(cookieParser())
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Hii from catalog service",
        port: config.get("server.port"),
    });
});
app.use("/categories",categoryRouter);
app.use("/products", productRouter);
app.use(globalErrorHandler);

export default app;
