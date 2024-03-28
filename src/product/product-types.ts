import mongoose from "mongoose";

export interface Product {
    _id?:mongoose.Types.ObjectId,
    name:string;
    description:string;
    priceConfiguration:string;
    attributes:string;
    tenantId:string;
    categoryId:string;
    image:string;
}


export interface Filter {
    tenantId?:string;
    isPublish? : Boolean,
    categoryId?: mongoose.Types.ObjectId
}

export interface PaginatedQuery {
    page:number;
    limit: number,
}