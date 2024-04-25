import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.css'],
  animations: [
    trigger('slideUpDown', [
      state('void', style({ transform: 'translateY(100%)' })),
      state('visible', style({ transform: 'translateY(0)' })),
      transition('void <=> visible', animate('.05s ease-in-out')),
    ]),
  ],
})
export class SnackbarComponent {
  @Input() message: string | undefined;

  @Input() duration: number | undefined;

  @Input() mode: 'success' | 'error' | 'warning' | 'info' = 'info';

  @Input() animationState: 'void' | 'visible' = 'void';

  get snackBarModeClass() {
    const lookup = {
      success: 'bg-green-500 text-white',
      error: 'bg-red-500 text-white',
      warning: 'bg-yellow-300 text-black',
      info: 'bg-blue-400 text-black',
    };
    return lookup[this.mode];
  }

  get iconMode() {
    const lookup = {
      success: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
      error: 'M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z',
      warning: 'M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z',
      info: 'm11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z',
    };
    return lookup[this.mode];
  }
}
