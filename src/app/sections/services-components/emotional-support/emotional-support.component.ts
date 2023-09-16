import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-emotional-support',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './emotional-support.component.html',
  styleUrls: ['./emotional-support.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmotionalSupportComponent implements OnInit {


  ngOnInit() {
  }

}
