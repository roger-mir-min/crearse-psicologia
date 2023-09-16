import { Item } from "./item";

export interface EmSupport extends Item{
    id?: string,
    slug?: string,
    title: string,
    text: string,
    budget?: string,
    createdAt?: number,
    updatedAt?: number,
    imageUrl?: string
    imageSizes?: {width:number, height:number}[]
};