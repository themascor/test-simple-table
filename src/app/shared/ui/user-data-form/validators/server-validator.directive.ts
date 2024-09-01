import { Directive, inject, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { SERVER_VALIDATION_TOKEN } from './user-server-validator/server-validation-token.type';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User } from '../../../data/user-data/types/user.type';
import { tap } from 'rxjs';

@Directive({
  selector: '[appServerValidatorFor]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ServerValidatorDirective,
      multi: true,
    },
  ],
  standalone: true,
})
export class ServerValidatorDirective implements Validator {
  @Input({ required: true, alias: 'appServerValidatorFor' }) fieldId = '';
  private readonly errorsProvider = inject(SERVER_VALIDATION_TOKEN);
  private onValidatorChange!: () => void;
  private firstShow: boolean = true;
  constructor() {
    this.errorsProvider.errors$
      .pipe(
        tap(() => {
          this.firstShow = true;
        }),
        takeUntilDestroyed()
      )
      .subscribe((_) => this.onValidatorChange && this.onValidatorChange());
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (!this.firstShow) {
      return null;
    }
    this.firstShow = false;
    const errors = this.errorsProvider.errors();
    const fieldErrors = errors ? errors[this.fieldId] || [] : [];
    const error =
      fieldErrors.length > 0 ? { serverValidator: fieldErrors } : null;
    return error;
  }
  registerOnValidatorChange?(fn: () => void): void {
    this.onValidatorChange = fn;
  }
}
