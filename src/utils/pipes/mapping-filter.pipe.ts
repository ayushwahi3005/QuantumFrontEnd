import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'mappingFilter' })
export class MappingFilterPipe implements PipeTransform {
  transform(mappingList: any[], selectedName: string): any[] {
    const found = mappingList.find(m => m.name === selectedName);
    return found ? found.mapping : [];
  }
}