import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mappingFilterPipe',
  standalone: true
})
export class MappingFilterPipePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
