import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { v4 as uuidv4 } from "uuid";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { ProductService } from "./product-service";
import { Product } from "./product-types";
import { FileStorage } from "../common/types/storage";
import { UploadedFile } from "express-fileupload";

export class ProductController {
    constructor(
        private productService: ProductService,
        private storage: FileStorage,
    ) {
        // this.create = this.create.bind(this) , can be avoided if we make our methods using arrow function
    }
    create = async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }

        //todo image upload
        const imageName = uuidv4();
        const image = req.files!.image as UploadedFile;

        await this.storage.upload({
            filename: imageName,
            fileData: image.data.buffer,
        });

        const {
            name,
            description,
            priceConfiguration,
            attributes,
            tenantId,
            categoryId,
            isPublish,
        } = req.body;

        const product = {
            name,
            description,
            priceConfiguration: JSON.parse(priceConfiguration as string),
            attributes: JSON.parse(attributes as string),
            tenantId,
            categoryId,
            isPublish,
            image: imageName,
        };
        // Create product
        const newProduct = await this.productService.createProduct(
            product as unknown as Product,
        );
        res.json({
            id: newProduct._id,
        });
    };
    update = async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }

        const {productId} =  req.params;
        const product = await this.productService.getProductById(productId);

        if(!product){
            const error = createHttpError(404,"Product not found!");
            return next(error);
        }
        
        let imageName :string | undefined;
        let oldImage :string | undefined;
        if(req.files?.image){
             oldImage = await this.productService.getProductImage(productId);

            const image = req.files.image as UploadedFile;
             imageName = uuidv4();
            await this.storage.upload({
                filename:imageName,
                fileData:image.data.buffer
            });

            await this.storage.delete(oldImage!);
        }


        const {
            name,
            description,
            priceConfiguration,
            attributes,
            tenantId,
            categoryId,
            isPublish,
        } = req.body;

        const prod = {
            name,
            description,
            priceConfiguration: JSON.parse(priceConfiguration as string),
            attributes: JSON.parse(attributes as string),
            tenantId,
            categoryId,
            isPublish,
            image: imageName ? imageName : oldImage as string,
        };

         await this.productService.update(productId,prod)

        res.json({
            _id:productId
        })
    };

   
}
