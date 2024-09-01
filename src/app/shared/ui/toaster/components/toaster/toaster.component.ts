import {
  AsyncPipe,
  CommonModule,
  NgFor,
  NgTemplateOutlet,
} from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToasterService } from '../../service/toaster.service';
import { ToastType } from '../../types/toast.type';
import { map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [NgFor, AsyncPipe, NgTemplateOutlet],
  template: `
    <div class="toaster-container">
      <div class="toaster-container__left">
        <ng-container
          [ngTemplateOutlet]="order"
          [ngTemplateOutletContext]="{
            toasts: errors$ | async
          }"
        ></ng-container>
      </div>
      <div class="toaster-container__right">
        <ng-container
          [ngTemplateOutlet]="order"
          [ngTemplateOutletContext]="{
            toasts: success$ | async
          }"
        ></ng-container>
      </div>
    </div>

    <ng-template #order let-toasts="toasts">
      @for (toast of toasts; track toast._id) {
      <div
        class="toaster"
        [class.toaster--success]="toast.type === types.SUCCESS"
        [class.toaster--error]="toast.type === types.ERROR"
      >
        <span class="toaster__text"> {{ toast.message }} </span>
      </div>
      }
    </ng-template>
  `,
  styleUrl: './toaster.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToasterComponent {
  public types = ToastType;
  public readonly toaster = inject(ToasterService);
  public errors$ = this.toaster.toasts.pipe(
    map((toasts) => toasts.filter((toast) => toast.type === ToastType.ERROR)),
    takeUntilDestroyed()
  );
  public success$ = this.toaster.toasts.pipe(
    map((toasts) => toasts.filter((toast) => toast.type === ToastType.SUCCESS)),
    takeUntilDestroyed()
  );
}
