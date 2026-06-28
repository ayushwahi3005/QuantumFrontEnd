import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByStatus'
})
export class FilterByStatusPipe implements PipeTransform {
  transform(statusCounts: any[], status: string): any[] {
    if (!statusCounts || !status) {
      return [];
    }
    return statusCounts.filter(item => item.status === status.toUpperCase());
  }
}
