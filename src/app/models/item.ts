import { ItemType } from "./item-type";

export interface Item {
    id?: string,
    createdAt?: number,
    updatedAt?: number,
    slug?: string,
    title: string,
    text: string,
    shortDescription?: string,
    duration?: number,
    imageUrl?: string
    price?: number,
    budget?: string,
    tags?:string[],
    imageSizes?: {width:number, height:number}[]
}