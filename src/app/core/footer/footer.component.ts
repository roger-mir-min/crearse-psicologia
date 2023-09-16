import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { redirectToWhatsapp } from '../utilities/redirect-to-whatsapp';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  redirectToWhatsapp() {
    redirectToWhatsapp();
  }

}
