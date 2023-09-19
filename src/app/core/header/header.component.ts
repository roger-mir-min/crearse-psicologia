import { ChangeDetectionStrategy, Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { WHATSAPP_COMPLETE_URL } from 'src/app/models/whatsapp_data';
import { AuthService } from 'src/app/services/auth.service';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { RouterLinkActive } from '@angular/router';
import { WhatsappBtnComponent } from 'src/app/shared/components/whatsapp-btn/whatsapp-btn.component';
import { toggleAriaExpanded } from './toggle-aria-expanded.directive';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, NgIf, AsyncPipe, RouterLinkActive, WhatsappBtnComponent, NgClass,
  toggleAriaExpanded],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  @ViewChild('servicesDropdown') servicesDropdown!: ElementRef;

  whatsapp_url = WHATSAPP_COMPLETE_URL;
  isLoggedIn$ = this.authService.isLoggedIn$;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  logout() {
    this.authService.logout().then(res => {
      this.router.navigate(['admin/login']);
    }).catch(error => {
      alert('Error al salir: ' + error);
    })
  }

  servicesIsOpen = false;
  toggleServices() {
    this.servicesIsOpen = !this.servicesIsOpen;
  }

    @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;

     if (targetElement && this.servicesDropdown.nativeElement !== targetElement
       && !this.servicesDropdown.nativeElement.contains(targetElement)
      && this.servicesDropdown.nativeElement.hasAttribute('open')) {
        this.servicesDropdown.nativeElement.removeAttribute('open');
    }
  }


}
