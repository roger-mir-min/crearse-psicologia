import { AngularEditorConfig, AngularEditorModule, UploadResponse } from '@kolkov/angular-editor';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, FormArray,  Validators, ReactiveFormsModule, FormsModule, FormControl, AbstractControl } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpEvent, HttpEventType, HttpHeaders, HttpResponse, HttpUrlEncodingCodec  } from '@angular/common/http';
import { ItemType } from 'src/app/models/item-type';
import { NgFor, NgIf } from '@angular/common';
import { Observable, of, switchMap, tap } from 'rxjs';
import { ImageService } from 'src/app/services/crud/image.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { HtmlEncodePipe } from 'src/app/shared/pipes/html-encode.pipe';
import { encodeHTML } from 'src/app/shared/utilities/encode';
import { TranslateTypePipe } from 'src/app/shared/pipes/translate-type.pipe';
import { Item } from 'src/app/models/item';
import { Router } from '@angular/router';
import { CanComponentDeactivate } from 'src/app/shared/can-deactivate.guard';
import { defaultImg } from 'src/app/models/defaultImg';
import { simpleHash } from 'src/app/shared/utilities/hash-generator';


@Component({
  selector: 'app-admin-item-form',
  standalone: true,
  imports: [ReactiveFormsModule, AngularEditorModule, HttpClientModule, NgFor, NgIf, FormsModule,
  ModalComponent, TranslateTypePipe],
  templateUrl: './admin-item-form.component.html',
  styleUrls: ['./admin-item-form.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminItemFormComponent implements OnInit {
  @ViewChild(ModalComponent) modal!: ModalComponent;
  @ViewChild('angularEditor', { read: ElementRef, static: false }) editorElement!: ElementRef;

getSize() {
        const internalImg = this.editorElement.nativeElement.querySelectorAll('img');
  if (internalImg.length) {
    internalImg.forEach((el:any) => {
      this.imgSizes.push({ width: el.offsetWidth, height: el.offsetHeight });
    });}
}
  
resizeImgContainer(text: string): string {
  const divRegex = /<div[^>]*>(<img [^>]*src="[^"]+"[^>]*>)<\/div>/gi;
    let index = 0;

    const result = text.replace(divRegex, (fullMatch, imgTag) => {
        if (this.imgSizes[index]) {
            const imgSrcPart = imgTag.match(/src="[^"]+"/i);
            if (!imgSrcPart) return fullMatch;

          const replacement = `<div class="resize overflow-auto mx-auto max-w-[250px] md:max-w-none h-auto md:h-[${this.imgSizes[index].height}px]" 
            style="width: ${this.imgSizes[index].width}px;">
            <img ${imgSrcPart[0]} alt="Imagen del ítem de contenido"></div>`;
            index++; 
            return replacement;
        } else {
            return fullMatch; 
        }
    });

    return result;
}
  
  imgSizes:Array<{ width: number; height: number; }> = [];

  imageUrl: string | undefined;
  imagesUpdatedArray: { name: string, url: string }[] = [];
  
  submitted = false;

  _type!: ItemType | 'text';
  
  @Input({ required: true }) set type(name: ItemType | 'text') {
    this._type = name;
    this.initializeForm();
  } //potser fer que els camps comuns es mantinguin

  _initialItem: Item = {
    title: '',
    text: '',
    price: 0,
    budget: '',
    shortDescription: '',
    tags: [],
    duration: 1,
  };

  @Input({ required: false }) set initialItem(item: any) {
    this._initialItem = { ...item };
    this.initializeForm();
    this.getImagesFromText(this._initialItem.text);
  }

  itemForm!: FormGroup;

  @Output() submitEvent = new EventEmitter<any>();

  constructor(private fb: FormBuilder, private http: HttpClient, private imageService: ImageService,
  private router: Router) { }

  ngOnInit() {
  }

    getImagesFromText(str:string): void {
    const regex = /src\s*=\s*"(.+?)">/g;
    let match;

    while ((match = regex.exec(str)) !== null) {
      const imageUrl = match[1];
      const nameMatch = /%2F([^?]+)\?/.exec(imageUrl);
      if (nameMatch && nameMatch[1]) {
        this.imagesUpdatedArray.push({
          url: imageUrl,
          name: nameMatch[1]
        });
      }
    }
  }

  codec = new HttpUrlEncodingCodec;

  encode(str:string) {
    return encodeHTML(str);
  }

  initializeForm() {
    this.itemForm = this.fb.group({
      text: [this._initialItem.text, Validators.required],
    });
    if (this._type !== 'text') {
      this.itemForm.addControl('title', this.fb.control(this._initialItem.title, Validators.required));
      this.itemForm.addControl('shortDescription', this.fb.control(this._initialItem.shortDescription, Validators.required));
    }
    if (this._type === 'course') {
      this.itemForm.addControl('price', this.fb.control(this._initialItem.price, Validators.required));
    } else if (this._type === 'article') {
      this.itemForm.addControl('duration', this.fb.control(this._initialItem.duration, Validators.required));
      this.itemForm.addControl('tags', this.fb.array(this.addTagsToFormArray()));
    } else if (this._type === 'women' || 'em-support') {
      this.itemForm.addControl('budget', this.fb.control(this._initialItem.budget, Validators.required));
    } else {
      console.error('Invalid type');
    }
  }

  addTagsToFormArray() {
    let arr: FormControl[] = [];
    if (this._initialItem.tags) {
      this._initialItem.tags.forEach((tag: string) => {
        arr.push(this.fb.control(tag));
      });
    }
    return arr;
  }
  
  get tagsArray() {
    return this.itemForm.get('tags') as FormArray;
  }

  trackByUrl(index: number, item: {name:string, url:string}): number {
  return simpleHash(item.url);
  }
  
  trackByValue(index: number, item: AbstractControl): number {
  return simpleHash((item.value as string));
}


  addTag() {
    const tags = this.itemForm.get('tags') as FormArray;
    tags.push(this.fb.control(''));
  }

  removeTag(i: number) {
    const tags = this.itemForm.get('tags') as FormArray;
    tags.removeAt(i);
  }

  textProva: string = '';

  openConfirmationModal() {
    this.deleteUnusedImages();
    this.modal.open();
  }

  submit(imgUrl: string | undefined) {
    this.getSize();
    let item = { ...this.itemForm.value } as Item;
    item.text = this.resizeImgContainer(item.text);
    item.createdAt = this._initialItem.createdAt;
    item.imageUrl = imgUrl ?? defaultImg;
    item.imageSizes = this.imgSizes;
    item.text = this.resizeImgContainer(item.text);
    this.submitted = true;
    this.submitEvent.emit(item);
    this._initialItem = { ...this.itemForm.value, text:item.text };
    this.initializeForm();
    this.modal.close();
  }

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Escribe aquí...',
    defaultParagraphSeparator: '',
    defaultFontName: 'Crimson Text', //pendent
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
      { class: 'impact', name: 'Impact' },
      { class: 'Julius', name: 'Julius' },
      { class: 'Zarid', name: 'Zarid' },
      { class: 'Crimson Text', name: 'Crimson Text' },
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    upload: (file: File) => this.uploadImageByAngularEditor(file),
    uploadWithCredentials: false,
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['customClasses', 'insertVideo', 'toggleEditorMode']
    ]
  };

  deleteUnusedImages() {
       //If image has been removed when submitting, delete it from Firebase Storage
    if (this.imagesUpdatedArray.length>0) {
      this.imagesUpdatedArray.forEach((img, i) => {
        //Only check the token part to avoid problems with HTML encoding
        const tokenIndex = img.url.indexOf('token=');
        if (tokenIndex !== -1) {
            const tokenPart = img.url.substring(tokenIndex);
          if (!this.itemForm.value.text.includes(tokenPart)) {
              //delete from Storage
              this.imageService.deleteImg(img.name).then(res => {
                console.log(res);
              }).catch(error => {
                console.error(error);
              });
              //delete from imgUrlArray
            this.imagesUpdatedArray.splice(i, 1);
            };
        }
      });
    } 
  }
  

uploadImageByAngularEditor(file: File): Observable<HttpEvent<UploadResponse>> {
  return this.imageService.uploadImg(file).pipe(
    tap(res => {
      //we store only the url of the first image, which will be displayed in the card of the item
      this.imagesUpdatedArray.push({ name: file.name, url: res });
    }), 
    switchMap(res => of({
      body: {imageUrl: res},
      headers: new HttpHeaders(),
      status: 500,
      statusText: 'mock status text',
      ok: false,
      clone: function () { return this; },
      type: HttpEventType.Response,
      url: res
    } as HttpResponse<UploadResponse>)),
    tap(res => {
      setTimeout(() => {
        const imageUrl = res.body?.imageUrl || '';
        
          const imgString = `<img src="${imageUrl}" alt="Imagen del ítem de contenido">`;
          const replacementImgString = imgString.replace('media&token', 'media&amp;token');
        
          const imgStringWithoutAlt = `<img src="${imageUrl}">`;
          const targetImgString = imgStringWithoutAlt.replace('media&token', 'media&amp;token');
          
          const divWithClasses = `<div class="resize overflow-auto mx-auto">${replacementImgString}</div>`;
        
          const combinedRegex = new RegExp(`(<div class="resize overflow-auto mx-auto">)?<img[^>]*src="${imageUrl.replace(/&/g, '&amp;').replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&')}[^>]*>(<\/div>)?`, 'i');

        const noEditorDivWithImg = new RegExp(`/<div[^>]*>\s*<img[^>]*src="${imageUrl}"[^>]*>\s*<\/div>/g`);

        //div amb classes i imatge just pujada (sempre que no estigui modificat..)
        const divWithClassesAndImg = `<div class="resize overflow-auto mx-auto">${targetImgString}</div>`;

        //div buit amb imatge
        const divWithoNoClassesButImg = `<div>${targetImgString}</div>`;

        const prova = this.itemForm.value.text.match(divWithClassesAndImg);
          
        //si div amb classes, substituïm
        if (prova) {
          this.itemForm.patchValue({ text: this.itemForm.value.text.replace(divWithClassesAndImg, divWithClasses) });
        } else if (this.itemForm.value.text.match(divWithoNoClassesButImg)) {
          //si div buit, substituïm
          this.itemForm.patchValue({ text: this.itemForm.value.text.replace(divWithoNoClassesButImg, divWithClasses) });
        } else {
            this.itemForm.patchValue({ text: this.itemForm.value.text.replace(`${targetImgString}`, divWithClasses) });
          }
      });
    })
    );
}

@HostListener('window:beforeunload', ['$event'])
unloadNotification($event: any): void {
  if (this.itemForm.dirty) {
    $event.returnValue = 'Segur que vols canviar de pàgina? Es perdrà la informació introduïda.';
  }
  }
  
  ngOnDestroy() {
    //delete all im
    if (this.submitted = false) {
      if (this.imagesUpdatedArray.length > 0) {
        this.imagesUpdatedArray.forEach((img, i) => {
          this.imageService.deleteImg(img.name).then(res => {
            console.log(res);
          }).catch(error => {
            console.error(error);
            alert('Error al eliminar el archivo');
          });
        })
      }
    }
  }
}
