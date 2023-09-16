import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageNotFoundComponent implements OnInit {

  constructor(private meta: Meta) { }

  ngOnInit() {
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
  }

  ngOnDestroy() {
    this.meta.removeTag("name='robots'");
  }
}
