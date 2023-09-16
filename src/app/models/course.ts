import { Item } from "./item";
import { ItemType } from "./item-type";

export interface Course extends Item{
    id?: string,
    slug?: string,
    title: string;
    text: string;
    shortDescription: string,
    price: number;
    createdAt?: number;
    updatedAt?: number;
    imageUrl?: string;
    imageSizes?: {width:number, height:number}[]
};