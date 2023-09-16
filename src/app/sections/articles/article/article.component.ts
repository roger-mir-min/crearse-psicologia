import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit, ViewChild } from '@angular/core';
import { ShareButtonModule } from 'ngx-sharebuttons/button';
import { Article } from 'src/app/models/article';
import { ArticlesService } from 'src/app/services/crud/articles.service';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { BehaviorSubject, Observable } from 'rxjs';
import { AdminItemFormComponent } from 'src/app/admin/admin-item-form/admin-item-form.component';
import { editorConfigReadOnly } from 'src/app/shared/utilities/editor-config';
import { LoaderService } from '../../../services/loader.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { FirestoreCrudService } from 'src/app/services/crud/firestore-crud.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CanComponentDeactivate } from 'src/app/shared/can-deactivate.guard';
import { defaultImg } from 'src/app/models/defaultImg';

@Component({
  selector: 'app-article',
  standalone: true,
  providers: [{provide: FirestoreCrudService, useClass: ArticlesService}],
  imports: [ShareButtonModule, AsyncPipe, NgIf, AsyncPipe, AngularEditorModule,
    HttpClientModule, FormsModule, AdminItemFormComponent, ModalComponent, DatePipe],
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleComponent implements OnInit, CanComponentDeactivate {
  @ViewChild(ModalComponent) modal!: ModalComponent;
  @ViewChild(AdminItemFormComponent, { static: false }) itemFormComponent!: AdminItemFormComponent;

  articleSubj = new BehaviorSubject<Article>({ id: '', title: '', text: '', duration: 1, imageUrl: '' });
  article$ = this.articleSubj.asObservable();

  isLoggedIn$ = this.authService.isLoggedIn$;
  loading$: Observable<boolean>;

  modificationIsFinishedSubj = new BehaviorSubject(false);
  modificationIsFinished$ = this.modificationIsFinishedSubj.asObservable();

  isErrorSubj = new BehaviorSubject(false);
  isError$ = this.isErrorSubj.asObservable();

  editMode = false;
  
  editorContent = '';

  @Input() set slug(slug: string) {
    const parts = slug.split('-');
    const id = parts[parts.length - 1].trim();
    console.log("l'id és : " + id);
    this.articlesService.getItem(id).then(res => {
      this.editorContent= res.text;
      this.articleSubj.next({ id: id, ...res });
    }).catch(e => console.error(e));
  };
  
  editorConfig: AngularEditorConfig = editorConfigReadOnly;

  canDeactivate(nextState?: any): boolean {
    if (this.itemFormComponent) {
      if (this.itemFormComponent.itemForm.dirty) {
        return window.confirm('Seguro que quieres cambiar de página? Se perderá la información introducida.');
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  constructor(private articlesService: FirestoreCrudService<Article>,
    private authService: AuthService,
    private router: Router,
    private loaderService: LoaderService,
    private meta: Meta, private destroy: DestroyRef,
    private titleService: Title) {
      this.loading$ = this.loaderService.isLoading$;
    }
  

  ngOnInit() {
    this.article$.pipe(takeUntilDestroyed(this.destroy)).subscribe(article => {
      const title = article.title;
      this.titleService.setTitle(title + " - Crearse");
      const description = article.shortDescription;
      const imgUrl = article.imageUrl;
      const url = this.router.url;

      this.meta.updateTag({ property: 'og:site_name', content: 'Crearse' });
      this.meta.updateTag({ property: 'og:title', content: 'Crearse: Psicología y arte' });
      this.meta.updateTag({ property: 'og:url', content: url });
      this.meta.updateTag({ property: 'og:site_name', content: "crearse" }); //pendent
      this.meta.updateTag({ property: 'og:locale', content: "es_ES" }); //pendent
      this.meta.updateTag({ property: 'og:type', content: "article" });
      this.meta.updateTag({ property: 'og:title', content: title });
      this.meta.updateTag({ property: 'og:description', content: description ?? 'Artículo de psicología' });
      this.meta.updateTag({ property: 'og:author', content: 'Ximena Sosa' }); //pendent
      this.meta.updateTag({ property: 'og:published_time', content: new Date(article.createdAt!).toString() });
      if (article.updatedAt && article.updatedAt>0) {
        this.meta.updateTag({ property: 'og:updated_time', content: new Date(article.updatedAt!).toString() });
      }
      this.meta.updateTag({ property: 'og:image', content: imgUrl ?? defaultImg });
      this.meta.updateTag({ name: 'twitter:title', content: title + " - Crearse" });
      this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
      this.meta.updateTag({ name: 'twitter:image', content: imgUrl ?? defaultImg });
      this.meta.updateTag({ name: 'twitter:image:alt', content: 'Imagen del artículo de Psicología y arte' });

      if (article.tags && article.tags.length > 0) {
        article.tags.forEach(tag => {
          this.meta.addTag({ property: 'article:tag', content: tag });
        });
      }
    });
  }

  openConfirmationModal() {
    this.modal.open();
  }

  deleteItem() {
    this.modificationIsFinishedSubj.next(false);
    setTimeout(() => { this.loaderService.showSpinner() });
    this.article$.pipe(takeUntilDestroyed(this.destroy)).subscribe(em => 
      this.articlesService.deleteItem(em.id!).then(res => {
        console.log(res);
        console.log('delete article with id ' + res.id!);
        this.modal.close();
        this.isErrorSubj.next(true);
        this.router.navigate(['blog']);
        setTimeout(() => { this.loaderService.hideSpinner() });
      }).catch(e => {
        console.log('Error when trying to delete object: ' + e);
        this.isErrorSubj.next(true);
        this.modal.close();
        alert('Error al borrar el artículo.');
        this.router.navigate(['blog']);
        setTimeout(() => { this.loaderService.hideSpinner() });
      }
    ));
  }

modifyItem(articleFromChild: Article) {
  this.modificationIsFinishedSubj.next(false);
  this.isErrorSubj.next(false);
  setTimeout(() => { this.loaderService.showSpinner() });
  this.article$.pipe(takeUntilDestroyed(this.destroy)).subscribe(em => {
    this.articlesService.modifyItem({ ...articleFromChild, id: em.id }).then(res => {
      console.log(res);
      console.log('modify article with id ' + em.id);
      setTimeout(() => { this.loaderService.hideSpinner() });
      this.modificationIsFinishedSubj.next(true);
    }).catch(e => {
      console.log('Error when trying to modify object: ' + e);
      this.isErrorSubj.next(true);
      setTimeout(() => { this.loaderService.hideSpinner() });
    }
    )
  });
}

  ngOnDestroy() {
    this.meta.removeTag("property='og:url'");
    this.meta.removeTag("property='og:site_name'");
    this.meta.removeTag("property='og:locale'");
    this.meta.removeTag("property='og:type'");
    this.meta.removeTag("property='og:title'");
    this.meta.removeTag("property='og:description'");
    this.meta.removeTag("property='og:author'");
    this.meta.removeTag("property='og:published_time'");
    this.meta.removeTag("property='og:updated_time'");
    this.meta.removeTag("property='og:image'");
    this.meta.removeTag("name='twitter:title'");
    this.meta.removeTag("name='twitter:card'");
    this.meta.removeTag("name='twitter:image'");
    this.meta.removeTag("name='twitter:image:alt'");

    this.titleService.setTitle('Crearse: Psicología y Arte');

    const article = this.articleSubj.value;
    if (article.tags && article.tags.length > 0) {
      article.tags.forEach(tag => {
        this.meta.removeTag(`property="article:tag"`);
      });
    }
    };

}



