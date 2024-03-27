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
import { asyncWrapper } from "../common/utils/wrapper";
const router = express.Router();



const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService, logger);
router.post("/", authenticate,canAccess([Roles.ADMIN]),categoryValidator, asyncWrapper(categoryController.create));

export default router;
