import express, {
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from "express";
import { CategoryController } from "./category-controller";
import categoryValidator from "./category-validator";
import { CategoryService } from "./category-service";
import logger from "../config/logger";
import createHttpError from "http-errors";
import authenticate from "../common/middlewares/authenticate";
import { canAccess } from "../common/middlewares/canAccess";
import { Roles } from "../common/constants";
const router = express.Router();

const asynsWrapper = (requestHandler: RequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => {
            if (err instanceof Error) {
                return next(createHttpError(500, err.message));
            }
            return next(createHttpError(500, "Internal server error"));
        });
    };
};

const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService, logger);
router.post("/", authenticate,canAccess([Roles.ADMIN]),categoryValidator, asynsWrapper(categoryController.create));

export default router;