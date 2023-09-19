import { Component, DestroyRef, OnInit, ViewChild } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Article } from 'src/app/models/article';
import { ArticlesService } from '../../../services/crud/articles.service';
import { CommonModule, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { editorConfigReadOnly } from 'src/app/shared/utilities/editor-config';
import { BehaviorSubject, Observable, Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { LoaderService } from '../../../services/loader.service';
import { encodeHTML } from 'src/app/shared/utilities/encode';
import { FirestoreCrudService } from 'src/app/services/crud/firestore-crud.service';
import { defaultImg } from 'src/app/models/defaultImg';
import { ChangeDetectionStrategy } from '@angular/core';
import { trackById } from 'src/app/shared/utilities/trackby-id';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-articles-list',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, AngularEditorModule, FormsModule,
  InfiniteScrollModule, ModalComponent, NgFor],
  providers: [{provide: FirestoreCrudService, useClass: ArticlesService}],
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticlesListComponent implements OnInit {
  @ViewChild(ModalComponent) modal!: ModalComponent;
  
  isLoggedIn$ = this.authService.isLoggedIn$;
  loading$: Observable<boolean>;
  
  firstLoadIsDone = false;
  finishedSubj = new BehaviorSubject(false);
  finished$ = this.finishedSubj.asObservable();
  
  isErrorSubj = new BehaviorSubject(false);
  isError$ = this.isErrorSubj.asObservable();
  
  articles: Article[] = [];
  articlesSubj = new BehaviorSubject<Article[]>([]);
  articles$ = this.articlesSubj.asObservable();

  selectedArticle: Article|undefined;

  editorConfig = editorConfigReadOnly;

  infScrollDisabled = false;

  textQuery: string = '';
  textQueryChanged: Subject<string> = new Subject<string>();

  defaultImage = defaultImg;

  constructor(private articlesService: FirestoreCrudService<Article>, private authService: AuthService,
    private loaderService: LoaderService, private destroy: DestroyRef, private meta: Meta,
  private titleService: Title) {
    this.loading$ = this.loaderService.isLoading$;
    this.getItemSet();
    this.textQueryChanged
      .pipe(debounceTime(1000), distinctUntilChanged(), takeUntilDestroyed(this.destroy))
      .subscribe((model:any) => {
        this.textQuery = model;
        this.articlesService.getFilteredCollection(this.textQuery).then(res => { 
          this.articles = [...res];
          this.articlesSubj.next(res);
        })
      });
  }

  ngOnInit() {
    this.titleService.setTitle("Blog de psicoanálisis y psicología - Crearse");
    this.meta.updateTag({ property: 'og:site_name', content: 'Crearse' });
    this.meta.updateTag({ property: 'og:title', content: 'Blog de psicoanálisis y psicología - Crearse' });
    this.meta.updateTag({ property: 'og:url', content: '' }); //pendent
    this.meta.updateTag({ property: 'og:locale', content: "es_ES" }); //pendent
    this.meta.updateTag({ property: 'og:description', content: 'Blog con artículos de psicología y psicoanálisis.' });
    this.meta.updateTag({ property: 'og:author', content: 'Ximena Sosa' }); //pendent
    // this.meta.updateTag({ property: 'og:published_time', content: new Date(article.createdAt!).toString() });
    // this.meta.updateTag({ property: 'og:updated_time', content: new Date(article.updatedAt!).toString() });
    this.meta.updateTag({ property: 'og:image', content: '../../../assets/images/logo' });
    this.meta.updateTag({ property: 'og:image:alt', content: 'Logo de Crearse' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Blog de psicoanálisis y psicología - Crearse' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:image', content: '../../../assets/images/logo' });
    this.meta.updateTag({ name: 'twitter:image:alt', content: 'Logo de Crearse' });
  }

  trackbyId(i:number, article:Article ) {
    return trackById(i, article);
  }

  encode(str:string) {
    return encodeHTML(str);
  }

  onImageError(event: any, index: number) {
    event.target.src = this.defaultImage;
  }

  getItemSet() {
      setTimeout(() => { this.loaderService.showSpinner() });
    this.articlesService.getCollection().then(res => {
      setTimeout(() => { this.loaderService.hideSpinner() });
      if (res.length == 0) {
        this.finishedSubj.next(true);
      } else {
        this.articles = [...this.articles, ...res];
        this.articlesSubj.next(this.articles);
      }
      this.firstLoadIsDone = true;
      this.infScrollDisabled = false;
    }).catch(e => {
      setTimeout(() => { this.loaderService.hideSpinner() });
      if (this.finishedSubj.value == false) {
        this.isErrorSubj.next(true);
      }
      console.error(e)
      this.infScrollDisabled = false;
    });
  }

  deleteItem() {
    setTimeout(() => { this.loaderService.showSpinner() });
    this.articlesService.deleteItem(this.selectedArticle!.id!).then(res => {
      this.articles = this.articles.filter(article => article.id !== this.selectedArticle!.id!);
      this.articlesSubj.next(this.articles);
      this.selectedArticle = undefined;
      this.modal.close();
      setTimeout(() => { this.loaderService.hideSpinner() });
    }).catch(e => {
      console.error(e);
      this.selectedArticle = undefined;
      alert('Error al borrar el artículo.');
      this.modal.close();
      setTimeout(() => { this.loaderService.hideSpinner() });
    });
  }

  openConfirmationModal(c: Article) {
    this.selectedArticle = c;
    this.modal.open();
  }

  onScroll() {
    if (this.textQuery == '') {
      this.infScrollDisabled = true;
      if (this.finishedSubj.value == false && this.firstLoadIsDone == true) {
        this.getItemSet();
      }
    }
  }

  onSearch(query: string) {
    if (query != '') {
      this.textQueryChanged.next(query);
    } else {
      this.articles = [];
      this.articlesSubj.next([]);
      this.articlesService.lastItemTimestamp = undefined;
      this.getItemSet();
    }
  }

  ngOnDestroy(): void {
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
