import { Pipe, PipeTransform } from '@angular/core';
import { ItemType } from 'src/app/models/item-type';

@Pipe({
  name: 'translateType',
  standalone: true
})
export class TranslateTypePipe implements PipeTransform {

  transform(value: ItemType | 'text'): string {
    switch (value) {
      case 'course':
        return 'curso';
      case 'article':
        return 'artículo';
      case 'em-support':
        return 'ítem de acompañamiento emocional';
      case 'women':
        return 'ítem de círculo de mujeres';
      case 'text':
        return 'texto';
      default:
        return value;
    }
  }

}
