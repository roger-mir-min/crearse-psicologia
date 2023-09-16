import { Timestamp } from "firebase/firestore";
import { Item } from "./item";
import { ItemType } from "./item-type";

export interface Article extends Item{
    id?: string;
    title: string;
    slug?: string,
    text: string;
    duration: number;
    imageUrl?: string;
    imageSizes?: { width: number, height: number }[];
    shortDescription?: string
    tags?: string[];
    createdAt?: number;
    updatedAt?: number;
};