import { Item } from "src/app/models/item";
import { simpleHash } from './hash-generator';

export function trackById(index: number, item: Item): number {
    return simpleHash(item.id!);
}
