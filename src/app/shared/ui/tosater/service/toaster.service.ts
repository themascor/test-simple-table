import { Injectable, NgZone } from '@angular/core';
import { ToasterComponent } from '../components/toaster/toaster.component';
import { Toast, ToastType } from '../types/toast.type';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  private toastTime = 2000;
  private readonly _toaster = new BehaviorSubject<Toast[]>([]);
  get toasts(): Observable<Toast[]> {
    return this._toaster.asObservable();
  }
  constructor(private ngZone: NgZone) {}

  toast(type: ToastType, message: string): void {
    const toast = {
      type,
      message,
      _id: new Date().getTime(),
    };
    this.push(toast);
    this.deleteAfter(this.toastTime, toast._id);
  }

  private deleteAfter(time: number, id: number): void {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => this.delete(id), time);
    });
  }

  private delete(id: number): void {
    this._toaster.next(this._toaster.value.filter((items) => items._id !== id));
  }

  private push(toast: Toast) {
    const toasts = this._toaster.value;
    toasts.push(toast);
    this._toaster.next(toasts);
  }
}
