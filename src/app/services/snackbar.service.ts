import { ComponentRef, Injectable } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { SnackbarComponent } from '../shared/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private overlayRef: OverlayRef | null = null;

  snackbarComponentRef: ComponentRef<any> | undefined;

  constructor(private overlay: Overlay) {}

  open(message: string, duration = 3000, mode: 'success' | 'error' | 'warning' | 'info' = 'info') {
    // Create an overlay reference if not already existing
    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create({
        positionStrategy: this.overlay.position().global().centerHorizontally().bottom('10px'),
        hasBackdrop: false,
        panelClass: 'snackbar-panel',
      });
    }

    // Create a portal for the SnackbarComponent
    const snackbarPortal = new ComponentPortal(SnackbarComponent);

    // Attach the component to the overlay
    this.snackbarComponentRef = this.overlayRef.attach(snackbarPortal);

    // Set the message on the SnackbarComponent
    this.snackbarComponentRef.instance.message = message;
    this.snackbarComponentRef.instance.mode = mode;
    this.snackbarComponentRef.instance.animationState = 'visible';

    // Close the snackbar after the specified duration

    if (duration < 0) {
      return;
    }

    setTimeout(() => {
      this.close();
    }, duration);
  }

  close() {
    if (this.overlayRef) {
      if (this.snackbarComponentRef) {
        this.snackbarComponentRef.instance.animationState = 'void';
      }
      this.overlayRef.detach();
    }
  }
}
