import mongoose from "mongoose";

export interface Product {
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