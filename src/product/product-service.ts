import { paginationLabels } from "../config/pagination";
import productModel from "./product-model";
import { Filter, PaginatedQuery, Product } from "./product-types";

export class ProductService {
    async createProduct(product: Product) {
        return await productModel.create(product) as Product;
    }

    async getProduct(productId: string) {
        return await productModel.findById(productId) as Product;
    }

    async updateProduct(productId: string, product: Product) {
        return await productModel.findOneAndUpdate(
            { _id: productId },
            {
                $set: product,
            },
            {
                new: true,
            },
        ) as Product;
    }

    async getProducts(q: string, filters: Filter,paginatedQuery:PaginatedQuery) {
        const searchQueryRegex = new RegExp(q, "i");
        const matchQuery = {
            ...filters,
            name: searchQueryRegex,
        };
        const aggregate = productModel.aggregate([
            {
                $match: matchQuery,
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                attributes: 1,
                                priceConfiguration: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind:"$category"
            }
        ]);


        return productModel.aggregatePaginate(aggregate,{
            ...paginatedQuery,
            customLabels : paginationLabels
        })

        // const result = await aggregate.exec();
        // return result as Product[];
    }
}
