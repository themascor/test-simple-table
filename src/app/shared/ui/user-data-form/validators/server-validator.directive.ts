import { Directive, inject, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { SERVER_VALIDATION_TOKEN } from './user-server-validator/server-validation-token.type';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User } from '../../../user-data/types/user.type';

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
  private readonly errorsProvider = inject(SERVER_VALIDATION_TOKEN, {
    host: true,
  });
  private onValidatorChange!: () => void;
  constructor() {
    this.errorsProvider.errors$
      .pipe(takeUntilDestroyed())
      .subscribe((_) => this.onValidatorChange && this.onValidatorChange());
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const errors = this.errorsProvider.errors();
    const fieldErrors = errors ? errors[this.fieldId] || [] : [];
    return fieldErrors.length > 0 ? { serverValidator: fieldErrors } : null;
  }
  registerOnValidatorChange?(fn: () => void): void {
    this.onValidatorChange = fn;
  }
}
