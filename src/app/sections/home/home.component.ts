import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject, Observable, combineLatest, from, map } from 'rxjs';
import { ArticlesService } from 'src/app/services/crud/articles.service';
import { WHATSAPP_COMPLETE_URL } from 'src/app/models/whatsapp_data';
import { WhatsappBtnComponent } from '../../shared/components/whatsapp-btn/whatsapp-btn.component';
import { HomeService } from 'src/app/services/crud/home.service';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { editorConfigReadOnly } from 'src/app/shared/utilities/editor-config';
import { FormsModule } from '@angular/forms';
import { Home } from 'src/app/models/home';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { AdminItemFormComponent } from 'src/app/admin/admin-item-form/admin-item-form.component';
import { defaultImg } from 'src/app/models/defaultImg';
import { trackById } from 'src/app/shared/utilities/trackby-id';
import { Article } from 'src/app/models/article';
import { CanComponentDeactivate } from 'src/app/shared/can-deactivate.guard';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, WhatsappBtnComponent, NgFor, NgIf, AsyncPipe, NgClass, AngularEditorModule, FormsModule,
  AdminItemFormComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, CanComponentDeactivate {
  @ViewChild(ModalComponent) modal!: ModalComponent;
  @ViewChildren(AdminItemFormComponent) itemFormCompList!: QueryList<AdminItemFormComponent>

  articles$;

  homeData: Home = { title: '', text: '', about: '', services: '', service1: '', service2: '', service3: '' };
  homeDataSubj = new BehaviorSubject<Home>(this.homeData);
  homeData$ = this.homeDataSubj.asObservable();

  about: string = '';

  //prescindeixo de vm$ perquè si no s'emetessin articles es bloquejaria tot
  // vm$: Observable<{ articles: Article[], homeData: Home }>;

  isLoggedIn$ = this.authService.isLoggedIn$;
  loading$: Observable<boolean>;

  modificationIsFinishedSubj = new BehaviorSubject(false);
  modificationIsFinished$ = this.modificationIsFinishedSubj.asObservable();

  selectedEditor: keyof Home | undefined;

  editorConfig: AngularEditorConfig = editorConfigReadOnly;
  editorContent = '';

  defaultImage = defaultImg;

  whatsappUrl = WHATSAPP_COMPLETE_URL;

  aos(num: number) {
    if (num == 0) { return 0 }
    else if (num == 1) { return 300 }
    else if (num == 2) { return 600 }
    else { return 900}
  }

  constructor(private articlesService: ArticlesService,
    private homeService: HomeService, private authService: AuthService,
    private loaderService: LoaderService,
    private router: Router, private meta: Meta, private titleService: Title) {
      this.loading$ = this.loaderService.isLoading$;
      this.articles$ = from(this.articlesService.getCollection());
      this.homeService.getFilteredCollection('').then(res => {
        this.homeData = { ...res[0] };
        this.homeDataSubj.next(this.homeData);
        this.about = this.homeData.about; //cal??
      });
  }

  onImageError(event: any, index: number) {
    event.target.src = this.defaultImage;
  }
  
  selectEditor(selectedEd: keyof Home) {
    if (this.selectedEditor == selectedEd) {
      this.selectedEditor = undefined;
    } else {
      this.selectedEditor = selectedEd;
    }
  }

  trackbyId(i:number, article:Article ) {
    return trackById(i, article);
  }

  ngOnInit() {
    this.titleService.setTitle("Crearse");
    this.meta.updateTag({ property: 'og:site_name', content: 'Crearse' });
    this.meta.updateTag({ property: 'og:title', content: 'Página principal - Crearse' });
    this.meta.updateTag({ property: 'og:url', content: '' }); //pendent
    this.meta.updateTag({ property: 'og:locale', content: "es_ES" }); //pendent
    this.meta.updateTag({ property: 'og:type', content: "profile" });
    this.meta.updateTag({ property: 'og:description', content: 'Página principal de la psicoanalista y artista Ximena Sosa, mejicana establecida en Barcelona.' });
    this.meta.updateTag({ property: 'og:author', content: 'Ximena Sosa' }); //pendent
    // this.meta.updateTag({ property: 'og:published_time', content: new Date(article.createdAt!).toString() });
    // this.meta.updateTag({ property: 'og:updated_time', content: new Date(article.updatedAt!).toString() });
    this.meta.updateTag({ property: 'og:image', content: '../../../assets/images/logo' });
    this.meta.updateTag({ property: 'og:image:alt', content: 'Logo de Crearse' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Ximena Sosa, psicoanalista' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:image', content: '../../../assets/images/logo' });
    this.meta.updateTag({ name: 'twitter:image:alt', content: 'Logo de Crearse' });
  }

    openConfirmationModal() {
    this.modal.open();
  }

  //Aquest funció modifica un document, així que suposo q hauria de modificar únic secondary
  modifyItem(aboutFromChild: {text:string}) {
    setTimeout(() => { this.loaderService.showSpinner() });
    this.homeData[this.selectedEditor!] = aboutFromChild.text;
    this.homeService.modifyItem(this.homeData).then(res => {
      this.homeDataSubj.next(this.homeData);
      console.log(res);
      setTimeout(() => { this.loaderService.hideSpinner() });
      alert('Modificación realizada con éxito.');
    }).catch(e => {
      console.log('Error when trying to modify object secondary: ' + e);
      setTimeout(() => { this.loaderService.hideSpinner() });
      alert('Error al intentar modificar el texto.');
    }
    );
  }

canDeactivate(nextState?: any): boolean {
  if (this.itemFormCompList.length > 0) {
    for (let comp of this.itemFormCompList) {
      if (comp.itemForm.dirty) {
        return window.confirm('Seguro que quieres cambiar de página? Se perderá la información introducida.');
      }
    }
  }
  return true;
}


  ngOnDestroy() {
    this.articlesService.lastItemTimestamp = undefined;
    this.homeService.lastItemTimestamp = undefined;

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
