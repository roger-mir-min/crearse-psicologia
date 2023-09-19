import { AsyncPipe, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule, HttpEvent } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularEditorConfig, AngularEditorModule, UploadResponse } from '@kolkov/angular-editor';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AdminItemFormComponent } from 'src/app/admin/admin-item-form/admin-item-form.component';
import { Course } from 'src/app/models/course';
import { AuthService } from 'src/app/services/auth.service';
import { CoursesService } from 'src/app/services/crud/courses.service';
import { FirestoreCrudService } from 'src/app/services/crud/firestore-crud.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { editorConfigReadOnly } from 'src/app/shared/utilities/editor-config';
import { CanComponentDeactivate } from 'src/app/shared/can-deactivate.guard';
import { Meta, Title } from '@angular/platform-browser';
import { defaultImg } from 'src/app/models/defaultImg';

@Component({
  selector: 'app-course',
  standalone: true,
  providers: [{provide: FirestoreCrudService, useClass: CoursesService}],
  imports: [NgIf, AsyncPipe, AdminItemFormComponent, AngularEditorModule, HttpClientModule,
    FormsModule, ModalComponent],
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseComponent implements OnInit, CanComponentDeactivate {
  @ViewChild(ModalComponent) modal!: ModalComponent;
  @ViewChild(AdminItemFormComponent, { static: false }) itemFormComponent!: AdminItemFormComponent;

  isLoggedIn$ = this.authService.isLoggedIn$;
  loading$: Observable<boolean>;

  modificationIsFinishedSubj = new BehaviorSubject(false);
  modificationIsFinished$ = this.modificationIsFinishedSubj.asObservable();

  isErrorSubj = new BehaviorSubject(false);
  isError$ = this.isErrorSubj.asObservable();

  editMode = false;

  courseSubj = new BehaviorSubject<Course>({ title: '', text: '', shortDescription: '', price: 0 });
  course$ = this.courseSubj.asObservable();
  
  editorConfig: AngularEditorConfig = editorConfigReadOnly;
  editorContent = '';
  
  @Input() set slug(slug: string) {
    const parts = slug.split('-');
    const id = parts[parts.length - 1].trim();
    this.coursesService.getItem(id).then(res => {
      this.editorContent= res.text;
      this.courseSubj.next({ id: id, ...res });
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

  
  constructor(private coursesService: FirestoreCrudService<Course>,
    private authService: AuthService,
    private loaderService: LoaderService,
    private router: Router, private destroy: DestroyRef, private meta: Meta,
    private titleService: Title) {
      this.loading$ = this.loaderService.isLoading$;
    }

  ngOnInit() {
    this.course$.subscribe(course => {
      this.titleService.setTitle("Curso " + course.title + " - Crearse");
      this.meta.updateTag({ property: 'og:site_name', content: 'Crearse' });
      this.meta.updateTag({ property: 'og:title', content: "Curso " + course.title + " - Crearse" });
      this.meta.updateTag({ property: 'og:url', content: '' }); //pendent
      this.meta.updateTag({ property: 'og:locale', content: "es_ES" }); //pendent
      this.meta.updateTag({ property: 'og:description', content: course.shortDescription ?? 'Curso de Crearse'});
      this.meta.updateTag({ property: 'og:author', content: 'Ximena Sosa' }); //pendent
      // this.meta.updateTag({ property: 'og:published_time', content: new Date(article.createdAt!).toString() });
      // this.meta.updateTag({ property: 'og:updated_time', content: new Date(article.updatedAt!).toString() });
      this.meta.updateTag({ property: 'og:image', content: course.imageUrl ?? defaultImg });
      this.meta.updateTag({ property: 'og:image:alt', content: 'Imagen del curso' });
      this.meta.updateTag({ name: 'twitter:title', content: "Curso " + course.title + " - Crearse" });
      this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
      this.meta.updateTag({ name: 'twitter:image', content: course.imageUrl ?? defaultImg });
      this.meta.updateTag({ name: 'twitter:image:alt', content: 'Imagen del curso' });
    });
  }

  openConfirmationModal() {
    this.modal.open();
  }

  deleteItem() {
    this.modificationIsFinishedSubj.next(false);
    setTimeout(() => { this.loaderService.showSpinner() });
    this.course$.pipe(takeUntilDestroyed(this.destroy)).subscribe(course => 
      this.coursesService.deleteItem(course.id!).then(res => {
        this.modal.close();
        this.isErrorSubj.next(true);
        this.router.navigate(['courses']);
        setTimeout(() => { this.loaderService.hideSpinner() });
      }).catch(e => {
        console.error('Error when trying to delete object: ' + e);
        this.isErrorSubj.next(true);
        this.modal.close();
        alert('Error al borrar el curso.');
        this.router.navigate(['courses']);
        setTimeout(() => { this.loaderService.hideSpinner() });
      }
    ));
  }

modifyItem(courseFromChild: Course) {
  this.modificationIsFinishedSubj.next(false);
  this.isErrorSubj.next(false);
  setTimeout(() => { this.loaderService.showSpinner() });
  this.course$.pipe(takeUntilDestroyed(this.destroy)).subscribe(course => {
    this.coursesService.modifyItem({ ...courseFromChild, id: course.id }).then(res => {
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
  
    ngOnDestroy() {    
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
