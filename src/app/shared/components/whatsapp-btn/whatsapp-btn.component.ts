import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { WHATSAPP_COMPLETE_URL } from 'src/app/models/whatsapp_data';

@Component({
  selector: 'app-whatsapp-btn',
  standalone: true,
  templateUrl: './whatsapp-btn.component.html',
  styleUrls: ['./whatsapp-btn.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WhatsappBtnComponent implements OnInit {

  whatsappUrl = WHATSAPP_COMPLETE_URL;

  constructor() { }

  ngOnInit() {
  }

}
