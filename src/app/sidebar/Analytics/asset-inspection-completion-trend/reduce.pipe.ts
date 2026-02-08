import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reduce',
})
export class ReducePipe implements PipeTransform {
  transform(array: any[], callback: string, initialValue: any = 0): any {
    if (!array || array.length === 0) return initialValue;

    if (callback === '+') {
      return array.reduce((acc, item) => {
        const value = typeof item === 'object' ? item.count : item;
        return acc + (typeof value === 'number' ? value : 0);
      }, initialValue);
    }

    return initialValue;
  }
}