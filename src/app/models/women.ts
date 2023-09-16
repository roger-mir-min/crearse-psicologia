import { Item } from "./item";

export interface Women extends Item{
    id?: string,
    slug?: string,
    title: string,
    text: string,
    budget?: string,
    createdAt?: number,
    updatedAt?: number,
    imageUrl?: string
    imageSize?: {width:number, height:number}[]
};