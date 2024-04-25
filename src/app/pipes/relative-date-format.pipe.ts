import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';

@Pipe({
  name: 'unixTimeToRelativeFormat',
  standalone: true,
})
export class UnixTimeToRelativeFormat implements PipeTransform {
  transform(value: number): unknown {
    return formatDistanceToNow(new Date(value * 1000)).replace('about', '');
  }
}
