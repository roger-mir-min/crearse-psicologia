import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from "@angular/core";

@Directive({
  selector: '[toggle-aria-label]',
  standalone: true
})
export class toggleAriaExpanded {
  @Output() clickOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  @HostListener('document:click', ['$event.target'])
  public onClick(target: any): void {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-expanded', 'false');
    } else {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-expanded', 'true');
    }
  }
}
