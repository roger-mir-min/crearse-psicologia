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
import { EmSupportService } from 'src/app/services/crud/em-support.service';
import { EmSupport } from 'src/app/models/em-support';
import { Secondary } from 'src/app/models/secondary';
import { SecondaryDataService } from 'src/app/services/crud/secondary-data.service';
import { defaultImg } from 'src/app/models/defaultImg';
import { trackById } from 'src/app/shared/utilities/trackby-id';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { AdminItemFormComponent } from 'src/app/admin/admin-item-form/admin-item-form.component';

@Component({
  selector: 'app-em-support-list',
  standalone: true,
  imports: [CommonModule, RouterModule, AngularEditorModule, FormsModule, InfiniteScrollModule,
    ModalComponent, AdminItemFormComponent],
  providers: [{ provide: FirestoreCrudService, useClass: EmSupportService }],
  templateUrl: './em-support-list.component.html',
  styleUrls: ['./em-support-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmSupportListComponent implements OnInit {

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

  emSupportArr: EmSupport[] = [];
  emSupportSubj = new BehaviorSubject<EmSupport[]>([]);
  emSupport$ = this.emSupportSubj.asObservable();

  vm$ : Observable<{ emArr: EmSupport[], secondaryArr: Secondary[] }>;

  selectedEmSupport: EmSupport | undefined;
  editMode = false;
  editorConfig: AngularEditorConfig = editorConfigReadOnly;

  infScrollDisabled = false;

  textQuery: string = '';
  textQueryChanged: Subject<string> = new Subject<string>();

  defaultImage = defaultImg;

  constructor(private emSupportService: FirestoreCrudService<EmSupport>, private authService: AuthService,
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
        this.emSupportService.getFilteredCollection(this.textQuery).then(res => { 
          this.emSupportArr = [...res];
          this.emSupportSubj.next(this.emSupportArr);
          console.log('em-support array updated: ' + res);
        })
      });
      this.vm$ = combineLatest(([this.emSupport$, this.secondary$])).pipe(map(([c, s]) => ({
        emArr: c,
        secondaryArr: s
      })));
    
  }

  ngOnInit() {
    this.titleService.setTitle("Acompañamiento emocional - Crearse");
    this.meta.updateTag({ property: 'og:site_name', content: 'Crearse' });
    this.meta.updateTag({ property: 'og:title', content: 'Blog de psicoanálisis y psicología - Crearse' });
    this.meta.updateTag({ property: 'og:url', content: '' }); //pendent
    this.meta.updateTag({ property: 'og:locale', content: "es_ES" }); //pendent
    this.meta.updateTag({ property: 'og:description', content: 'Información de los servicios de acompañamiento emocional.' });
    this.meta.updateTag({ property: 'og:author', content: 'Ximena Sosa' }); //pendent
    // this.meta.updateTag({ property: 'og:published_time', content: new Date(article.createdAt!).toString() });
    // this.meta.updateTag({ property: 'og:updated_time', content: new Date(article.updatedAt!).toString() });
    this.meta.updateTag({ property: 'og:image', content: '../../../assets/images/logo' });
    this.meta.updateTag({ property: 'og:image:alt', content: 'Logo de Crearse' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Acompañamiento emocional - Crearse' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:image', content: '../../../assets/images/logo' });
    this.meta.updateTag({ name: 'twitter:image:alt', content: 'Logo de Crearse' });
  }

  trackbyId(i:number, em:EmSupport ) {
    return trackById(i, em);
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
    this.emSupportService.getCollection().then(res => {
      setTimeout(() => { this.loaderService.hideSpinner() });
      if (res.length == 0) {
        this.finishedSubj.next(true);
        console.log('No more emotional-support items to load');
      } else {
        this.emSupportArr = [...this.emSupportArr, ...res];
        this.emSupportSubj.next(this.emSupportArr);
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

  modifyItem(emInfoFromChild: { text: string }) {
    let currentSecondary = this.secondarySubj.value;
    if (currentSecondary && currentSecondary.length > 0) {
      let updatedItem = { ...currentSecondary[0], emSupport: emInfoFromChild.text };
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
    this.emSupportService.deleteItem(this.selectedEmSupport!.id!).then(res => {
      console.log(res);
      console.log('delete em-support item with id ' + this.selectedEmSupport!.id!);
      this.emSupportArr = this.emSupportArr.filter(em => em.id !== this.selectedEmSupport!.id!);
      this.emSupportSubj.next(this.emSupportArr);
      this.selectedEmSupport = undefined;
      this.modal.close();
      setTimeout(() => { this.loaderService.hideSpinner() });
      alert('Objeto borrado con éxito.');
    }).catch(e => {
      console.error(e);
      this.selectedEmSupport = undefined;
      alert('Error al borrar el curso.');
      this.modal.close();
      setTimeout(() => { this.loaderService.hideSpinner() });
    });
  }

  openConfirmationModal(c: EmSupport) {
    this.selectedEmSupport = c;
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
      this.emSupportArr = [];
      this.emSupportSubj.next([]);
      this.emSupportService.lastItemTimestamp = undefined;
      this.getItemSet();
    }
  }

  ngOnDestroy() {
    this.emSupportService.lastItemTimestamp = undefined;
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
