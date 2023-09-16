import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'html-encode'
})
export class HtmlEncodePipe implements PipeTransform {

  transform(value: string): string {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(value));
    return div.innerHTML;
  }

}
