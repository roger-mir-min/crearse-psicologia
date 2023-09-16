import { Injectable } from '@angular/core';
import { Storage, deleteObject, getBlob, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { from, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private storage: Storage) {
  
  }
  
  uploadImg(file: any) { //funciona
    let imgUrl;
    const imgRef = ref(this.storage, `images/${file.name}`);
    return from(uploadBytes(imgRef, file)).pipe(switchMap(res => getDownloadURL(res.ref)));;
  }

  async getImg(name:string) {
    const imgRef = ref(this.storage, `images/${name}`);
    return await getDownloadURL(imgRef);
  }

  async deleteImg(name: string) {
    const imgRef = ref(this.storage, `images/${name}`);
    return deleteObject(imgRef)
  }

}
