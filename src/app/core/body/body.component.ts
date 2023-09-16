import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BodyComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
