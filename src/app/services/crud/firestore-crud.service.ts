import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc, setDoc, query, orderBy, limit, startAfter, where } from '@angular/fire/firestore';
import { toUnixTime } from '../../shared/utilities/dateToUnix';
import { Item } from 'src/app/models/item';
import { generateSlug } from 'src/app/shared/utilities/generateSlug';

@Injectable()
export abstract class FirestoreCrudService<T extends Item> {

  protected abstract collectionPath: string;
  collection: any;
  lastItemTimestamp: number | undefined;

    protected init() {
    this.collection = collection(this.firestore, this.collectionPath);
  }

  constructor(protected firestore: Firestore) {
  }

  async getCollection(lim = 3): Promise<T[]> {
    let q;
    if (!this.lastItemTimestamp) {
      q = query(this.collection, orderBy('createdAt', 'desc'), limit(lim));
    } else {
      q = query(this.collection, orderBy('createdAt', 'desc'), startAfter(this.lastItemTimestamp), limit(lim));
    }
    const ref = await getDocs(q);
    const arr = ref.docs.map(doc => ({ id: doc.id, ...doc.data() as object } as T));
    if (arr.length > 0) {
      this.lastItemTimestamp = arr[arr.length - 1].createdAt!;
      return arr;
    } else {
      return [];
    }
  }

    async getFilteredCollection(filter: string): Promise<T[]> {
    const filterLowerCase = filter.toLowerCase();
    const ref = await getDocs(this.collection);
    return ref.docs
      .map(doc => ({ id: doc.id, ...doc.data() as object } as T))
      .filter(art =>(art.title.toLowerCase().includes(filterLowerCase) || art.text.toLowerCase().includes(filterLowerCase)));
  }

  async getItem(id: string): Promise<T> {
    const ref = doc(this.firestore, this.collectionPath, id);
    return (await getDoc(ref)).data() as T;
  }

async addItem(item: T): Promise<any> {
  const itemWithDate = { ...item, createdAt: toUnixTime(new Date()) };
  const docRef = await addDoc(this.collection, itemWithDate);

  const slug = generateSlug(item.title, docRef.id);
  await setDoc(docRef, { ...itemWithDate, slug: slug });

  return docRef;
}


  async deleteItem(id: string): Promise<any> {
    return await deleteDoc(doc(this.firestore, this.collectionPath, id));
  }

  modifyItem(item: T): Promise<any> {
    item.updatedAt = toUnixTime(new Date());
    item.slug = generateSlug(item.title, item.id!);
    const obj = { ...item };
    return setDoc(doc(this.firestore, this.collectionPath, item.id!), obj);
  }
}

