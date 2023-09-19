import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, ViewChild } from '@angular/core';
import { ArticlesService } from 'src/app/services/crud/articles.service';
import { CoursesService } from '../../services/crud/courses.service';
import { Article } from 'src/app/models/article';
import { Course } from 'src/app/models/course';
import { AdminItemFormComponent } from '../admin-item-form/admin-item-form.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Item } from 'src/app/models/item';
import { ItemType } from 'src/app/models/item-type';
import { AsyncPipe, NgIf } from '@angular/common';
import { LoaderService } from '../../services/loader.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Women } from 'src/app/models/women';
import { WomenService } from 'src/app/services/crud/women.service';
import { EmSupport } from 'src/app/models/em-support';
import { EmSupportService } from '../../services/crud/em-support.service';
import { CanComponentDeactivate } from 'src/app/shared/can-deactivate.guard';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-admin-add-content',
  standalone: true, 
  imports: [AdminItemFormComponent, ReactiveFormsModule, NgIf, AsyncPipe],
  templateUrl: './admin-add-content.component.html',
  styleUrls: ['./admin-add-content.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminAddContentComponent implements OnInit, CanComponentDeactivate {
  @ViewChild(AdminItemFormComponent) itemFormComponent!: AdminItemFormComponent;

  canDeactivate(nextState?: any): boolean {
    if (this.itemFormComponent.itemForm.dirty) {
      return window.confirm('Seguro que quieres cambiar de página? Se perderá la información introducida.');
    } else {
      return true;
    }
  }

  loading$: Observable<boolean>;
  isErrorSubj = new BehaviorSubject(false);
  isError$ = this.isErrorSubj.asObservable();

  isSuccessSubj = new BehaviorSubject(false);
  isSuccess$ = this.isSuccessSubj.asObservable();
  
  selectForm!: FormGroup;
  selectedType!: ItemType;

  constructor(private articlesService: ArticlesService,
    private coursesService: CoursesService, private womenService: WomenService, 
    private emSupportService: EmSupportService,
    private fb: FormBuilder, private loaderService: LoaderService,
    private router: Router, private destroy: DestroyRef) {
      this.loading$ = this.loaderService.isLoading$;
  }
  


  ngOnInit() {
    this.selectForm = this.fb.group({
      option: ['']
    });

    this.selectForm.get('option')?.valueChanges.pipe(takeUntilDestroyed(this.destroy)).subscribe(value => {
      this.selectedType = value;
    });

    this.selectForm.get('option')?.setValue('article');
  }

  //refactor: inserir un servei o altre segons type
  addItem(item: Item) {
    setTimeout(() => { this.loaderService.showSpinner() });
    this.isErrorSubj.next(false);
    this.isSuccessSubj.next(false);    

    if (this.selectedType == 'article') {
      this.addArticle(item as Article);
    } else if (this.selectedType == 'course') {
      this.addCourse(item as Course);
    } else if (this.selectedType == 'women'){
      this.addWomen(item as Women);
    } else if (this.selectedType == 'em-support'){
      this.addEmSupport(item as EmSupport);
    } else {
      console.error("Invalid type");
      this.isErrorSubj.next(true);
    }
  }

  async addArticle(article: Article) {
    await this.articlesService.addItem(article).then((res: any) => {
      setTimeout(() => { this.loaderService.hideSpinner() });
      this.isSuccessSubj.next(true);    
      location.reload();
    }).catch(e => {
      console.error(e);
      setTimeout(() => { this.loaderService.hideSpinner() });
      this.isErrorSubj.next(true);
    })
  }
  
  async addCourse(course: Course) {
    await this.coursesService.addItem(course).then((res: any) => {
      setTimeout(() => { this.loaderService.hideSpinner() });
      this.isSuccessSubj.next(true); 
      location.reload();
    }).catch(e => {
      console.error(e);
      setTimeout(() => { this.loaderService.hideSpinner() });
      this.isErrorSubj.next(true);
    })
  }

  async addWomen(wm: Women) {
    await this.womenService.addItem(wm).then((res: any) => {
      setTimeout(() => { this.loaderService.hideSpinner() });
      this.isSuccessSubj.next(true); 
      location.reload();
    }).catch(e => {
      console.error(e);
      setTimeout(() => { this.loaderService.hideSpinner() });
      this.isErrorSubj.next(true);
    })
  }

  async addEmSupport(em: EmSupport) {
    await this.emSupportService.addItem(em).then((res: any) => {
      setTimeout(() => { this.loaderService.hideSpinner() });
      this.isSuccessSubj.next(true); 
      location.reload();
    }).catch(e => {
      console.error(e);
      setTimeout(() => { this.loaderService.hideSpinner() });
      this.isErrorSubj.next(true);
    })
  }
  

}
