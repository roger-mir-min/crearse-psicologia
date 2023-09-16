import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticlesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
