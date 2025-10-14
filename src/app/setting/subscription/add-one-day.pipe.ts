import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addOneDay',
  standalone: true
})
export class AddOneDayPipe implements PipeTransform {

  transform(value: Date | string | null): Date | null {
    if (!value) return null;
    let date = new Date(value);
    date.setDate(date.getDate() + 1); // Add 1 day
    return date;
  }

}
