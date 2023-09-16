import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { BehaviorSubject, Observable } from 'rxjs';
import { AdminItemFormComponent } from 'src/app/admin/admin-item-form/admin-item-form.component';
import { Secondary, secondaryDummy } from 'src/app/models/secondary';
import { AuthService } from 'src/app/services/auth.service';
import { SecondaryDataService } from 'src/app/services/crud/secondary-data.service';
import { LoaderService } from 'src/app/services/loader.service';
import { CanComponentDeactivate } from 'src/app/shared/can-deactivate.guard';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { editorConfigReadOnly } from 'src/app/shared/utilities/editor-config';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-info',
  standalone: true,
  imports:[NgIf, AngularEditorModule, AsyncPipe, FormsModule, AdminItemFormComponent],
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfoComponent implements OnInit, CanComponentDeactivate {
  @ViewChild(AdminItemFormComponent, { static: false }) itemFormComponent!: AdminItemFormComponent;
  @ViewChild(ModalComponent) modal!: ModalComponent;

  private secondarySubject = new BehaviorSubject<Secondary[]>([secondaryDummy]);
  secondary$ = this.secondarySubject.asObservable();

  isLoggedIn$ = this.authService.isLoggedIn$;
  loading$: Observable<boolean>;

  modificationIsFinishedSubj = new BehaviorSubject(false);
  modificationIsFinished$ = this.modificationIsFinishedSubj.asObservable();

  isErrorSubj = new BehaviorSubject(false);
  isError$ = this.isErrorSubj.asObservable();

  editMode = false;

  editorConfig: AngularEditorConfig = editorConfigReadOnly;
  editorContent = '';

  constructor(private secondaryService: SecondaryDataService, private authService: AuthService,
    private loaderService: LoaderService,
    private router: Router, private meta: Meta, private titleService: Title) {
    this.reloadSecondary$();
    this.loading$ = this.loaderService.isLoading$;
   }

  ngOnInit() {
    this.titleService.setTitle("Servicios - Crearse");
    this.meta.updateTag({ property: 'og:site_name', content: 'Crearse' });
    this.meta.updateTag({ property: 'og:title', content: 'Servicios - Crearse' });
    this.meta.updateTag({ property: 'og:url', content: '' }); //pendent
    this.meta.updateTag({ property: 'og:locale', content: "es_ES" }); //pendent
    this.meta.updateTag({ property: 'og:type', content: "profile" });
    this.meta.updateTag({ property: 'og:description', content: 'Descripción de los servicios ofrecidos por la psicoanalista Ximena Sosa: acompañamiento emocional, círculos de mujeres, cursos y talleres.' });
    this.meta.updateTag({ property: 'og:author', content: 'Ximena Sosa' }); //pendent
    // this.meta.updateTag({ property: 'og:published_time', content: new Date(article.createdAt!).toString() });
    // this.meta.updateTag({ property: 'og:updated_time', content: new Date(article.updatedAt!).toString() });
    this.meta.updateTag({ property: 'og:image', content: '../../../assets/images/logo' });
    this.meta.updateTag({ property: 'og:image:alt', content: 'Logo de Crearse' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Servicios de Ximena Sosa, psicoanalista' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:image', content: '../../../assets/images/logo' });
    this.meta.updateTag({ name: 'twitter:image:alt', content: 'Logo de Crearse' });
  }

    reloadSecondary$() {
    this.secondaryService.getFilteredCollection('')
      .then(data => {
        this.secondarySubject.next(data);
      });
  }

    openConfirmationModal() {
    this.modal.open();
  }

  //Aquest funció modifica un document, així que suposo q hauria de modificar únic secondary

  modifyItem(infoFromChild: { text: string }) {
    let currentSecondary = this.secondarySubject.value;
    if (currentSecondary && currentSecondary.length > 0) {
      let updatedItem = { ...currentSecondary[0], info: infoFromChild.text };
      this.secondaryService.modifyItem(updatedItem).then(res => {
        console.log(res);
        this.modificationIsFinishedSubj.next(true);
        this.isErrorSubj.next(false);
        this.reloadSecondary$();
      }).catch(error => {
        console.log('Error when trying to modify object secondary: ' + error);
        this.isErrorSubj.next(true);
        setTimeout(() => { this.loaderService.hideSpinner() });
        this.modificationIsFinishedSubj.next(false);
      });
    }
  }

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
