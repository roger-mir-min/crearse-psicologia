import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './services-components.component.html',
  styleUrls: ['./services-components.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
