import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoursesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
