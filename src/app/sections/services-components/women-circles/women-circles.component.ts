import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Women } from 'src/app/models/women';
import { FirestoreCrudService } from 'src/app/services/crud/firestore-crud.service';
import { WomenService } from 'src/app/services/crud/women.service';

@Component({
  selector: 'app-womens-circle',
  standalone: true,
  imports: [RouterOutlet],
  providers: [{ provide: FirestoreCrudService, useClass: WomenService }],
  templateUrl: './women-circles.component.html',
  styleUrls: ['./women-circles.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WomensCircleComponent implements OnInit {

  constructor() {}

  ngOnInit() {
  }

}
