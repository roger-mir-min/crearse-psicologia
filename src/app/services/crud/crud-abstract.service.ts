import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export abstract class CrudAbstractService {

  lastItemTimestamp: number | undefined;

  abstract getCollection(): Promise<any[]>;

  abstract getFilteredCollection(filter: string): Promise<any[]>;

  abstract getItem(id:string): Promise<any>;

  abstract addItem(object:any): Promise<any>;

  abstract deleteItem(id: string): Promise<any>;

  abstract modifyItem(id: any): Promise<any>;

constructor() { }

}
