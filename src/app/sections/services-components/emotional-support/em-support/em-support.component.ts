import { AsyncPipe, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { BehaviorSubject, Observable } from 'rxjs';
import { AdminItemFormComponent } from 'src/app/admin/admin-item-form/admin-item-form.component';
import { EmSupport } from 'src/app/models/em-support';
import { AuthService } from 'src/app/services/auth.service';
import { EmSupportService } from 'src/app/services/crud/em-support.service';
import { FirestoreCrudService } from 'src/app/services/crud/firestore-crud.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { editorConfigReadOnly } from 'src/app/shared/utilities/editor-config';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CanComponentDeactivate } from 'src/app/shared/can-deactivate.guard';
import { Title, Meta } from '@angular/platform-browser';
import { defaultImg } from 'src/app/models/defaultImg';

@Component({
  selector: 'app-em-support',
  standalone: true,
  providers: [{ provide: FirestoreCrudService, useClass: EmSupportService }],
  imports: [NgIf, AsyncPipe, AdminItemFormComponent, AngularEditorModule, HttpClientModule,
    FormsModule, ModalComponent],
  templateUrl: './em-support.component.html',
  styleUrls: ['./em-support.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmSupportComponent implements OnInit, CanComponentDeactivate  {
  @ViewChild(ModalComponent) modal!: ModalComponent;
  @ViewChild(AdminItemFormComponent, { static: false }) itemFormComponent!: AdminItemFormComponent;

  isLoggedIn$ = this.authService.isLoggedIn$;
  loading$: Observable<boolean>;

  modificationIsFinishedSubj = new BehaviorSubject(false);
  modificationIsFinished$ = this.modificationIsFinishedSubj.asObservable();

  isErrorSubj = new BehaviorSubject(false);
  isError$ = this.isErrorSubj.asObservable();

  editMode = false;

  emSubj = new BehaviorSubject<EmSupport>({ title: '', text: '', shortDescription: '', price: 0 });
  em$ = this.emSubj.asObservable();
  
  editorConfig: AngularEditorConfig = editorConfigReadOnly;
  editorContent = '';
  
  @Input() set slug(slug: string) {
    const parts = slug.split('-');
    const id = parts[parts.length - 1].trim();
    this.emSupportService.getItem(id).then(res => {
      this.editorContent= res.text;
      this.emSubj.next({ id: id, ...res });
    }).catch(e => console.error(e));
  };

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
  
  constructor(private emSupportService: FirestoreCrudService<EmSupport>,
    private authService: AuthService,
    private loaderService: LoaderService,
    private router: Router, private destroy: DestroyRef, private meta: Meta,
  private titleService: Title) {
      this.loading$ = this.loaderService.isLoading$;
    }

  ngOnInit() {
    this.em$.subscribe(em => {
      this.titleService.setTitle("Servicio de acompañamiento emocional: " + em.title + " - Crearse");
      this.meta.updateTag({ property: 'og:site_name', content: 'Crearse' });
      this.meta.updateTag({ property: 'og:title', content: "Servicio de acompañamiento emocional: " + em.title + " - Crearse" });
      this.meta.updateTag({ property: 'og:url', content: '' }); //pendent
      this.meta.updateTag({ property: 'og:locale', content: "es_ES" }); //pendent
      this.meta.updateTag({ property: 'og:description', content: em.shortDescription ?? 'Servicio de terapia (acompañamiento emocional)' });
      this.meta.updateTag({ property: 'og:author', content: 'Ximena Sosa' }); //pendent
      // this.meta.updateTag({ property: 'og:published_time', content: new Date(article.createdAt!).toString() });
      // this.meta.updateTag({ property: 'og:updated_time', content: new Date(article.updatedAt!).toString() });
      this.meta.updateTag({ property: 'og:image', content: em.imageUrl ?? defaultImg });
      this.meta.updateTag({ property: 'og:image:alt', content: 'Imagen del servicio de acompañamiento emocional' });
      this.meta.updateTag({ name: 'twitter:title', content: "Curso " + em.title + " - Crearse" });
      this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
      this.meta.updateTag({ name: 'twitter:image', content: em.imageUrl ?? defaultImg });
      this.meta.updateTag({ name: 'twitter:image:alt', content: 'Imagen del servicio de acompañamiento emocional' });
    });
  }

  openConfirmationModal() {
    this.modal.open();
  }

  deleteItem() {
    this.modificationIsFinishedSubj.next(false);
    setTimeout(() => { this.loaderService.showSpinner() });
    this.em$.pipe(takeUntilDestroyed(this.destroy)).subscribe(em => 
      this.emSupportService.deleteItem(em.id!).then(res => {
        this.modal.close();
        this.isErrorSubj.next(true);
        this.router.navigate(['emotional-support']);
        setTimeout(() => { this.loaderService.hideSpinner() });
      }).catch(e => {
        console.error('Error when trying to delete object: ' + e);
        this.isErrorSubj.next(true);
        this.modal.close();
        alert('Error al borrar el ítem de acompañamiento emocional.');
        this.router.navigate(['emotional-support']);
        setTimeout(() => { this.loaderService.hideSpinner() });
      }
    ));
  }

modifyItem(emFromChild: EmSupport) {
  this.modificationIsFinishedSubj.next(false);
  this.isErrorSubj.next(false);
  setTimeout(() => { this.loaderService.showSpinner() });
  this.em$.pipe(takeUntilDestroyed(this.destroy)).subscribe(em => {
    this.emSupportService.modifyItem({ ...emFromChild, id: em.id }).then(res => {
      setTimeout(() => { this.loaderService.hideSpinner() });
      this.modificationIsFinishedSubj.next(true);
    }).catch(e => {
      console.error('Error when trying to modify object: ' + e);
      setTimeout(() => { this.loaderService.hideSpinner() });
      this.isErrorSubj.next(true);
    }
    )
  });
}
  
  ngOnDestroy(): void {
    this.titleService.setTitle('Crearse: Psicología y Arte');

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
    
  }


}
