import { Component, ElementRef, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-modal',
    standalone: true,
  imports: [],
  templateUrl: 'modal.component.html',
  styleUrls: ['modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent implements OnInit, OnDestroy {
  private element: any;

    constructor(private el: ElementRef) {
        this.element = el.nativeElement;
    }

    ngOnInit() {
        document.body.appendChild(this.element);

        this.element.addEventListener('click', (el: any) => {
            if (el.target.className === 'confirmation-modal') {
                this.close();
            }
        });
    }

    ngOnDestroy() {
      this.element.remove();
    }

    open() {
        this.element.style.display = 'block';
        document.body.classList.add('confirmation-modal-open');
    }

    close() {
        this.element.style.display = 'none';
        document.body.classList.remove('confirmation-modal-open');
    }
}
