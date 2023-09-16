import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { editorConfigReadOnly } from 'src/app/shared/utilities/editor-config';
import { BehaviorSubject, Observable, Subject, combineLatest, debounceTime, distinctUntilChanged, from, map, tap } from 'rxjs';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { LoaderService } from 'src/app/services/loader.service';
import { encodeHTML } from 'src/app/shared/utilities/encode';
import { FirestoreCrudService } from 'src/app/services/crud/firestore-crud.service';
import { WomenService } from 'src/app/services/crud/women.service';
import { Women } from 'src/app/models/women';
import { Secondary } from 'src/app/models/secondary';
import { SecondaryDataService } from 'src/app/services/crud/secondary-data.service';
import { defaultImg } from 'src/app/models/defaultImg';
import { trackById } from 'src/app/shared/utilities/trackby-id';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title, Meta } from '@angular/platform-browser';
import { AdminItemFormComponent } from 'src/app/admin/admin-item-form/admin-item-form.component';

@Component({
  selector: 'app-women-circle-list',
  standalone: true,
  imports: [CommonModule, RouterModule, AngularEditorModule, FormsModule, InfiniteScrollModule,
    ModalComponent, AdminItemFormComponent],
  providers: [{ provide: FirestoreCrudService, useClass: WomenService }],
  templateUrl: './women-circles-list.component.html',
  styleUrls: ['./women-circles-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WomenCircleListComponent implements OnInit {

 @ViewChild(ModalComponent) modal!: ModalComponent;

  isLoggedIn$ = this.authService.isLoggedIn$;
  loading$: Observable<boolean>;

  firstLoadIsDone = false;
  finishedSubj = new BehaviorSubject(false);
  finished$ = this.finishedSubj.asObservable();
  
  errorOnLoadSubj = new BehaviorSubject(false);
  errorOnLoad$ = this.errorOnLoadSubj.asObservable();

  secondarySubj = new BehaviorSubject<Secondary[]>([]);
  secondary$ = this.secondarySubj.asObservable();;

  womenArr: Women[] = [];
  womenSubj = new BehaviorSubject<Women[]>([]);
  women$ = this.womenSubj.asObservable();

  vm$ : Observable<{ womenArr: Women[], secondaryArr: Secondary[] }>;

  selectedWomen: Women | undefined;
  editMode = false;
  editorConfig: AngularEditorConfig = editorConfigReadOnly;

  infScrollDisabled = false;

  textQuery: string = '';
  textQueryChanged: Subject<string> = new Subject<string>();

  defaultImage = defaultImg;

  constructor(private WomenService: FirestoreCrudService<Women>, private authService: AuthService,
    private loaderService: LoaderService, private secondaryService: SecondaryDataService,
    private destroy: DestroyRef, private meta: Meta, private titleService: Title) {
    this.loading$ = this.loaderService.isLoading$;
    //get general information
    this.secondary$ = from(this.secondaryService.getFilteredCollection('')).pipe(tap(res => {
      this.secondarySubj.next(res);
    }));
    //get items
    this.getItemSet();
    this.textQueryChanged
      .pipe(debounceTime(1000), distinctUntilChanged(), takeUntilDestroyed(this.destroy))
      .subscribe((model:any) => {
        this.textQuery = model;
        this.WomenService.getFilteredCollection(this.textQuery).then(res => {
          this.womenArr = [...res];
          this.womenSubj.next(this.womenArr);
          console.log('women-circles array updated: ' + res);
        });
      });
      this.vm$ = combineLatest(([this.women$, this.secondary$])).pipe(map(([w, s]) => ({
        womenArr: w,
        secondaryArr: s
      })));
  }

  ngOnInit() {
    this.titleService.setTitle("Círculos de mujeres - Crearse");
    this.meta.updateTag({ property: 'og:site_name', content: 'Crearse' });
    this.meta.updateTag({ property: 'og:title', content: 'Círculos de mujeres - Crearse' });
    this.meta.updateTag({ property: 'og:url', content: '' }); //pendent
    this.meta.updateTag({ property: 'og:locale', content: "es_ES" }); //pendent
    this.meta.updateTag({ property: 'og:description', content: 'Círculos de mujeres, espacio seguro para compartir experiencias y hacer terapia junto a otras mujeres.' });
    this.meta.updateTag({ property: 'og:author', content: 'Ximena Sosa' }); //pendent
    // this.meta.updateTag({ property: 'og:published_time', content: new Date(article.createdAt!).toString() });
    // this.meta.updateTag({ property: 'og:updated_time', content: new Date(article.updatedAt!).toString() });
    this.meta.updateTag({ property: 'og:image', content: '../../../assets/images/logo' });
    this.meta.updateTag({ property: 'og:image:alt', content: 'Logo de Crearse' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Círculos de mujeres - Crearse' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:image', content: '../../../assets/images/logo' });
    this.meta.updateTag({ name: 'twitter:image:alt', content: 'Logo de Crearse' });
  }

  trackbyId(i:number, women:Women ) {
    return trackById(i, women);
  }

  encode(str: string) {
    return encodeHTML(str);
  }

  onImageError(event: any, index: number) {
    event.target.src = this.defaultImage;
  }


  getItemSet() {
    this.errorOnLoadSubj.next(false);
    setTimeout(() => { this.loaderService.showSpinner() });
    this.WomenService.getCollection().then(res => {
      setTimeout(() => { this.loaderService.hideSpinner() });
      if (res.length == 0) {
        this.finishedSubj.next(true);
        console.log('No more articles to load');
      } else {
        this.womenArr = [...this.womenArr, ...res];
        this.womenSubj.next(this.womenArr);
        console.log(res);
      }
      this.firstLoadIsDone = true;
      this.infScrollDisabled = false;
    }).catch(e => {
      setTimeout(() => { this.loaderService.hideSpinner() });
      if (this.finishedSubj.value == false) {
        this.errorOnLoadSubj.next(true);
      }
      console.error(e);
      this.infScrollDisabled = false;
    });
  }

  modifyItem(womenInfoFromChild: { text: string }) {
    let currentSecondary = this.secondarySubj.value;
    if (currentSecondary && currentSecondary.length > 0) {
      let updatedItem = { ...currentSecondary[0], women: womenInfoFromChild.text };
      this.secondaryService.modifyItem(updatedItem).then(res => {
        console.log(res);
        this.secondarySubj.next(res);
        alert('Texto modificado con éxito.');
      }).catch(error => {
        console.log('Error when trying to modify object secondary: ' + error);
        setTimeout(() => { this.loaderService.hideSpinner() });
        alert('Error al modificar el texto.');
      });
    }
  }


  deleteItem() {
    setTimeout(() => { this.loaderService.showSpinner() });
    this.WomenService.deleteItem(this.selectedWomen!.id!).then(res => {
      console.log(res);
      console.log('delete women-circles item with id ' + this.selectedWomen!.id!);
      this.womenArr = this.womenArr.filter(wm => wm.id !== this.selectedWomen!.id!);
      this.womenSubj.next(this.womenArr);
      this.selectedWomen = undefined;
      this.modal.close();
      setTimeout(() => { this.loaderService.hideSpinner() });
      alert('Objeto borrado con éxito.');
    }).catch(e => {
      console.error(e);
      this.selectedWomen = undefined;
      alert('Error al borrar el ítem de círculo de mujeres.');
      this.modal.close();
      setTimeout(() => { this.loaderService.hideSpinner() });
    });
  }

  openConfirmationModal(c: Women) {
    this.selectedWomen = c;
    this.modal.open();
  }

  onScroll() {
    console.log('scroll');
    if (this.textQuery == '') {
      this.infScrollDisabled = true;
      if (this.finishedSubj.value == false && this.firstLoadIsDone == true) {
        this.getItemSet();
      }
    }
  }

  onSearch(query: string) {
    console.log('search by: ' + query);
    if (query != '') {
      this.textQueryChanged.next(query);
    } else {
      this.womenArr = [];
      this.womenSubj.next([]);
      this.WomenService.lastItemTimestamp = undefined;
      this.getItemSet();
    }
  }

  ngOnDestroy() {
    this.WomenService.lastItemTimestamp = undefined;
    this.secondaryService.lastItemTimestamp = undefined;

    this.meta.removeTag("property='og:site_name'");
    this.meta.removeTag("property='og:title'");
    this.meta.removeTag("property='og:url'");
    this.meta.removeTag("property='og:locale'");
    this.meta.removeTag("property='og:type'");
    this.meta.removeTag("property='og:description'");
    this.meta.removeTag("property='og:author'");
    // this.meta.removeTag("property='og:published_time'");
    // this.meta.removeTag("property='og:updated_time'");
    this.meta.removeTag("property='og:image'");
    this.meta.removeTag("property='og:image:alt'");
    this.meta.removeTag("name='twitter:title'");
    this.meta.removeTag("name='twitter:card'");
    this.meta.removeTag("name='twitter:image'");
    this.meta.removeTag("name='twitter:image:alt'");

    this.titleService.setTitle('Crearse: Psicología y Arte');
  }


}
